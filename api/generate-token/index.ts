import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos"
import { Resend } from "resend"
import { randomBytes } from "node:crypto"

const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "")
const resend = new Resend(process.env.RESEND_API_KEY || "")

const database = cosmosClient.database("ohana-db")
const container = database.container("tokens")

export async function generateToken(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  // Protect this endpoint — only you can call it
  const adminKey = request.headers.get("x-admin-key")
  if (adminKey !== process.env.ADMIN_KEY) {
    return { status: 401, jsonBody: { error: "Unauthorized" } }
  }

  try {
    const body = await request.json() as { email: string; name: string }

    if (!body.email || !body.name) {
      return {
        status: 400,
        jsonBody: { error: "Email and name are required" }
      }
    }

    // Generate a secure random token
    const token = randomBytes(32).toString("hex")

    // Set expiry to 1 year from now
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    // Store token in Cosmos DB
    await container.items.upsert({
      id: token,
      email: body.email.toLowerCase(),
      name: body.name,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      active: true
    })

    // Build the magic link
    const appUrl = process.env.APP_URL || "http://localhost:4280"
    const magicLink = `${appUrl}?token=${token}`

    // Send the email via Resend
    await resend.emails.send({
      from: "Bella <mail.bryansanchez.dev>",
      to: body.email,
      subject: "Your access to Ohana Travel Agent 🧳",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1e40af;">Welcome to Ohana Travel Agent, ${body.name}! 🧳</h1>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            As a premium member you now have access to Bella, your personal AI family travel agent.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Click the button below to access your travel planning assistant:
          </p>
          <a href="${magicLink}" 
             style="display: inline-block; background-color: #1e40af; color: white; 
                    padding: 14px 28px; border-radius: 8px; text-decoration: none; 
                    font-size: 16px; font-weight: bold; margin: 20px 0;">
            Let's Begin Planning! ✈️
          </a>
          <p style="color: #6b7280; font-size: 14px;">
            Save this email — this is your personal access link. Please don't share it.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy this link into your browser:<br/>
            <a href="${magicLink}" style="color: #1e40af;">${magicLink}</a>
          </p>
        </div>
      `
    })

    return {
      status: 200,
      jsonBody: {
        message: `Magic link sent to ${body.email}`,
        magicLink // Also returned so you can copy it manually if needed
      }
    }

  } catch (error) {
    context.log("Error generating token:", error)
    return {
      status: 500,
      jsonBody: { error: "Failed to generate magic link" }
    }
  }
}

app.http("generate-token", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: generateToken
})