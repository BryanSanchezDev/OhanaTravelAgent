/// <reference types="node" />
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos"

const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING || "")
const database = cosmosClient.database("ohana-db")
const container = database.container("tokens")

export async function validateToken(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  try {
    const body = await request.json() as { token: string }

    if (!body.token) {
      return {
        status: 400,
        jsonBody: { valid: false, error: "No token provided" }
      }
    }

    const { resources } = await container.items.query({
      query: "SELECT * FROM c WHERE c.token = @token",
      parameters: [{ name: "@token", value: body.token }]
    }).fetchAll()

    if (resources.length === 0) {
      return {
        status: 200,
        jsonBody: { valid: false, error: "Invalid magic link" }
      }
    }

    const tokenDoc = resources[0]

    if (!tokenDoc.active) {
      return {
        status: 200,
        jsonBody: { valid: false, error: "This link has been deactivated" }
      }
    }

    if (tokenDoc.used) {
      return {
        status: 200,
        jsonBody: { valid: false, error: "This link has already been used" }
      }
    }

    if (new Date(tokenDoc.expiresAt) < new Date()) {
      return {
        status: 200,
        jsonBody: { valid: false, error: "This link has expired" }
      }
    }

    await container.items.upsert({
      ...tokenDoc,
      used: true,
      usedAt: new Date().toISOString()
    })

    return {
      status: 200,
      jsonBody: {
        valid: true,
        name: tokenDoc.name,
        email: tokenDoc.email
      }
    }

  } catch (error) {
    context.log("Error validating token:", error)
    return {
      status: 500,
      jsonBody: { valid: false, error: "Validation failed" }
    }
  }
}

app.http("validate-token", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: validateToken
})
