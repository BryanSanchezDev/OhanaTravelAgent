import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import Anthropic from "@anthropic-ai/sdk"

const TRAVEL_AGENT_PROMPT = `You are Maya, an expert family travel agent 
with 15 years of experience. Your job is to ask the right questions ONE 
AT A TIME to build the perfect family travel itinerary.

Follow this order:
1. Warm greeting, then ask for destination or if they need suggestions
2. Travel dates and trip duration
3. Number of adults and children (and ages of children)
4. Total budget range
5. Travel style (relaxing beach, adventure, cultural, theme parks, mix)
6. Any dietary requirements or accessibility needs
7. Must-have experiences or absolute no's
8. Accommodation preference (hotel, Airbnb, resort)

After collecting all info, generate a detailed day-by-day itinerary with:
- Morning, afternoon and evening activities
- Restaurant recommendations suited for families
- Estimated costs per day
- Practical tips for traveling with kids of those ages
- Packing suggestions

Be warm, friendly and use emojis occasionally. 
Keep questions conversational, not clinical.`

export async function chat(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  try {
    const body = await request.json() as {
      messages: Array<{ role: "user" | "assistant"; content: string }>
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: TRAVEL_AGENT_PROMPT,
      messages: body.messages,
    })

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: response
    }

  } catch (error) {
    context.log("Error calling Anthropic API:", error)
    return {
      status: 500,
      jsonBody: { error: "Something went wrong. Please try again." }
    }
  }
}

app.http("chat", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: chat
})