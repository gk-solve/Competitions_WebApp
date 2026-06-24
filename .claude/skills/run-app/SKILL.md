---
name: run-app
description: Use this skill when the user says "run the app", "lance l'application", "démarre l'app", or asks to start/preview Competitions WebApp locally. Starts the PHP built-in server on localhost:8080 from the current project directory and opens the app.
---

# Run Competitions WebApp locally

This project has no build step. It runs directly via PHP's built-in server, serving the
project root as the document root, on **port 8080** (this port is fixed by convention for
this app — do not change it).

The project directory is the current working directory wherever this skill runs. Never
hardcode an absolute path to it — always operate relative to `pwd` (or whatever directory
the user/harness is currently in), since the checkout location can vary between machines.

## Steps

1. Confirm the current directory looks like the right project (sanity check, don't hardcode
   a path):
   ```bash
   test -f index.htm -a -d api -a -d data && echo OK
   ```
   If this fails, ask the user to `cd` into the Competitions_WebApp project root first.

2. Check port 8080 isn't already in use by a previous run of this app:
   ```bash
   lsof -i :8080 -sTCP:LISTEN
   ```
   If something is already listening there (e.g. a server you started earlier in this
   session), don't start a second one — just open the URL in step 4.

3. Start the PHP server in the background from the project root (working directory = current
   directory, not an absolute path):
   ```bash
   php -S localhost:8080
   ```
   Run this with `run_in_background: true` since it's a long-running process. If PHP isn't
   installed or the command fails, report the error to the user instead of retrying blindly.

4. Open the app in the default browser:
   ```bash
   open http://localhost:8080/index.htm
   ```

5. Tell the user the app is running at http://localhost:8080/index.htm and that the server
   is running in the background (mention how to stop it: kill the background shell task).
