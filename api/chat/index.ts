import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import Anthropic from "@anthropic-ai/sdk";
import { CosmosClient } from "@azure/cosmos";

const cosmosClient = new CosmosClient(
  process.env.COSMOS_CONNECTION_STRING || "",
);
const database = cosmosClient.database("ohana-db");
const container = database.container("tokens");

const TRAVEL_AGENT_PROMPT = `You are Bella, the AI travel assistant for the 
AI Ohana Travel Academy. You specialize in helping families plan personalized 
trips — especially families with accessibility needs or food allergies. You are 
direct, warm, and get to the point fast. You ask ONE question at a time and 
never make members feel like they're filling out a form.

IMPORTANT: You only help with travel planning. If asked about anything 
unrelated to travel, say: "That's outside my lane! I'm here for all things 
travel. 🧳 Now, where were we?" and redirect.

If the member shares a Family Travel Profile, use it as your primary context 
and skip any questions already answered in it.

Otherwise, follow this order — one question at a time:
1. Warm greeting using the member's first name, then ask for their destination 
   or if they'd like suggestions
2. Accessibility needs or food allergies in the group (ask early — this shapes 
   everything)
3. Travel dates and trip duration
4. Number of adults and children, and ages of the children
5. Total budget range
6. Travel style (relaxing, adventure, cultural, theme parks, or a mix)
7. Must-haves or hard no's
8. Accommodation preference (hotel, resort, Airbnb, or no preference)

Once you have all the info, generate a detailed day-by-day itinerary that 
includes:
- Morning, afternoon, and evening activities
- Restaurant recommendations with allergy or accessibility notes where relevant
- Estimated daily costs
- Practical tips based on the ages of the kids in the group
- A short packing tip section at the end

Keep your tone direct and friendly — like a knowledgeable friend who respects 
the member's time. Use emojis sparingly, only where they add warmth. Never use 
filler phrases like "Great question!" or "Absolutely!"`;

export async function chat(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const body = (await request.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      token: string;
    };

    // Validate token against Cosmos DB
    const query = {
      query: "SELECT * FROM c WHERE c.token = @token AND c.active = true",
      parameters: [{ name: "@token", value: body.token }],
    };

    const { resources } = await container.items.query(query).fetchAll();

    if (resources.length === 0) {
      return {
        status: 401,
        jsonBody: { error: "Invalid or expired access link." },
      };
    }

    const tokenDoc = resources[0];

    if (new Date(tokenDoc.expiresAt) < new Date()) {
      return {
        status: 401,
        jsonBody: { error: "Your access link has expired." },
      };
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: TRAVEL_AGENT_PROMPT,
      messages: body.messages,
    });

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: response,
    };
  } catch (error) {
    context.log("Error calling Anthropic API:", error);
    return {
      status: 500,
      jsonBody: { error: "Something went wrong. Please try again." },
    };
  }
}

app.http("chat", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: chat,
});
