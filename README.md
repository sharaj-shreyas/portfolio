# Sharaj Shreyas — Portfolio

A newspaper-broadsheet portfolio built with Next.js 15. The current design
follows the updated source at the repository root (`index.html`, `projects.js`
and `assets/`), rendered through React components; the app is the static site
that gets deployed.

Ink-black banners, a parchment page, 3 / 2 / 1 column grids and hairline rules.
The Projects section now pairs a live WebGL 2 tabletop scene with an expandable,
filterable project index. No backend, no database, fully static.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** — design tokens live in the `@theme` block in `app/globals.css`
- **Motion** (`motion/react`) for reveal, interaction and scramble effects
- **GSAP + ScrollTrigger** for the smooth-scroll/ScrollTrigger wiring
- **Lenis** for smooth scrolling
- **next/font/google** for Bodoni Moda, Source Serif 4 and Pirata One
- **next/image** for the portrait and optional project images
- **WebGL 2** for the Projects stage, using the pre-generated assets in
  `public/assets/` (no Three.js dependency)
- Static export (`output: "export"`)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build it

```bash
npm run build
```

The static site is written to `out/`. Preview the production build with any
static server:

```bash
npx serve out
```

Type check only:

```bash
npm run typecheck
```

`next-env.d.ts` is committed. If you type check a brand-new clone before the
first Next.js run, run `npm run dev` or `npm run build` once to generate the
`.next/types` files it references.

## Deploy

### Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import it in Vercel. Next.js is detected automatically.
3. `VERCEL_URL` is used automatically for the Open Graph metadata base. For a
   custom domain, add `NEXT_PUBLIC_SITE_URL` (for example
   `https://sharajshreyas.com`). This only affects metadata.
4. Deploy.

`next.config.ts` already sets `output: "export"` and disables the image
optimizer, so the same build can be served as plain static files.

### Any static host

Upload the contents of `out/` to Netlify, Cloudflare Pages, GitHub Pages, S3,
or any static file host. No server runtime is required.

## Project structure

```text
app/
  layout.tsx           fonts, metadata/OG tags, skip link, providers
  page.tsx             section composition
  globals.css          Tailwind v4 theme + base, components and update styles
  icon.svg             favicon

content/
  data.ts              ALL copy, project records and stage captions, typed

lib/
  motion.ts            easings, durations, staggers, shared variants, feature flags
  fit-text.ts          pre-paint fit-to-width hook for the banner words
  use-tilt.ts          pointer-tilt hook writing --tilt-x / --tilt-y
  smooth-scroll.ts     shared Lenis instance + offset anchor scrolling
  gsap.ts              ScrollTrigger registration
  use-isomorphic-layout-effect.ts

components/
  Masthead.tsx         sticky masthead + menu state
  MenuOverlay.tsx      full-screen ink menu, focus trap, Escape, wipe, flap-in items
  SectionIndex.tsx     the newspaper index under the masthead
  Banner.tsx           opening and closing ink banners
  FitWord.tsx          fitted banner word + split-flap characters + pointer tilt
  About.tsx
  about/
    Portrait.tsx       next/image, multiply blend, clip reveal, pointer tilt
    Facts.tsx
    Stamp.tsx          thunk-in, spinning sunburst, 18° pointer tilt
    Education.tsx
  Experience.tsx
  experience/
    Story.tsx          fade/reveal story + split-flap organization heading
    LongForm.tsx       ATL columns + highlights
  PlateArt.tsx         shared typographic plate
  Projects.tsx         project data, filter state, counts and live status
  projects/
    ProjectStage.tsx   canvas, lazy model/stage loading, loading + WebGL fallback
    ProjectIndex.tsx   accessible expandable rows, filter visibility, hover cards
    ProjectPreview.tsx pointer-following project plate
  Skills.tsx           glyph scramble on reveal
  Contact.tsx
  contact/CopyButton.tsx
  Footer.tsx
  motion/
    Reveal.tsx
    SplitText.tsx      character-level 3D split-flap text
    ScrambleText.tsx   random glyph reveal used by Skills
    Parallax.tsx
    Magnetic.tsx
    CursorFollower.tsx
  RuleDraw.tsx
  Eyebrow.tsx
  SmoothLink.tsx
  Star.tsx
  Providers.tsx

public/assets/
  sharaj-shreyas.jpg  portrait (359 × 478)
  models.js           generated 3D model data, sets window.STAGE_MODELS
  stage.js            WebGL 2 scene renderer for #stage-canvas
```

The root-level `index.html`, `projects.js` and `assets/` are the standalone
source of the same design. The site itself renders from `content/data.ts` and
the React components, so it can be deployed statically without the root HTML.

## Editing content

Everything readable lives in `content/data.ts`. Components only decide layout.
Change a section title, a date, a bullet, a project or a caption there.

Projects are typed as:

```ts
{
  category: "robotics",
  categoryLabel: "Robotics",
  title: "A new build",
  year: "2026",                         // optional
  note: "Optional one-liner.",           // expandable row + preview
  description: "Longer description.",    // optional
  image: { src: "/assets/build.jpg", alt: "…", width: 800, height: 600 },
  link: { href: "https://…", label: "Read more" },
}
```

The index numbers, visible rows, filter labels, counts and the summary sentence
are derived from the `projects` array, so adding or removing a project updates
all of them automatically. There is no separate project count to edit. Keep each
project’s `categoryLabel` consistent within a category; the first project of a
category supplies the filter label.

The stage copy and labels live under `projectsSection.stage`. The two
`data-anchor` names (`scout` and `chadermod`) must stay in sync with the actors
in `stage.js`; the canvas id `stage-canvas` is also required. The scene title and
caption are ordinary copy and can change freely.

If you update the source design, copy the current `assets/models.js` and
`assets/stage.js` to `public/assets/` as well. The renderer reads the CSS
palette variables from the page (`--color-parchment`, `--color-ink-black`,
`--color-ember-orange`, `--color-charcoal`), so the stage follows the site
tokens.

## Projects stage

`ProjectStage` waits until the section is near the viewport, then loads
`/assets/models.js` and `/assets/stage.js` in order. It renders the same canvas,
labels, HUD and caption as the source:

- One finger or pointer drag turns the camera; the arrow keys do the same when
  the canvas is focused.
- The scene pauses when it leaves the viewport, when the tab is hidden, or when
  reduced motion is requested. In reduced motion the static first frame remains.
- If WebGL 2 or the model data is unavailable, the frame shows a readable
  fallback instead of an empty black box.
- The canvas exposes an accessible `role="img"` label; the visible floating
  labels are decorative and `aria-hidden`.

## Animation system

### Split-flap type

`SplitText` splits headings into `.word` and `.char` spans. The resting state is
supplied by CSS custom properties:

- `is-pending` folds letters away on the X axis and hides them.
- `is-in` flips them up, staggering with `--i`, `--stagger` and
  `--flip-duration`.
- The default heading timing is 28 ms per character / 0.8 s; the fitted banner
  words use 70 ms / 1.1 s.

`FitWord` uses the same character markup, but measures the word with
`offsetWidth` so the 3D tilt transform does not distort the fit. The opening
banner plays on load; the closing banner plays when it scrolls into view.

`lib/use-tilt.ts` drives the portrait and banner tilt from the pointer’s
position inside the enclosing `.banner` or `.portrait`. It is disabled for
coarse pointers and reduced motion. The stamp keeps its spring tilt at 18°.

### Other motion

| Where | Animation |
| --- | --- |
| Opening banner | Fit-to-width “Sharaj”, split-flap load-in, pointer tilt |
| Closing banner | Fit-to-width “Shreyas”, split-flap on scroll |
| Section headlines | Character split-flap on entering the viewport |
| Experience organizations | Character split-flap headings |
| Eyebrows | Number tag draws in |
| Rules | Hairline rules draw left-to-right (`RuleDraw`) |
| Stamp | Thunk-in (−16° / 1.35 → −4° / 1), 90 s sunburst spin, 18° pointer tilt |
| Portrait | Clip-path veil; greyscale → colour on hover; pointer tilt |
| Experience | Story fade/reveal, staggered bullets and highlights |
| Projects | 3D stage; filter rows; ink-flap hover; character flips; expandable bodies; floating preview |
| Menu | Ink panel wipe, focus trap, 3D menu-item flap |
| Skills | Random glyph scramble on reveal; ember stars pop in |
| Scrolling | Lenis, GSAP ticker sync, offset anchor links |

All effects are reduced or disabled under `prefers-reduced-motion: reduce`.
The split characters are forced visible, the tilt hooks do not attach, the menu
flap is removed and the stage pauses. Motion’s `MotionConfig reducedMotion="user"`,
the stage’s own media query and the CSS fallback cover the three motion layers.

### Reusable primitives

```tsx
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ScrambleText } from "@/components/motion/ScrambleText";

<Reveal as="p" delay={0.1} y={24}>
  Fades and rises once, when it enters the viewport.
</Reveal>

<SplitText
  as="h2"
  className="headline headline--lg"
  text="Labs, teams & techfests"
/>

<ScrambleText text="Hardware" />
```

### How to add an animation

1. **Pick the trigger.** Use Motion `whileInView` for entrances, `Parallax` for
   scroll-scrubbed motion, and pointer event handlers for interaction.
2. **Pull timing from `lib/motion.ts`.** Do not hard-code a duration unless it is
   genuinely one-off.
3. **Respect reduced motion.** Pass `initial={reduce ? false : …}` /
   `whileInView={reduce ? undefined : …}`. Never leave copy hidden at rest for
   reduced-motion visitors; the split-flap fallback is a good example.
4. **Keep layout still.** Animate transforms, opacity and `clip-path`, not
   width/height/margins. The project rows animate an overlay and transform their
   characters; the row height is reserved by the CSS.
5. **Tilt targets** need a CSS variable consumer. Reuse `useTilt` on a target
   with `data-tilt` (the portrait) or on the fitted banner word, rather than
   adding another pointer listener.

### Anchor scrolling

Any in-page link can use `<SmoothLink href="#projects">`. It hands the hash to
`scrollToHash`, which uses Lenis with an offset equal to the sticky masthead
height, and falls back to native scrolling under reduced motion. The menu uses
the same helper after closing.

## Accessibility

- Skip link to `#main`
- Visually hidden full name inside the display headline
- Menu: `role="dialog"`, `aria-modal`, focus trap, Escape to close, focus
  restored to the opener after the exit animation
- Filter chips use `aria-pressed`; a polite live region announces the visible
  project count
- Project rows are buttons with `aria-expanded` and `aria-controls`; rows without
  details stay static. The project preview is decorative and hidden from
  assistive technology
- The stage canvas has a descriptive `role="img"` label, keyboard camera
  controls, a visible focus ring and a caption; the floating labels are
  decorative
- Every image has meaningful alt text; decorative plates, stars and previews are
  `aria-hidden`
- Visible ember focus ring, 2 px / 3 px offset
- Reduced motion honoured across Motion, the stage, GSAP, Lenis and CSS

## Notes

- The photo lives at `public/assets/sharaj-shreyas.jpg` (359 × 478).
- `NEXT_PUBLIC_SITE_URL` only affects absolute Open Graph metadata. On Vercel,
  `VERCEL_URL` is used automatically; elsewhere the build falls back to
  `http://localhost:3000` until you set it.
- The favicon is `app/icon.svg` (ink tile, ember star).
- The static export includes `public/assets/models.js` and `stage.js`; no
  environment variables or server runtime are needed for the 3D stage.
