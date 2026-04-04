# Family Travel Agent App

## What this is

A chat-based travel agent app for a Skool premium community.
The AI agent is called Bella and helps families plan perfect trips.

## Tech Stack

- React + TypeScript + Tailwind CSS v4
- Azure Functions v4 backend at /api/chat
- Google auth via Azure SWA built-in auth

## UI Requirements

- Travel-themed warm design: sunset oranges, ocean blues, soft greens
- Chat interface — elegant, clean, mobile-responsive
- Bella's avatar shown as 🧳 next to her messages
- User messages aligned right, Bella's aligned left
- Loading animation while waiting for Bella's response
- Logout button top-right corner showing user's email
- Access denied screen for non-approved members

## File Structure

- App.tsx — main app, checks auth via /.auth/me
- components/ChatWindow.tsx — full chat UI with message history
- components/MessageBubble.tsx — individual message component
- components/LoginScreen.tsx — shown if not logged in or unauthorized

## API

- POST /api/chat
- Body: { messages: [{role: "user", content: "..."}, ...] }
- Returns Anthropic message response object

## Auth

- Check /.auth/me to get logged in user info
- If not logged in redirect to /.auth/login/google
- Show logout button linking to /.auth/logout
