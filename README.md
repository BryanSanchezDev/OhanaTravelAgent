# Ohana Travel Agent

A chat-based AI travel planning app for a Skool premium community. Members get a personal magic link by email and use it to access Bella, their family travel agent powered by Claude.

## Tech Stack

- **Frontend** — React + TypeScript + Tailwind CSS v4, built with Vite
- **Backend** — Azure Functions v4 (Node.js)
- **Hosting** — Azure Static Web Apps
- **AI** — Anthropic Claude (claude-sonnet)
- **Database** — Azure Cosmos DB (token storage)
- **Email** — Resend (magic link delivery)

## How access works

There is no login form. Access is granted via a personal magic link:

1. You call `POST /api/generate-token` with the member's name and email (requires `x-admin-key` header)
2. A unique token is stored in Cosmos DB and a magic link is emailed via Resend
3. The member clicks the link — the token is validated and marked as used
4. Their session is stored in `localStorage` so they don't need the link again
5. A "Sign out" button clears the session

## API Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/chat` | POST | token | Send a message to Bella |
| `/api/validate-token` | POST | none | Validate a magic link token |
| `/api/generate-token` | POST | admin key | Generate and email a magic link |

## Local Setup

### Prerequisites

- Node.js 18+
- Azure SWA CLI: `npm install -g @azure/static-web-apps-cli`
- Azurite (for local Azure Storage emulation)

### Steps

1. Clone the repo
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Install API dependencies:
   ```bash
   cd api && npm install && cd ..
   ```
4. Create `api/local.settings.json` (gitignored — never commit this):
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "ANTHROPIC_API_KEY": "your-anthropic-api-key",
       "COSMOS_CONNECTION_STRING": "your-cosmos-connection-string",
       "RESEND_API_KEY": "your-resend-api-key",
       "ADMIN_KEY": "your-secret-admin-key",
       "APP_URL": "http://localhost:4280"
     }
   }
   ```
5. Start the app:
   ```bash
   swa start
   ```
   Runs at `http://localhost:4280`

## Production Deployment

Deploy via Azure Static Web Apps. Set all environment variables from `local.settings.json` as Application Settings in the Azure portal (except `AzureWebJobsStorage` and `APP_URL` which are handled by the platform).

## Generating a member link

```bash
curl -X POST https://your-app.azurestaticapps.net/api/generate-token \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key" \
  -d '{"email": "member@example.com", "name": "Jane"}'
```

The response includes the magic link and also sends it to the member's email.
