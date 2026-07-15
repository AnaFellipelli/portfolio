# Prompt — Immersive E-commerce Case Page ("the screens ARE the case")

Use this prompt to build an e-commerce project's case page in the portfolio. Fill the brackets. Reference implementation: `baw.jsx` (`#/baw`) — match its architecture and restraint.

---

Build an immersive, landing-page-style case page for **[PROJECT NAME]** inside my portfolio (registered as `LAYOUTS["[id]-case"]`, hash route `#/[id]`, full-bleed via a `body.[id]-mode` class that unconstrains `.canvas`, ends with `NextProjectFooter` inside the last dark band).

## 1 · Identity first — the page wears the brand's skin, not the portfolio's

- Extract the brand's real identity **by pixel-sampling the shipped captures** (`[id]-*.png`) before styling anything: surfaces, ink, accent(s), colorway swatches, radius language, type. Sources in priority order: **[screenshots in the repo / Figma file / brand guide]**.
- Every color must come from the sampled palette — annotate each CSS variable with its source (`/* sampled [id]-2 · buy band */`). No invented values. If the brand typeface isn't web-licensed, stack it first with its declared fallback and note the substitution in a code comment only — no visible footnote.
- Respect the brand's radius language exactly (BAW = squared everything; match whatever this brand does).
- The portfolio's chrome (topbar, input) stays, but gets a protection layer: backdrop blur only (no bar), items invert against dark bands via a scroll-driven `body.[id]-head-invert` class.

## 2 · Structure — short, visual, no page-hopping

Exactly this section order, numbered chips (`[topic] — 01`), each with a huge display heading and one-paragraph lede:

1. **Hero** (ink/boldest brand surface) — scrolling ghost display type of the brand's slogan behind the content (transform-only marquee), giant display statement, meta chips (role · company · platforms · timeline), one CTA **built as the brand's own signature component** (e.g. BAW's marquee buy-band) that scrolls to the screens. No live-site link, no reaction pills.
2. **Brand marquee divider** — thin accent band with scrolling brand phrases.
3. **The screens — 01** ← the centerpiece. This is a UI project: show the proto images as big and as well as possible.
4. **Process — 02** — the methodology in 4 phase cards (border-top, mono kicker, short body).
5. **Decisions — 03 + Ownership — 04** — one dark band: 3–5 numbered decisions, then "what I owned" grid + one collaborator paragraph, then `NextProjectFooter`.

**Do NOT include:** accessibility section, results/metrics section, closing "why this matters" statement block, notes/footnotes paragraph, live PDP/store demo fragment. (Accessible, reduced-motion-safe code is still mandatory — it's build quality, not a section.)

**Nothing goes behind accordions.** All screens always visible.

## 3 · The screens section — showcase rules

- A wide dedicated container (`max-width ~1500px`, wider than the text column), vertical rhythm `clamp(40px, 6vw, 88px)` between figures.
- Order for impact: composed multi-device shot first (frameless — `border: none` when the capture already has device frames/transparency), then wide desktop captures full-width with a thin ink border, mobile captures as a centered side-by-side pair (`max-width ~980px`).
- Mono uppercase captions, centered, one line each: `[page] · [device] — [what it shows]`.
- If any capture is cropped into a layout element, **measure the crop**: open the PNG, find content bounds programmatically, and exclude browser chrome / baked-in logos from the crop window. Comment the measured window in the CSS.
- Real artifacts only — never redraw, never stretch, `loading="lazy"`, real alt text.

## 4 · Craft bar (invisible, non-negotiable)

- All interactive elements keyboard-accessible with visible brand-colored focus (`:focus-visible`, accent ring on dark bands); every animation transform-only and disabled under `prefers-reduced-motion`.
- Fixed left rail with scroll anchors for the 4 sections (hidden under 1100px, `mix-blend-mode: difference`).
- Verify before calling it done: Babel-transform the JSX, SSR-render the component with stubs (all section ids + all images present, removed things absent), and if the local server is running (`python3 -m http.server 8792`), a live pass at `localhost:8792/ana.html#/[id]` — no console errors, mobile pass, back-button and deep-link intact.
- Routing note: `ROUTE_TO_Q` / `LAYOUT_TO_ROUTE` in `app.jsx` and the spec in `data.jsx` already exist for current projects — only touch them for a brand-new id.

---

**For CANAL, the demands are:** women's fashion e-commerce by Studio Brizza (2023) — "a new brand identity deserved a store to match." Sample the identity from `canal-1.png … canal-6.png` (home, mobile screens, PDP "compre junto", desktop mega menu, desktop PDP — see `PROJECTS.canal` in `data.jsx` for captions/dimensions). Register `LAYOUTS["canal-case"]`, route `#/canal` (already wired). Follow the brand and images, keep it super visual about the UX/UI developed in the project, highlight the screens.
