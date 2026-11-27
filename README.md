<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# NATEG Treasure Hunt

An interactive treasure hunt built with React, TypeScript, Vite, and Supabase. Player avatars load from the public `Avatars` Storage bucket. The game stores challenge progression locally and syncs its current challenge and completion count to the `players` table.

## Architecture

The frontend is organized around three boundaries:

- `domain/hunt` contains the hunt state types and pure progress rules. It has no browser or UI dependencies.
- `application/ports` defines the persistence contract used by the app.
- `infrastructure/persistence` implements browser storage and sends player registration and progression updates through the player-auth Edge Function.
- `components`, `hooks`, and `App.tsx` render screens and coordinate user actions. Challenge content stays in `data/challenges.ts`.

Players use a unique username with no PIN. Anyone who knows a username can access that player's account and progression, so this username-only flow is suitable only for a trusted prototype. Row-level security denies direct browser access to the table, and the Edge Function uses the Supabase service-role key server-side.

## Run locally

Prerequisite: Node.js.

1. Install dependencies with `npm install`.
2. Configure `VITE_SUPABASE_URL` and the public `VITE_SUPABASE_ANON_KEY` in `.env.local` using `.env.example` as a template. The anon/publishable key is public; database access remains protected by RLS and the Edge Function.
3. Link your existing Supabase project, apply the migrations, and deploy the Edge Function:

   ```sh
   supabase link --project-ref YOUR_PROJECT_ID
   supabase db push --remote=YOUR_PROJECT_ID
   supabase functions deploy player-auth --remote=YOUR_PROJECT_ID
   ```

4. Ensure the existing `Avatars` Storage bucket is public and contains `avatar1.jpg` through `avatar8.jpg`.
5. Start the development server with `npm run dev`; create a production build with `npm run build`.

Never add `SUPABASE_SERVICE_ROLE_KEY` to a `VITE_*` variable or commit it to the repository. The Edge Function uses Supabase's server-side environment variables.
