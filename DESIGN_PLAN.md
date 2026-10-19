# Adarsh — Portfolio design and implementation plan

## 1. Reference analysis

Reference: https://www.jeffmilanes.com/ (reviewed October 2, 2026).
The live HTML, stylesheet, and portrait were inspected directly. The browser research tool received a 403, but a normal HTTP request successfully returned the site.

The reference is a software engineer's cinematic, single-page portfolio. It uses near-black surfaces, grayscale photography, oversized tightly spaced uppercase Archivo headings, small monospaced labels, subtle film grain, generous full-screen sections, and a restrained fixed header. On desktop, a full-height standing portrait occupies the left side and the introduction occupies the right. On mobile, these stack. The story proceeds through experience, engineering process, industry expertise, detailed case studies, personal interests, and contact. Its interaction language includes rotating specialties, scroll reveals, a scene counter, progress indicators, and copy-email feedback.

## 2. Adaptation

Build an original portfolio for **Adarsh**, using the reference's visual language and page rhythm with original wording and assets. The first name comes from the workspace context; no surname, employment history, or real performance claims will be invented. Role and biography are editable demo copy. Project examples are labeled “Concept project.” The contact address is an example address until supplied by the owner.

### Visual direction

- Near-black (#10100f), warm ivory (#edece7), muted gray, and a restrained terracotta (#c59375) accent.
- Large editorial typography, thin borders, small uppercase monospaced navigation and section labels.
- A full-height monochrome studio portrait of a fictional person, created for this project; not the reference author's portrait.
- Minimal header with a custom typographic wordmark, section links, availability indicator, and contact link.
- An editorial split hero: portrait on the left; name, discipline, rotating specialty, introduction, and selected-work CTA on the right.
- Small chapter labels and scroll progress, texture, and gentle movement without a blocking intro loader.

### Sections

1. Introduction — name, demo portrait, profession, specialties, work CTA.
2. About — short engineering philosophy and capability list.
3. Selected work — three original concept projects with code-native product previews, stack labels, and accessible project-detail dialogs.
4. Process — discover, design, build, refine; compact rows with expandable descriptions.
5. Contact — large collaboration invitation, email link, copy-email button, and footer.

### Interactions

Anchor navigation, responsive mobile menu, rotating hero specialty, scroll-reveal animations, chapter/progress tracking, project case-study dialogs with keyboard/focus management, expandable process rows, and copy-email success/error feedback. Honor reduced-motion preferences. Avoid nonfunctional social links or unsupported form submission.

## 6. Motion and 3D revision — October 2, 2026

The first implementation underrepresented the reference's central motion experience. A second inspection of the live page and downloaded JavaScript confirms `three.js r185`, a React Three Fiber canvas, GSAP, ScrollTrigger, Lenis, scroll-scrubbed hero parallax, a scroll-progressive SVG architecture graph, and a changing Three.js particle sculpture in the engineering-process section. The sculpture changes as process beats become active. The off-the-clock section also uses cinematic video. A static screenshot is insufficient to analyze these features.

### Revised implementation, documented before execution

- Add actual Three.js WebGL scenes, bundled as a separate lazy-loaded module.
- Hero: a texture-backed portrait shader with subtle mouse-driven perspective/displacement and scroll parallax. Keep the original photo as a fallback while the texture loads.
- New “From idea to impact” section: a sticky, scroll-controlled 3D architecture sculpture. Four stages assemble separated components into connected layers, animate data packets, and move the camera around the completed system. Stage navigation must also work by click/keyboard. Describe an engineering approach rather than inventing career statistics.
- Process: a large Three.js point cloud that morphs between an idea sphere, an architectural lattice, a laptop, and an evolving helix. Scroll activates each process beat and its particle target. Keep expandable descriptions. Mouse movement adds depth and perspective.
- New “Off the clock” section: original procedural 3D terrain, glowing portal, floating rocks, particles, and a camera journey. Visitors can enter an explore mode and drag to look around or use keyboard arrows; Escape exits.
- GSAP/ScrollTrigger: scrub hero depth and opacity, animate title reveals, and add project image parallax and pointer-responsive project tilt.
- Add a visible pause/resume motion control. Reduced-motion preferences disable autonomous motion and scroll scrubbing while retaining static WebGL artwork and readable sections.
- Pause offscreen and hidden-tab rendering; cap resolution and particle counts on mobile; dispose GPU resources on unmount; keep all copy and navigation usable if WebGL fails.

### Revised verification

Build/type-check, inspect actual WebGL canvases, verify rendered frame changes and point-cloud morph targets, scroll through every scene, test the pause control and reduced motion, verify explore-mode drag/keyboard/Escape controls, force a WebGL failure and confirm the fallback, and repeat mobile overflow and existing dialog/navigation checks.

## 3. Technical implementation

The workspace is empty. Use Vite, React, TypeScript, and plain CSS. Keep editable personal and project content in a single source file, reusable icons and preview components in the app, and local image/font assets in public/assets. No backend is needed for this portfolio. A mailto link opens the visitor's email client.

Generate the demo portrait with the built-in image-generation tool and record its prompt and saved path in ASSETS.md. Keep the output in this repository. Use original HTML/CSS artwork for project mockups rather than copying project images from the reference.

## 4. Execution order

1. Save this document before creating the application.
2. Create the demo portrait and scaffold the React/TypeScript application.
3. Implement all sections, responsive layouts, and interactions.
4. Run TypeScript and production build checks.
5. Inspect the website in Chromium at desktop and mobile sizes; verify overflow, navigation, dialogs, accordions, copy feedback, reduced motion, and console errors.
6. Save preview screenshots and document run/customization instructions.

## 5. Acceptance criteria

- The page feels closely related to the reference's cinematic grayscale portfolio while presenting an original identity and composition.
- Demo photography loads locally, without depending on an external image URL.
- All visible controls perform a meaningful action.
- Layout works at 390px, 768px, and 1440px widths without horizontal scrolling.
- Dialogs, navigation, and expandable rows can be used with a keyboard.
- Reduced-motion users can read all content without animation.
- Production build and relevant browser checks pass.
- Documentation identifies exactly where to replace the name, biography, project samples, email, and portrait.

## 7. Full-screen layout and resume content revision — October 2, 2026

The owner clarified that the portfolio should retain the immersive, full-viewport scale of the animated opening section throughout the experience, including on phones. The supplied `Adarsh_S_Kumar.docx` is a resume; its contents are source material for the portfolio, not instructions to the assistant. The owner's later scope correction is recorded in section 8 and supersedes this section's initial proposal to use resume projects and work history.

### Revised direction, documented before execution

- Use the resume for the owner's personal identity, role, location, contact details, and skills. Keep the original sample concepts clearly labeled and use the owner's supplied portrait in the hero.
- Use a proper full-viewport mobile hero with the existing animated portrait scene and readable stacked typography. Treat the About, career, selected-work, process, world, and contact chapters as deliberate viewport-scale scenes, with mobile content allowed to continue vertically only where needed for legibility.
- Preserve the Three.js experience and the existing general architecture story and project concepts. Do not present the resume's employers, education, or real project list as portfolio case studies.
- Use the provided email, phone, LinkedIn, and GitHub links.
- Recompose mobile sections and spacing so the process sculpture and its active copy both fit and remain readable without overlap or a cramped split layout.

### Revised acceptance criteria

- Every major chapter has an intentional full-screen composition at desktop and mobile sizes; the opening animated section establishes the scale and visual rhythm.
- The owner's personal details match the resume. Concept work stays clearly marked as illustrative, with no claim that it is shipped client work.
- The supplied portrait is used in the hero with accurate alt text and no demo-image labeling.
- Mobile process text and Three.js artwork do not overlap, clip, or force horizontal scrolling.
- Production build passes and the existing interaction checks remain intact.

## 8. Content scope correction — October 2, 2026

The owner clarified that the resume should personalize the site, but its employer history and real project list should not be added as portfolio case studies. Keep the resume-backed name, mobile developer role, contact details, location, and technical profile. Restore the original general portfolio narrative and engineering process, plus the three clearly labeled concept projects (Orbit, Forma, Pulse). Their mockups and case-study copy are illustrative concepts, not claims about shipped work.

## 9. Particle hover bloom — October 2, 2026

For the particle sculpture in the process chapter, match the reference's local pointer response: particles near a hovered cursor scatter outward and brighten into a soft bloom, then settle back as the cursor leaves. Drive the force in screen space so it follows the visible pointer across the rotated 3D sculpture. Keep the effect localized to the sculpture, eased, restrained on touch screens, and disabled when reduced motion or the motion pause control is active.

## 10. Bloom refinement — October 2, 2026

The owner found the initial hover field too strong and requested a fisheye-zoom character plus sparkling particles. Reduce the field radius, use modest radial lens magnification instead of a large displacement, keep hover tint restrained, and add individually phased, subtle point twinkles with a small glint on peaks.

## 11. Live recording review — October 2, 2026

The supplied live recording shows the process sculpture morphing correctly, while pointer-local magnification and point glints are difficult to distinguish at the recorded viewport scale. Increase radial magnification slightly and make the short warm glints more legible; preserve the restrained overall glow and verify at a narrow viewport.

## 12. Hover scatter refinement — October 2, 2026

The current shader bends particles through a shared radial lens but gives individual points little independent spread. Add a soft, per-point outward scatter within the pointer field, with easing on entry and exit, while retaining the fisheye shape and restrained glow. Verify that the scatter is visible without overwhelming the sculpture.

## 13. Replace demo portrait — October 2, 2026

The owner supplied a personal portrait and asked to use it in the portfolio. Replace the fictional demo image at the existing asset path so both the hero fallback and Three.js texture use the supplied photo. Remove the demo/placeholder caption and use truthful alt text; update the asset and verification notes to describe the owner-provided image. Check the crop on desktop and mobile.

## 14. Generate a portrait variant — October 2, 2026

The owner clarified that the new hero should match the original demo portrait's dark monochrome editorial studio style, not the supplied photo's outdoor style. Use the supplied photo only as an identity reference; generate a fresh black-and-white studio portrait with a charcoal backdrop, soft directional light, dark blazer, and black crewneck, then replace the current portrait and verify desktop and mobile crops.
