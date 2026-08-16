# Restored True 3D Version

This is the repaired **single-file** version of the Broken Drone activity.

## Why this version is safer
The previous deployment could break if `index.html`, `styles.css`, and `game.js`
came from different versions.

This build puts the HTML, CSS, logo, and game code inside **one `index.html`**.
Only the Three.js 3D library is loaded online.

## GitHub Pages
Replace the current files in your repository with this `index.html`.

You can leave `.nojekyll` in the repository if you already have it.

Then refresh the GitHub Pages URL with Ctrl+F5.

## Propeller fix
Each propeller group is positioned at its own motor, and its blades are created
around the group's local origin. The propellers therefore rotate in place.
