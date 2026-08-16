# Broken Drone — Tuwaiq Drones Activity

Interactive 6-level Arabic classroom website for the “Broken Drone” activity.

## What it includes
- 6 progressively unlocked repair levels
- A simple 3D drone built in Three.js (no 3D model file needed)
- Tuwaiq-inspired purple / teal theme using the provided presentation assets
- Arabic-first child-friendly UI
- Hints, sound feedback, progress tracking, success animations, and final completion screen
- Responsive layout for laptop/projector/tablet
- No build step

## Run locally
Because the 3D module is loaded from a CDN, open the site through a small web server rather than double-clicking `index.html`.

### Python
```bash
python -m http.server 8000
```
Then open:
`http://localhost:8000`

The game itself still works with a simplified fallback drone if the 3D library cannot load.

## Publish with GitHub Pages
1. Create a new GitHub repository, e.g. `broken-drone-activity`.
2. Upload everything in this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**.
6. Save.
7. GitHub will give you a public URL such as:
   `https://YOUR-USERNAME.github.io/broken-drone-activity/`

## Classroom flow
Each level describes a symptom and asks the students to identify the missing part:
1. Battery
2. Motor
3. Propeller
4. Frame
5. Flight controller
6. Camera / sensors

After the sixth level, students receive a “Drone Engineer” completion screen.

## Files
- `index.html` — page structure
- `styles.css` — visual theme and responsive layout
- `game.js` — game logic + 3D drone
- `assets/` — Tuwaiq theme background/logo assets taken from the supplied presentation
