import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"

export async function getRoles(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  // Reads approved emails from Azure environment variable
  // To add a member: update APPROVED_MEMBERS in Azure Portal — no code push needed
  const approvedMembers = (process.env.APPROVED_MEMBERS || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)

  try {
    const body = await request.json() as {
      clientPrincipal: { userDetails: string } | null
    }

    if (!body.clientPrincipal) {
      return {
        status: 200,
        jsonBody: { roles: [] }
      }
    }

    const userEmail = body.clientPrincipal.userDetails.toLowerCase()
    const isApproved = approvedMembers.includes(userEmail)

    return {
      status: 200,
      jsonBody: {
        roles: isApproved ? ["approved-member"] : []
      }
    }

  } catch (error) {
    context.log("Error in get-roles:", error)
    return {
      status: 200,
      jsonBody: { roles: [] }
    }
  }
}

app.http("get-roles", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: getRoles
})