# Quantix Studio

## Project info

Quantix Studio is a React, Vite, and Supabase application for the public marketing site and lightweight admin CMS.

## How can I edit this code?

Use `Node 20` for this repository. If you use `nvm`, run `nvm use` in the project root after cloning.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Use the repository Node version.
nvm use

# Step 4: Install the necessary dependencies.
npm i

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Project documentation

- `AGENTS.md` documents repository-specific implementation rules and known gotchas.
- `SUPABASE_LIVE_SCHEMA_AUDIT.md` records the current live Supabase schema, fields, relationships, RLS, and known app/schema mismatches.
- `PROJECT_AUDIT.md` records the latest scalability audit, applied optimizations, and next recommended passes.
- `DESIGN_SYSTEM.md` records the current visual system, global style primitives, and shared UI conventions.

## Stack Library Note

- The app no longer uses the legacy `public.tools` table.
- Homepage stack carousel, project build-stack chips, and admin stack management now read from `public.technologies`.
- Technology logos are stored in the `tools_logos` bucket and saved directly on `technologies.logo_path`.
- The removal migration for `public.tools` is [`supabase/migrations/20260622183000_drop_legacy_tools_table.sql`](supabase/migrations/20260622183000_drop_legacy_tools_table.sql).

## Local development

This project is a Vite app. The site will not open until the dev server is running.

Canonical local URL:

- `http://127.0.0.1:3000/`

Canonical start command:

```sh
npm run dev
```

Important:

- Open `http://127.0.0.1:3000/`, not bare `http://127.0.0.1/`
- The dev server is configured to use `127.0.0.1:3000` with a strict port
- If port `3000` is already occupied, stop the other process first instead of guessing another URL

To see which process is using the port:

```sh
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

## Deployment

Build the project with `npm run build` and deploy the generated `dist` output with the active hosting provider.
