# Assets

## Temporary profile image

- Repository path: `public/assets/portrait.jpg`.
- This image is retained as a temporary profile placeholder at the owner's request. Replace it with the intended portrait in a later revision.
- The hero includes a Three.js shader treatment over the image and falls back to the image when WebGL is unavailable.

## Resume

- Repository path: `public/assets/Nayana_S_Parthan_CV.pdf`.
- The supplied CV is available to visitors through the Resume links in the site header and contact section.

## Fonts

Archivo and IBM Plex Mono are served locally. Their license files are included beside the font assets.

## Artwork

- Project card illustrations are CSS artwork in `src/App.tsx` and `src/styles.css`.
- Three.js scenes live in `src/three/scenes.ts`: the profile portrait shader, layered system, morphing particle sculpture, and interactive landscape.
- The 3D scenes use a dark plum base with blush and lilac accents. Three.js and GSAP are bundled as npm dependencies; no runtime CDN is required.
