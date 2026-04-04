# 🧳 Family Travel Agent — AI-Powered Trip Planner

A chat-based travel planning app built with React, Azure Functions,
and the Anthropic Claude API. Deployed on Azure Static Web Apps
with Google OAuth for access control.

## Tech Stack

- React + TypeScript + Tailwind CSS v4
- Azure Static Web Apps + Azure Functions v4
- Anthropic Claude Sonnet API
- Google OAuth via Azure SWA built-in auth

## Local Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your values
3. Run `npm install`
4. Run `cd api && npm install && cd ..`
5. Run `swa start`

## Environment Variables

See `.env.example` for all required variables.
Never commit your `.env` file.
