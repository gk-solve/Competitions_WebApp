---
name: run-app
description: Use this skill when the user says "run the app", "lance l'application", "démarre l'app", or asks to start/preview Competitions WebApp locally. Starts the FastAPI server (fastapi-server/) on localhost:8080 with hot reload, which serves both the REST API and the static frontend, and opens the app.
---

# Run Competitions WebApp locally (FastAPI backend, experimental branch)

This branch (`PythonFastAPIbackend`) replaces the original PHP backend with a FastAPI app in
`fastapi-server/`. A single process serves both the REST API (`/api/*`) and the static
frontend (HTML/CSS/JS), on **port 8080** (fixed by convention for this app — do not change
it).

The project directory is the current working directory wherever this skill runs. Never
hardcode an absolute path to it — always operate relative to `pwd` (or whatever directory
the user/harness is currently in), since the checkout location can vary between machines.

## Steps

1. Confirm the current directory looks like the right project (sanity check, don't hardcode
   a path):
   ```bash
   test -f index.htm -a -d fastapi-server -a -d data && echo OK
   ```
   If this fails, ask the user to `cd` into the Competitions_WebApp project root first.

2. Check port 8080 isn't already in use by a previous run of this app:
   ```bash
   lsof -i :8080 -sTCP:LISTEN
   ```
   If something is already listening there (e.g. a server you started earlier in this
   session), don't start a second one — just open the URL in step 5.

3. Make sure the virtual environment exists and dependencies are installed (first run only —
   skip if `fastapi-server/.venv` already exists):
   ```bash
   test -d fastapi-server/.venv || (cd fastapi-server && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt)
   ```

4. Start the FastAPI server with hot reload, in the background, from the project root
   (working directory = current directory, not an absolute path):
   ```bash
   (cd fastapi-server && source .venv/bin/activate && uvicorn main:app --reload --host localhost --port 8080)
   ```
   `--reload` restarts the server automatically on source changes. Run this with
   `run_in_background: true` since it's a long-running process. If Python/the venv isn't set
   up or the command fails, report the error to the user instead of retrying blindly.

5. Open the app in the default browser:
   ```bash
   open http://localhost:8080/index.htm
   ```

6. Tell the user the app is running at http://localhost:8080/index.htm and that the server
   is running in the background (mention how to stop it: kill the background shell task).
