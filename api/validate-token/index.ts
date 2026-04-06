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

    // Look up token in Cosmos DB
    const query = {
      query: "SELECT * FROM c WHERE c.token = @token",
      parameters: [{ name: "@token", value: body.token }]
    }

    const { resources } = await container.items.query(query).fetchAll()

    if (resources.length === 0) {
      return {
        status: 200,
        jsonBody: { valid: false, error: "Invalid magic link" }
      }
    }

    const tokenDoc = resources[0]

    // Check if token is active
    if (!tokenDoc.active) {
      return {
        status: 200,
        jsonBody: { valid: false, error: "This link has been deactivated" }
      }
    }

    // Check if token has expired
    if (new Date(tokenDoc.expiresAt) < new Date()) {
      return {
        status: 200,
        jsonBody: { valid: false, error: "This link has expired" }
      }
    }

    return {
      status: 200,
      jsonBody: {
        valid: true,
        memberName: tokenDoc.name,
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