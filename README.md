# Nayana S Parthan — portfolio

A responsive portfolio for a full stack and AI/ML developer, with monochrome backgrounds, blue accents, and translucent glass surfaces inspired by [soliciabrown.com](https://soliciabrown.com/). The profile, work history, projects, skills, education, languages, and contact information are based on the supplied CV. Soft liquid forms drift and morph throughout the page. The engineering story uses the same liquid material, while the process section retains its interactive particle forms.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite.

## Production

```sh
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static web host. This project has no backend or API keys.

## GitHub Pages

Push to `main` to build and deploy the site through the GitHub Actions workflow in `.github/workflows/deploy.yml`. The project site is served from `https://askadarshskumar-dev.github.io/Portfolio/`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Update the portfolio

- **Profile, experience, projects, skills, education, and languages:** `src/content.ts`.
- **Page layout and interactive controls:** `src/App.tsx` and `src/Experience.tsx`.
- **Colors, typography, and responsive layouts:** `src/styles.css`, `src/experience.css`, and `src/glass.css`.
- **Scroll transitions, desktop project gallery, and portrait effects:** `src/useMotion.ts` and `src/motion.css`.
- **Three.js scenes and their palette:** `src/three/scenes.ts` and `src/three/SceneCanvas.tsx`.
- **Resume download:** `public/assets/Nayana_S_Parthan_CV.pdf`.
- **Profile image:** `public/assets/nayana-standing.png`. The source is a transparent full-body PNG; the website shows an enlarged crop from the head to the abdomen on every screen. The crop remains unframed, beside the introduction on desktop and beneath it on mobile. Its effects include an entrance reveal, pointer tilt, and a gentle float. Pointer updates run at most once per display frame. Adjust `--portrait-enlargement` in `src/motion.css` to change its size without changing the crop.
- **Image provenance:** the standing image was generated from the second professional portrait using the built-in image generation tool. The exact prompt is in `docs/standing-portrait-prompt.md`.
- **Page title and search description:** `index.html`.

## Included details

The site includes the five projects listed in the CV, a downloadable CV, email and phone links, responsive navigation, ambient-animation controls, and reduced-motion support. On larger desktop screens, vertical scrolling moves through a horizontal project gallery; focus the gallery and use the arrow keys to advance. Smaller screens and reduced-motion mode show a regular project grid. Pausing stops the ambient animation and automatic photo effects while scroll navigation continues to follow the user.
