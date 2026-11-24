<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# NATEG Treasure Hunt

An interactive treasure hunt built with React, TypeScript, and Vite. Progress is currently stored in the browser.

## Architecture

The frontend is organized around three boundaries:

- `domain/hunt` contains the hunt state types and pure progress rules. It has no browser or UI dependencies.
- `application/ports` defines the persistence contract used by the app.
- `infrastructure/persistence` implements that contract with browser local storage. A future backend can provide an API-backed adapter without putting HTTP or database code in React components.
- `components`, `hooks`, and `App.tsx` render screens and coordinate user actions. Challenge content stays in `data/challenges.ts`.

The intended dependency direction is UI → application/domain contracts ← infrastructure. Keep secrets and authoritative validation on a future server; browser state is user-controlled and is suitable only for this prototype's local progress.

## Run locally

Prerequisite: Node.js.

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Create a production build with `npm run build`.

The frontend does not currently call an AI service or require environment variables. When a backend is added, keep API credentials there and expose only the backend URL to the frontend if needed.
