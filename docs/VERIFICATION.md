# Verification

Verified October 2, 2026 with TypeScript, Vite, and Playwright/Chromium.

## Build and browser checks

- `npm run build` passes TypeScript and creates `dist/`.
- `npm run test:browser` passes all 15 checks. The current report is in [browser-results.json](./browser-results.json).
- The browser checks cover viewport overflow from 320px through 1440px, hero rendering, Three.js scene progression, stage selection, process morph targets and pointer bloom, pause/resume, world exploration, three concept-project dialogs, keyboard behavior, email copying, mobile navigation, reduced motion, and WebGL fallback behavior.
- The production build emits a Vite size advisory for the lazy Three.js chunk (about 553 kB, 141 kB gzip).

## Visual review

Reviewed the updated 1440×1000 desktop hero and 390×844 mobile chapters. The mobile hero is one viewport tall; About, work, process, and contact keep the immersive full-width composition. The process scene and active stage copy fit together without horizontal overflow. Screenshots are saved in [desktop-preview.png](./desktop-preview.png), [mobile-preview.png](./mobile-preview.png), and the `3d-*` scene previews.

The mobile layout keeps the active process text below the Three.js sculpture, and the work gallery continues vertically to give each selected project room for its case-study details.

## Content and artwork

The resume supplies personal identity, role, contact, location, and skills details. The portfolio keeps its three original concept-project examples; they are not claims about the owner's shipped applications. The portrait is generated from a photo reference supplied by the owner; the project cards are original illustrations rather than screenshots.

The motion preview is [3d-walkthrough.webm](./3d-walkthrough.webm). Four WebGL scenes provide the portrait shader, layered architecture story, morphing process sculpture with restrained pointer fisheye scatter and twinkling points, and procedural world. A still frame of the cursor effect is [3d-craft-hover.png](./3d-craft-hover.png).
