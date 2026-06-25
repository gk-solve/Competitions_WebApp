---
name: run-app
description: Use this skill when the user says "run the app", "lance l'application", "démarre l'app", or asks to start/preview Competitions WebApp locally. Starts the Express server (server/index.js) on localhost:8080, which serves both the REST API and the built React SPA (client-react/), and opens the app.
---

# Run Competitions WebApp locally (React frontend, experimental branch)

This branch (`ReactFrontEnd`) replaces the vanilla-JS/`.htm` frontend with a React SPA in
`client-react/` (Vite). A single Express process (`server/index.js`) serves both the REST API
(`/api/*`) and the built SPA, on **port 8080** (fixed by convention for this app — do not
change it).

Unlike the vanilla-JS version, there is no `index.htm`/`competitions.htm`/etc. anymore — the
SPA has a single entry point at **`/`**, and `/competitions`, `/competitors`, `/results` are
client-side routes handled by React Router (Express falls back to the SPA shell for any
non-`/api/*` GET so deep links survive a full page reload).

The project directory is the current working directory wherever this skill runs. Never
hardcode an absolute path to it — always operate relative to `pwd` (or whatever directory
the user/harness is currently in), since the checkout location can vary between machines.

## Steps

1. Confirm the current directory looks like the right project (sanity check, don't hardcode
   a path):
   ```bash
   test -d client-react -a -d server -a -d data && echo OK
   ```
   If this fails, ask the user to `cd` into the Competitions_WebApp project root first.

2. Check port 8080 isn't already in use by a previous run of this app:
   ```bash
   lsof -i :8080 -sTCP:LISTEN
   ```
   If something is already listening there (e.g. a server you started earlier in this
   session), don't start a second one — just open the URL in step 6.

3. Make sure server dependencies are installed (first run only — skip if
   `server/node_modules` already exists):
   ```bash
   test -d server/node_modules || (cd server && npm install)
   ```

4. Build the React app if it hasn't been built yet, or if source files changed since the last
   build (this branch serves the production build, not a dev server — rebuild after editing
   `client-react/src/**`):
   ```bash
   (cd client-react && npm install && npm run build)
   ```

5. Start the Express server in the background from the project root (working directory =
   current directory, not an absolute path):
   ```bash
   node server/index.js
   ```
   Run this with `run_in_background: true` since it's a long-running process. If Node isn't
   installed or the command fails, report the error to the user instead of retrying blindly.

6. Open the app in the default browser:
   ```bash
   open http://localhost:8080/
   ```

7. Tell the user the app is running at http://localhost:8080/ and that the server is running
   in the background (mention how to stop it: kill the background shell task).
