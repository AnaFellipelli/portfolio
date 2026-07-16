/* ════════════════════════════════════════════════════════════
   weave.jsx — two layers for the weave folder:
   1. WeaveInlinePreview — scrapbook preview shown when the folder
      opens on the work page (polaroid, post-its, tape, link).
   2. WeaveCase — the immersive full case page. The page wears
      Autodesk Weave's own skin: every color, size, and radius
      below is a real token from @weave-design/theme-data 1.3.1
      (Autodesk's published theme package — 3 themes × 3 densities),
      annotated with its token path. No invented values.
   Registers LAYOUTS["case-study"] (route #/weave) + alias "weave-case".
   ════════════════════════════════════════════════════════════ */

const { useState: useStateWv, useEffect: useEffectWv } = React;

/* ── hand-drawn circle (an ellipse, sketched) — used by the folder preview ── */
function WvCircle() {
  return (
    <svg className="wv-circle" viewBox="0 0 200 110" aria-hidden="true">
      <ellipse cx="100" cy="55" rx="95" ry="49" />
    </svg>
  );
}

/* ── 1. inline preview (work page) — unchanged ── */
function WeaveInlinePreview({ onAsk, onClose }) {
  return (
    <div className="wv-preview" role="region" aria-label="weave preview">
      <span className="wv-tape-strip" aria-hidden="true"></span>
      <button className="wv-close" onClick={onClose}>close ×</button>

      <div className="wv-preview-grid">
        <div className="wv-polaroid">
          <span className="wv-tape" aria-hidden="true"></span>
          <span className="wv-photo">
            <span className="wv-photo-label">weave system overview</span>
          </span>
          <span className="wv-polaroid-cap">weave · autodesk</span>
        </div>

        <div className="wv-preview-body">
          <div className="wv-eyebrow">weave</div>
          <div className="wv-eyebrow-sub">autodesk design system · 2022 to 2025</div>
          <h3 className="wv-impact">One design language across Autodesk's flagship products.</h3>

          <div className="wv-postits">
            <div className="wv-postit yellow">
              <WvCircle />
              14 components, may 2025
            </div>
            <div className="wv-postit pink">3 × 3 = 9 combos. the tokens had to hold.</div>
            <div className="wv-postit plain">built so teams adopt without asking</div>
          </div>

          <a className="wv-fulllink" onClick={() => onAsk && onAsk("open the full weave case")}>
            open the full case →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   2. THE IMMERSIVE CASE PAGE
   ════════════════════════════════════════════════════════════ */

/* ---------- real theme data — @weave-design/theme-data 1.3.1, resolvedRoles ---------- */
const WV_THEMES = {
  lightGray: {
    label: "light gray",
    s100: "#ffffff", s200: "#f5f5f5", s250: "#eeeeee", s300: "#d9d9d9", s350: "#cccccc",
    text: "#3c3c3c", textDim: "rgba(60,60,60,0.7)", placeholder: "rgba(60,60,60,0.4)",
    icon: "#808080", accent: "#0696d7", accentText: "#006eaf",
    dividerLight: "rgba(60,60,60,0.1)", dividerHeavy: "rgba(60,60,60,0.25)",
    borderBase: "rgba(128,128,128,0.5)",
    haloFocus: "rgba(6,150,215,0.35)", haloHover: "rgba(128,128,128,0.15)", haloPressed: "rgba(128,128,128,0.25)",
    selectedBg: "rgba(6,150,215,0.15)",
    error: "#dd2222", success: "#6a9728", warning: "#faa21b",
    skeleton: "rgba(0,0,0,0.06)", shadow: "rgba(0,0,0,0.2)",
  },
  darkGray: {
    label: "dark gray",
    s100: "#535353", s200: "#474747", s250: "#373737", s300: "#2a2a2a", s350: "#202020",
    text: "#f5f5f5", textDim: "rgba(245,245,245,0.7)", placeholder: "rgba(245,245,245,0.4)",
    icon: "#999999", accent: "#38abdf", accentText: "#6dd2ff",
    dividerLight: "rgba(255,255,255,0.1)", dividerHeavy: "rgba(255,255,255,0.25)",
    borderBase: "rgba(255,255,255,0.5)",
    haloFocus: "rgba(56,171,223,0.35)", haloHover: "rgba(255,255,255,0.15)", haloPressed: "rgba(255,255,255,0.25)",
    selectedBg: "rgba(56,171,223,0.25)",
    error: "#eb5555", success: "#87b340", warning: "#fbb549",
    skeleton: "rgba(255,255,255,0.08)", shadow: "rgba(0,0,0,0.3)",
  },
  darkBlue: {
    label: "dark blue",
    s100: "#454f61", s200: "#3b4453", s250: "#2e3440", s300: "#222933", s350: "#1a1f25",
    text: "#f5f5f5", textDim: "rgba(245,245,245,0.7)", placeholder: "rgba(245,245,245,0.4)",
    icon: "#a2a6b0", accent: "#38abdf", accentText: "#6dd2ff",
    dividerLight: "rgba(188,211,238,0.1)", dividerHeavy: "rgba(188,211,238,0.25)",
    borderBase: "rgba(188,211,238,0.5)",
    haloFocus: "rgba(56,171,223,0.35)", haloHover: "rgba(188,211,238,0.15)", haloPressed: "rgba(188,211,238,0.25)",
    selectedBg: "rgba(56,171,223,0.25)",
    error: "#eb5555", success: "#87b340", warning: "#fbb549",
    skeleton: "rgba(188,211,238,0.1)", shadow: "rgba(26,31,38,0.5)",
  },
};

/* density metrics — button.*, input.minHeight, panel.header.minHeight, table.* per density */
const WV_DENSITY = {
  high:   { label: "high",   btnPadV: 4,  btnPadH: 12, btnFont: 12, btnLh: 14, inputH: 24, panelHeadH: 24, rowH: 20, headH: 24, sp: 12 },
  medium: { label: "medium", btnPadV: 8,  btnPadH: 16, btnFont: 14, btnLh: 18, inputH: 36, panelHeadH: 40, rowH: 32, headH: 40, sp: 16 },
  low:    { label: "low",    btnPadV: 12, btnPadH: 24, btnFont: 16, btnLh: 18, inputH: 36, panelHeadH: 40, rowH: 32, headH: 40, sp: 24 },
};

/* the four component deep dives (data lives in PROJECTS) */
const WEAVE_DEEP_DIVES = ["panel", "datagrid", "autocomplete", "skeleton"];

/* what I owned */
const WV_OWN = [
  { h: "Component core", p: "14 core components shipped in the May 2025 release, each with complete specs, states, and Figma documentation, adopted across AutoCAD, Fusion, and Revit." },
  { h: "Panel", p: "From divergent custom builds to one flexible component: collected every variant across Autodesk, ran a cross-team workshop, shipped docked, floating, and fixed with full docs." },
  { h: "Data Grid", p: "The system's most complex component: row grouping, master-detail, pagination, sorting, resizing. Every state specced with prototypes before code." },
  { h: "Autocomplete as behavior", p: "Research showed it's really a behavior. One definition, three surfaces: text input, dropdown, search. No new component to maintain forever." },
  { h: "Loading framework", p: "Grounded in perception research on waiting: five skeleton categories, one gradient-wave animation, and a rule per wait threshold." },
];

const WV_DECISIONS = [
  { title: "Three densities are a product requirement.", body: "AutoCAD users live in high density: panels, palettes, and tables packed into every pixel. Fusion breathes at medium. Onboarding flows want low. One component, three metric sets, zero forks." },
  { title: "Each theme exists for a reason.", body: "Light gray, dark gray, and dark blue exist because Autodesk products run in bright offices and dark studios, over 3D viewports where the canvas itself is the product. Dark blue is the high-contrast scheme AutoCAD ships over the drawing canvas." },
  { title: "The accent shifts per scheme, deliberately.", body: "Autodesk Blue 500 (#0696D7) carries the accent on light surfaces; on dark schemes it steps up the ramp to 400 (#38ABDF) so interactive states keep their contrast. Same ramp, different stop: that's the semantic layer doing its job." },
  { title: "Focus is a halo.", body: "A 2px halo in the accent at 35% opacity sits outside the component: hover 2px, pressed 4px, in the base color. Nothing shifts, nothing reflows. The component's silhouette never changes." },
  { title: "Adoption without asking.", body: "Documentation precise enough that engineers act on it independently: usage rules, QA criteria, no designer required in the room. The measure of success was teams onboarding without help. And they did." },
];

/* ---------- styles — every value annotated with its source token ---------- */
const __WV2_STYLE = `
  /* free the page from the constrained canvas — full-bleed bands */
  body.wv-mode .canvas { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  body.wv-mode .page-enter { animation: none !important; }
  body.wv-mode .atmosphere, body.wv-mode .grain { display: none; }
  body.wv-mode { background: #f5f5f5; /* surface.level200 · lightGray */ }

  /* header protection: backdrop blur only (no bar); items adapt to the band below */
  body.wv-mode .topbar::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    -webkit-mask-image: linear-gradient(#000 60%, transparent);
    mask-image: linear-gradient(#000 60%, transparent);
  }
  body.wv-mode .topbar > * { position: relative; z-index: 1; }
  body.wv-mode .topbar .logo { color: #3c3c3c; transition: color .3s ease; } /* text.default */
  body.wv-mode .nav-link { color: rgba(60,60,60,0.7); transition: color .3s ease; }
  body.wv-mode .nav-link:hover, body.wv-mode .nav-link.active { color: #3c3c3c; }
  body.wv-mode.wv-head-invert .topbar .logo { color: #f5f5f5; }
  body.wv-mode.wv-head-invert .nav-link { color: rgba(245,245,245,0.72); }
  body.wv-mode.wv-head-invert .nav-link:hover,
  body.wv-mode.wv-head-invert .nav-link.active { color: #f5f5f5; }

  /* ── identity: artifakt element / legend, substituted when not installed ── */
  .wv2 {
    --awb: #0696d7;            /* primary.autodeskBlue.500 */
    --awb-4: #38abdf;          /* primary.autodeskBlue.400 — accent on dark schemes */
    --awb-7: #006eaf;          /* primary.autodeskBlue.700 — textLink.againstLight */
    --ink: #3c3c3c;            /* colorScheme.text.default · lightGray */
    --paper: #f5f5f5;          /* surface.level200 · lightGray */
    --white: #ffffff;          /* surface.level100 · lightGray */
    --db-300: #222933;         /* surface.level300 · darkBlue */
    --db-350: #1a1f25;         /* surface.level350 · darkBlue */
    --dg-300: #2a2a2a;         /* surface.level300 · darkGray */
    --wv-sans: "ArtifaktElement", "Artifakt Element", "DM Sans", system-ui, sans-serif;
    --wv-legend: "ArtifaktLegend", "Artifakt Legend", "Archivo", system-ui, sans-serif;
    --wv-mono: "Source Code Pro", "DM Mono", ui-monospace, monospace; /* basics.fontFamilies.monospace */
    font-family: var(--wv-sans); color: var(--ink);
  }

  /* blueprint grid — the drafting-canvas texture on light bands */
  .wv2-grid-bg {
    background-image:
      linear-gradient(rgba(6,150,215,0.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6,150,215,0.055) 1px, transparent 1px);
    background-size: 96px 96px;
  }

  /* content column — leaves room for the fixed rail */
  .wv2-wrap { max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 72px) 0 clamp(24px, 15vw, 240px); }
  @media (max-width: 1100px){ .wv2-wrap { padding-left: clamp(24px, 5vw, 72px); } }

  /* ── left rail ── */
  .wv2-rail { position: fixed; left: 36px; top: 50%; transform: translateY(-50%);
    z-index: 30; display: flex; flex-direction: column; gap: 18px;
    mix-blend-mode: difference; }
  @media (max-width: 1100px){ .wv2-rail { display: none; } }
  .wv2-rail button { display: flex; align-items: center; gap: 12px; background: none;
    border: none; padding: 0; cursor: pointer;
    font-family: var(--wv-mono); font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: #fff; opacity: .78; transition: opacity .2s ease; }
  .wv2-rail button:hover { opacity: 1; }
  .wv2-rail button::before { content: ""; width: 22px; height: 1.5px; background: #fff;
    transition: width .25s var(--ease-out); }
  .wv2-rail button:hover::before { width: 40px; }
  .wv2-rail button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; opacity: 1; }

  /* ── hero: the viewport ── */
  .wv2-hero { position: relative; background: var(--db-350); /* surface.level350 · darkBlue */
    color: #f5f5f5; overflow: hidden; padding: 140px 0 110px; }
  .wv2-hero .wv2-wrap { position: relative; z-index: 2; }

  /* CAD floor grid, drawn in the darkBlue scheme's accent */
  .wv2-floor { position: absolute; left: -50%; right: -50%; bottom: -12%; height: 72%;
    background-image:
      linear-gradient(rgba(56,171,223,0.22) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,171,223,0.22) 1px, transparent 1px);
    background-size: 56px 56px;
    transform: perspective(620px) rotateX(64deg); transform-origin: 50% 0;
    -webkit-mask-image: radial-gradient(ellipse 65% 90% at 50% 0%, #000 30%, transparent 78%);
    mask-image: radial-gradient(ellipse 65% 90% at 50% 0%, #000 30%, transparent 78%);
    pointer-events: none; }
  .wv2-horizon { position: absolute; left: 0; right: 0; bottom: 26%; height: 220px;
    background: radial-gradient(ellipse 60% 100% at 50% 100%, rgba(6,150,215,0.18), transparent 70%);
    pointer-events: none; }

  /* the viewcube — six faces, transform-only orbit */
  .wv2-scene { position: absolute; right: clamp(20px, 9vw, 150px); top: 120px;
    width: 150px; height: 150px; perspective: 900px; z-index: 1; }
  @media (max-width: 900px){ .wv2-scene { display: none; } }
  .wv2-cube { position: absolute; inset: 0; transform-style: preserve-3d;
    animation: wv2Orbit 26s linear infinite; }
  @keyframes wv2Orbit {
    from { transform: rotateX(-22deg) rotateY(0deg); }
    to   { transform: rotateX(-22deg) rotateY(360deg); } }
  .wv2-face { position: absolute; inset: 0; border: 1px solid rgba(56,171,223,0.75);
    background: rgba(69,79,97,0.28); /* surface.level100 · darkBlue, translucent */
    display: grid; place-items: center;
    font-family: var(--wv-mono); font-size: 11px; letter-spacing: 0.22em;
    color: rgba(245,245,245,0.8); }
  .wv2-face.f1 { transform: translateZ(75px); }
  .wv2-face.f2 { transform: rotateY(90deg) translateZ(75px); }
  .wv2-face.f3 { transform: rotateY(180deg) translateZ(75px); }
  .wv2-face.f4 { transform: rotateY(-90deg) translateZ(75px); }
  .wv2-face.f5 { transform: rotateX(90deg) translateZ(75px); }
  .wv2-face.f6 { transform: rotateX(-90deg) translateZ(75px); }
  /* axis gizmo under the cube */
  .wv2-gizmo { position: absolute; left: 50%; top: 108%;
    font-family: var(--wv-mono); font-size: 9px; letter-spacing: 0.14em;
    color: rgba(245,245,245,0.55); transform: translateX(-50%); white-space: nowrap; }
  .wv2-gizmo b { font-weight: 600; }
  .wv2-gizmo .x { color: #eb5555; }   /* status.error — CAD x-axis red */
  .wv2-gizmo .y { color: #87b340; }   /* status.success — y-axis green */
  .wv2-gizmo .z { color: #38abdf; }   /* accent — z-axis blue */

  /* viewport chrome labels */
  .wv2-vplabel { position: absolute; font-family: var(--wv-mono); font-size: 9.5px;
    letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,245,245,0.4);
    z-index: 1; pointer-events: none; }
  @media (max-width: 700px){ .wv2-vplabel { display: none; } }

  .wv2-back { font-family: var(--wv-mono); font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: #f5f5f5; background: rgba(69,79,97,0.5);
    border: 1px solid rgba(188,211,238,0.35); /* border.base · darkBlue */
    border-radius: 2px; /* basics.borderRadii.medium */
    padding: 9px 16px; cursor: pointer; margin-bottom: 48px; transition: background .2s ease; }
  .wv2-back:hover { background: rgba(69,79,97,0.85); }
  .wv2-eyebrow { font-family: var(--wv-mono); font-size: 11.5px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--awb-4); margin-bottom: 28px; }
  .wv2-h1 { font-family: var(--wv-legend); font-weight: 700; letter-spacing: -0.02em;
    font-size: clamp(44px, 8vw, 118px); line-height: 0.98; color: #f5f5f5;
    margin: 0 0 38px; max-width: 14ch; text-wrap: balance; }
  .wv2-h1 em { font-style: normal; color: var(--awb-4); }
  .wv2-hero-sub { font-size: clamp(16px, 1.7vw, 21px); line-height: 1.55;
    color: rgba(245,245,245,0.85); max-width: 54ch; margin: 0 0 42px; }
  .wv2-cta { font-family: var(--wv-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: #fff; background: var(--awb); /* button.solid — autodeskBlue.500 */
    border: 1px solid var(--awb); border-radius: 2px; padding: 16px 30px; cursor: pointer;
    transition: box-shadow .15s ease, transform .2s var(--ease-out); }
  .wv2-cta:hover { box-shadow: 0 0 0 2px rgba(56,171,223,0.35); transform: translateY(-2px); }
  .wv2-cta:focus-visible { outline: none; box-shadow: 0 0 0 2px #1a1f25, 0 0 0 4px rgba(56,171,223,0.9); }
  .wv2-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
  .wv2-hero-chip { font-family: var(--wv-mono); font-size: 10.5px; border-radius: 2px;
    padding: 7px 14px; border: 1px solid rgba(188,211,238,0.35); color: rgba(245,245,245,0.85); }
  .wv2-hero-chip b { font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    font-size: 9px; margin-right: 6px; color: var(--awb-4); }

  /* ── section scaffolding ── */
  .wv2-sec { padding: 96px 0 110px; }
  .wv2-sec.paper { background: var(--paper); }
  .wv2-sec.white { background: var(--white); }
  .wv2-sec.darkgray { background: var(--dg-300); color: #f5f5f5; }
  .wv2-sec.darkblue { background: var(--db-300); color: #f5f5f5; }
  .wv2-sec.deep { background: var(--db-350); color: #f5f5f5; }
  .wv2-chip { display: inline-block; font-family: var(--wv-mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase; color: inherit;
    border: 1px solid currentColor; border-radius: 2px; padding: 8px 14px;
    margin-bottom: 30px; opacity: .85; }
  .wv2-h2 { font-family: var(--wv-legend); font-weight: 700; letter-spacing: -0.02em;
    font-size: clamp(38px, 6.5vw, 92px); line-height: 0.98; margin: 0 0 28px; max-width: 16ch; }
  .wv2-sec-sub { font-size: clamp(16px, 1.6vw, 19px); line-height: 1.6; max-width: 56ch;
    margin: 0 0 52px; opacity: .85; }
  .wv2-context { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 64px; }
  @media (max-width: 760px){ .wv2-context { grid-template-columns: 1fr; gap: 22px; } }
  .wv2-context p { font-size: 16px; line-height: 1.65; margin: 0; opacity: .9; }

  .wv2-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 72px; }
  @media (max-width: 760px){ .wv2-stats { grid-template-columns: repeat(2, 1fr); } }
  .wv2-stat { background: var(--white); border: 1px solid rgba(60,60,60,0.1); /* divider.lightweight */
    border-radius: 4px; /* basics.borderRadii.large */ padding: 26px 22px; }
  .wv2-stat .n { font-family: var(--wv-legend); font-weight: 700; letter-spacing: -0.02em;
    font-size: clamp(30px, 4vw, 52px); line-height: 1; color: var(--ink); }
  .wv2-stat .n .acc { color: var(--awb); }
  .wv2-stat .l { font-family: var(--wv-mono); font-size: 10.5px; letter-spacing: 0.05em;
    text-transform: uppercase; opacity: .6; margin-top: 13px; line-height: 1.55; }

  .wv2-decisions { display: grid; gap: 0; }
  .wv2-decision { display: grid; grid-template-columns: 74px 1fr; gap: 24px;
    padding: 26px 0; border-top: 1px solid rgba(60,60,60,0.15); }
  .wv2-dec-num { font-family: var(--wv-mono); font-size: 12px; color: var(--awb); padding-top: 5px; }
  .wv2-dec-title { font-family: var(--wv-sans); font-weight: 600; font-size: 18px; margin: 0 0 8px; }
  .wv2-dec-p { font-size: 15px; line-height: 1.62; opacity: .8; margin: 0; max-width: 66ch; }

  /* ── the live system: theme × density viewport ── */
  .wv2-live-note { font-size: 15.5px; line-height: 1.65; margin: 0 0 34px; max-width: 64ch; opacity: .92; }
  .wv2-live-note strong { color: var(--awb-4); }
  .wv2-live-note .tok { font-family: var(--wv-mono); font-size: 10.5px; color: var(--awb-4);
    background: rgba(56,171,223,0.12); border-radius: 2px; padding: 2px 6px; white-space: nowrap; }

  .wv2-switch-row { display: flex; flex-wrap: wrap; gap: 26px; margin-bottom: 26px; align-items: center; }
  .wv2-switch { display: flex; align-items: center; gap: 10px; }
  .wv2-switch .lbl { font-family: var(--wv-mono); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; opacity: .6; }
  .wv2-seg { display: flex; border: 1px solid rgba(188,211,238,0.4); border-radius: 2px; overflow: hidden; }
  .wv2-seg button { font-family: var(--wv-mono); font-size: 11px; letter-spacing: 0.06em;
    background: transparent; color: rgba(245,245,245,0.75); border: none; cursor: pointer;
    padding: 9px 15px; transition: background .15s ease, color .15s ease; }
  .wv2-seg button + button { border-left: 1px solid rgba(188,211,238,0.25); }
  .wv2-seg button:hover { background: rgba(188,211,238,0.1); }
  .wv2-seg button[aria-pressed="true"] { background: rgba(56,171,223,0.25); /* background.selected */
    color: #fff; }
  .wv2-seg button:focus-visible { outline: none; box-shadow: inset 0 0 0 2px rgba(56,171,223,0.9); }

  /* the viewport itself — every value inside comes from the selected theme+density */
  .wv2-viewport { border-radius: 4px; overflow: hidden;
    border: 1px solid rgba(188,211,238,0.25);
    background: var(--vp-s300); color: var(--vp-text);
    transition: background .25s ease, color .25s ease;
    font-family: var(--wv-sans); }
  .wv2-vp-head { display: flex; justify-content: space-between; align-items: center;
    padding: 10px 16px; background: var(--vp-s350);
    font-family: var(--wv-mono); font-size: 9.5px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--vp-dim); }
  .wv2-vp-body { display: grid; grid-template-columns: 240px 1fr; }
  @media (max-width: 860px){ .wv2-vp-body { grid-template-columns: 1fr; } }

  /* left: a real Weave panel (panel.* roles) */
  .wv2-panel { background: var(--vp-s100); border-right: 1px solid var(--vp-div); min-height: 100%; }
  @media (max-width: 860px){ .wv2-panel { border-right: none; border-bottom: 1px solid var(--vp-div); } }
  .wv2-panel-head { display: flex; align-items: center; justify-content: space-between;
    height: var(--vp-panelhead); padding: 0 8px 0 12px; /* panel.header.paddingHorizontal 8 */
    background: var(--vp-s300); font-size: var(--vp-btnfont); color: var(--vp-text); }
  .wv2-panel-head .x { font-family: var(--wv-mono); opacity: .6; }
  .wv2-panel-body { padding: 12px; /* panel.container.padding */ display: grid; gap: 10px; }
  .wv2-input { height: var(--vp-inputh); border: 1px solid transparent;
    border-bottom: 1px solid var(--vp-border); background: var(--vp-s200);
    border-radius: 2px 2px 0 0; color: var(--vp-text); font-family: var(--wv-sans);
    font-size: var(--vp-btnfont); padding: 0 10px; width: 100%; }
  .wv2-input::placeholder { color: var(--vp-ph); }
  .wv2-input:focus-visible { outline: none; border-bottom-color: var(--vp-accent);
    box-shadow: 0 0 0 2px var(--vp-halo); } /* button.haloWidth 2px · halo.focus */
  .wv2-menu { border: 1px solid var(--vp-div); border-radius: 2px; overflow: hidden;
    background: var(--vp-s100); box-shadow: 0 4px 16px var(--vp-shadow); }
  .wv2-menu .mi { padding: 6px 12px; font-size: var(--vp-btnfont); cursor: pointer; }
  .wv2-menu .mi:hover { background: var(--vp-hover); }
  .wv2-menu .mi.sel { background: var(--vp-selected); color: var(--vp-accent); }
  .wv2-skl { display: grid; gap: 8px; padding-top: 4px; }
  .wv2-skl span { display: block; height: 16px; /* skeletonItem.minHeight */
    border-radius: 2px; /* skeletonItem.borderRadius */
    background: var(--vp-skeleton); position: relative; overflow: hidden; }
  .wv2-skl span::after { content: ""; position: absolute; inset: 0;
    background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    transform: translateX(-100%); animation: wv2Wave 1.8s ease-in-out infinite; }
  @keyframes wv2Wave { to { transform: translateX(100%); } }
  .wv2-skl span:nth-child(2) { width: 82%; } .wv2-skl span:nth-child(3) { width: 64%; }

  /* right: buttons + data grid */
  .wv2-stage { padding: calc(var(--vp-sp) * 1px); display: grid; gap: calc(var(--vp-sp) * 1px);
    align-content: start; }
  .wv2-row-label { font-family: var(--wv-mono); font-size: 9.5px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--vp-dim); }
  .wv2-btnrow { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }

  /* the Weave button — button.* roles, live */
  .wv2-btn { font-family: var(--wv-sans); font-weight: 600; /* button.label.fontWeight */
    font-size: calc(var(--vp-btnfont)); line-height: calc(var(--vp-btnlh));
    padding: calc(var(--vp-btnpadv)) calc(var(--vp-btnpadh));
    border-radius: 2px; /* button.borderRadius */ border: 1px solid transparent; /* button.borderWidth */
    cursor: pointer; transition: box-shadow .12s ease; }
  .wv2-btn:hover { box-shadow: 0 0 0 2px var(--vp-halo-hover); }   /* hover.haloWidth 2px */
  .wv2-btn:active { box-shadow: 0 0 0 4px var(--vp-halo-press); }  /* pressed.haloWidth 4px */
  .wv2-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--vp-halo); }
  .wv2-btn.solid { background: var(--vp-accent); border-color: var(--vp-accent); color: #fff; }
  .wv2-btn.outline { background: transparent; border-color: var(--vp-border); color: var(--vp-text); }
  .wv2-btn.outline:focus-visible { border-color: var(--vp-accent); }
  .wv2-btn.flat { background: transparent; color: var(--vp-accent-text); }
  .wv2-btn[aria-disabled] { opacity: 0.4; /* colorScheme.opacity.disabled */ cursor: default; box-shadow: none; }

  /* the data grid fragment — table.* roles */
  .wv2-grid-demo { border: 1px solid var(--vp-div); border-radius: 2px; overflow: hidden; }
  .wv2-grid-demo table { width: 100%; border-collapse: collapse;
    font-size: var(--vp-btnfont); }
  .wv2-grid-demo th { text-align: left; height: var(--vp-headh); padding: 0 12px;
    background: var(--vp-s300); font-weight: 400; color: var(--vp-text);
    border-bottom: 1px solid var(--vp-div); }
  .wv2-grid-demo th:last-child, .wv2-grid-demo td:last-child { text-align: right; }
  .wv2-grid-demo td { height: var(--vp-rowh); padding: 0 12px;
    background: var(--vp-s100); border-bottom: 1px solid var(--vp-div); color: var(--vp-text); }
  .wv2-grid-demo tr:hover td { background: var(--vp-hover); }
  .wv2-grid-demo tr.sel td { background: var(--vp-selected); }
  .wv2-grid-demo .check { color: var(--vp-accent); }
  .wv2-grid-foot { display: flex; justify-content: flex-end; gap: 18px; align-items: center;
    padding: 6px 12px; background: var(--vp-s300); color: var(--vp-dim);
    font-size: calc(var(--vp-btnfont) - 1px); }

  .wv2-live-foot { font-family: var(--wv-mono); font-size: 9.5px; letter-spacing: 0.05em;
    opacity: .6; padding: 16px 2px 0; line-height: 1.8; }

  .wv2-acc { overflow: hidden; max-height: 0; opacity: 0;
    transition: max-height .6s var(--ease-out), opacity .4s ease; }
  .wv2-acc.open { max-height: 4200px; opacity: 1; }
  .wv2-acc-btn { font-family: var(--wv-mono); font-size: 11px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase; color: #fff; background: var(--ink);
    border: none; border-radius: 2px; padding: 14px 24px; cursor: pointer;
    margin: 0 0 28px; display: inline-flex; align-items: center; gap: 10px;
    transition: box-shadow .15s ease, transform .2s var(--ease-out); }
  .wv2-acc-btn:hover { transform: translateY(-2px); box-shadow: 0 0 0 2px rgba(6,150,215,0.35); }
  .wv2-acc-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px #f5f5f5, 0 0 0 4px #0696d7; }
  .wv2-acc-btn .arr { transition: transform .3s var(--ease-out); display: inline-block; }
  .wv2-acc-btn[aria-expanded="true"] .arr { transform: rotate(90deg); }
  .wv2-sec.darkgray .wv2-acc-btn, .wv2-sec.darkblue .wv2-acc-btn, .wv2-sec.deep .wv2-acc-btn {
    background: #f5f5f5; color: #1a1f25; }
  .wv2-sec.darkgray .wv2-acc-btn:focus-visible, .wv2-sec.darkblue .wv2-acc-btn:focus-visible,
  .wv2-sec.deep .wv2-acc-btn:focus-visible { box-shadow: 0 0 0 2px #1a1f25, 0 0 0 4px #38abdf; }

  /* ── deep dives ── */
  .wv2-deep { border-top: 1px solid rgba(60,60,60,0.15); padding: 44px 0 28px; }
  .wv2-deep-head { display: grid; grid-template-columns: 74px 1fr auto; gap: 24px; align-items: baseline; }
  @media (max-width: 700px){ .wv2-deep-head { grid-template-columns: 1fr; gap: 8px; } }
  .wv2-deep-idx { font-family: var(--wv-mono); font-size: 12px; color: var(--awb); }
  .wv2-deep-name { font-family: var(--wv-legend); font-weight: 700; letter-spacing: -0.015em;
    font-size: clamp(24px, 3vw, 38px); margin: 0 0 6px; }
  .wv2-deep-lede { font-size: 15.5px; line-height: 1.6; opacity: .8; margin: 0; max-width: 60ch; }
  .wv2-open-pill { font-family: var(--wv-mono); font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink);
    background: transparent; border: 1px solid rgba(128,128,128,0.5); border-radius: 2px;
    padding: 10px 18px; cursor: pointer; white-space: nowrap; align-self: center;
    transition: box-shadow .15s ease, border-color .15s ease; }
  .wv2-open-pill:hover { box-shadow: 0 0 0 2px rgba(128,128,128,0.15); }
  .wv2-open-pill:focus-visible { outline: none; border-color: #0696d7; box-shadow: 0 0 0 2px rgba(6,150,215,0.35); }
  .wv2-open-pill[aria-expanded="true"] { background: rgba(6,150,215,0.15); border-color: rgba(6,150,215,0.5); }
  .wv2-deep-body { display: grid; grid-template-columns: 1fr 1.1fr; gap: 44px; padding-top: 34px; }
  @media (max-width: 860px){ .wv2-deep-body { grid-template-columns: 1fr; gap: 24px; } }
  .wv2-deep-prose .row { display: grid; grid-template-columns: 84px 1fr; gap: 0 20px;
    padding: 14px 0; border-top: 1px solid rgba(60,60,60,0.1); align-items: baseline; }
  .wv2-deep-prose .k { font-family: var(--wv-mono); font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--awb-7); }
  .wv2-deep-prose p { font-size: 14px; line-height: 1.65; opacity: .85; margin: 0; }
  .wv2-figs { display: grid; gap: 14px; align-content: start; }
  .wv2-fig { border: 1px solid rgba(60,60,60,0.12); border-radius: 4px; overflow: hidden;
    background: var(--white); }
  .wv2-fig img { width: 100%; display: block; }
  .wv2-fig .cap { font-family: var(--wv-mono); font-size: 9.5px; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: .55; padding: 9px 12px;
    border-top: 1px solid rgba(60,60,60,0.1); }

  /* ── ownership ── */
  .wv2-own { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px 26px; margin-bottom: 44px; }
  @media (max-width: 860px){ .wv2-own { grid-template-columns: 1fr; } }
  .wv2-own-item { border-top: 2px solid var(--awb-4); padding-top: 16px; }
  .wv2-own-item h4 { font-family: var(--wv-sans); font-weight: 600; font-size: 16.5px; margin: 0 0 9px; }
  .wv2-own-item p { font-size: 14px; line-height: 1.62; opacity: .82; margin: 0; }
  .wv2-collab { font-size: 15px; line-height: 1.66; opacity: .85; max-width: 66ch; margin: 0; }

  /* ── accessibility ── */
  .wv2-axx { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  @media (max-width: 760px){ .wv2-axx { grid-template-columns: 1fr; } }
  .wv2-ax { background: var(--white); border: 1px solid rgba(60,60,60,0.1); border-radius: 4px;
    padding: 24px 22px; }
  .wv2-ax .tag { display: inline-block; font-family: var(--wv-mono); font-size: 9px;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--awb-7);
    background: rgba(6,150,215,0.08); border-radius: 2px; padding: 4px 8px; margin-bottom: 14px; }
  .wv2-ax h4 { font-family: var(--wv-sans); font-weight: 600; font-size: 17px; margin: 0 0 8px; }
  .wv2-ax p { font-size: 14px; line-height: 1.62; opacity: .8; margin: 0 0 16px; }
  .wv2-ax .demo { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .wv2-ax kbd { font-family: var(--wv-mono); font-size: 10.5px; background: var(--paper);
    border: 1px solid rgba(60,60,60,0.2); border-bottom-width: 2px; border-radius: 2px; padding: 4px 8px; }
  .wv2-halo-demo { display: inline-flex; font-family: var(--wv-sans); font-weight: 600; font-size: 14px;
    padding: 8px 16px; border-radius: 2px; background: #0696d7; color: #fff;
    box-shadow: 0 0 0 2px rgba(6,150,215,0.35); }

  /* ── results ── */
  .wv2-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 52px; }
  @media (max-width: 760px){ .wv2-results { grid-template-columns: 1fr; } }
  .wv2-result { border: 1px solid rgba(188,211,238,0.25); border-radius: 4px; padding: 26px 22px;
    background: rgba(69,79,97,0.3); }
  .wv2-result .rn { font-family: var(--wv-legend); font-weight: 700; letter-spacing: -0.02em;
    font-size: clamp(30px, 4vw, 50px); line-height: 1; }
  .wv2-result .rn .tbd { color: var(--awb-4); font-size: .55em; letter-spacing: .08em;
    font-family: var(--wv-mono); font-weight: 400; }
  .wv2-result .rl { font-family: var(--wv-mono); font-size: 10.5px; letter-spacing: 0.05em;
    text-transform: uppercase; opacity: .65; margin-top: 13px; line-height: 1.55; }
  .wv2-outcome { border-radius: 4px; background: var(--awb); color: #fff;
    padding: clamp(30px, 4.5vw, 54px); margin: 20px 0 40px; }
  .wv2-outcome .k { font-family: var(--wv-mono); font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase; opacity: .85; margin-bottom: 18px; }
  .wv2-outcome p { font-family: var(--wv-legend); font-weight: 700; letter-spacing: -0.015em;
    font-size: clamp(21px, 2.8vw, 34px); line-height: 1.25; margin: 0; max-width: 30ch; }

  .wv2-sec.deep .proj-footer { border-top-color: rgba(188,211,238,0.2); }
  .wv2-sec.deep .pf-label { color: rgba(245,245,245,0.68); }
  .wv2-sec.deep .pf-next-link { color: #f5f5f5; }
  .wv2-sec.deep .pf-pill { background: transparent; color: rgba(245,245,245,0.88);
    border-color: rgba(188,211,238,0.42); }
  .wv2-sec.deep .pf-pill:hover { background: transparent; border-color: #38abdf; color: #fff; }

  /* motion asks permission */
  @media (prefers-reduced-motion: reduce) {
    .wv2-cube { animation: none; transform: rotateX(-22deg) rotateY(35deg); }
    .wv2-skl span::after { animation: none; }
    .wv2 * { transition-duration: 0.01ms !important; }
  }
`;

function WvScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* one component deep dive — header always visible, dense material behind "open →" */
function WvDeep({ id, index, open, onToggle }) {
  const p = PROJECTS[id];
  if (!p || !p.case) return null;
  const shots = (p.items || []).filter((it) => it.src);
  const prose = [["problem", p.case.problem], ["solution", p.case.solution], ["outcome", p.case.outcome]].filter(([, b]) => b);
  return (
    <div className="wv2-deep">
      <div className="wv2-deep-head">
        <span className="wv2-deep-idx">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3 className="wv2-deep-name">{p.name.replace(/\.$/, "")}</h3>
          <p className="wv2-deep-lede">{p.short}</p>
        </div>
        <button className="wv2-open-pill" onClick={() => onToggle(id)} aria-expanded={open}>
          {open ? "close ↑" : "open →"}
        </button>
      </div>
      <div className={"wv2-acc" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="wv2-deep-body">
          <div className="wv2-deep-prose">
            {prose.map(([label, body]) => (
              <div className="row" key={label}>
                <span className="k">{label}</span>
                <p>{body}</p>
              </div>
            ))}
          </div>
          {shots.length > 0 && (
            <div className="wv2-figs">
              {shots.map((s, i) => (
                <figure className="wv2-fig" key={i} style={{ margin: 0 }}>
                  <img src={s.src} alt={s.caption || p.name} loading="lazy" />
                  <figcaption className="cap">{p.name.replace(/\.$/, "")} · {s.caption} · exported from the weave figma library</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── the full case page ── */
function WeaveCase({ spec, onAsk }) {
  const [theme, setTheme] = useStateWv("darkBlue");
  const [density, setDensity] = useStateWv("medium");
  const [deepOpen, setDeepOpen] = useStateWv(null);

  useEffectWv(() => {
    document.body.classList.add("wv-mode");
    /* header items invert while a dark band passes underneath */
    const onScroll = () => {
      const y = 46;
      let invert = false;
      for (const s of document.querySelectorAll(".wv2-hero, .wv2-sec")) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          invert = s.classList.contains("wv2-hero") || s.classList.contains("darkgray")
            || s.classList.contains("darkblue") || s.classList.contains("deep");
          break;
        }
      }
      document.body.classList.toggle("wv-head-invert", invert);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("wv-mode", "wv-head-invert");
    };
  }, []);

  const T = WV_THEMES[theme];
  const D = WV_DENSITY[density];
  /* the viewport reads the selected theme + density as CSS vars — the same
     resolution step Weave's theme provider does in product */
  const vpVars = {
    "--vp-s100": T.s100, "--vp-s200": T.s200, "--vp-s300": T.s300, "--vp-s350": T.s350,
    "--vp-text": T.text, "--vp-dim": T.textDim, "--vp-ph": T.placeholder,
    "--vp-accent": T.accent, "--vp-accent-text": T.accentText,
    "--vp-div": T.dividerLight, "--vp-border": T.borderBase,
    "--vp-halo": T.haloFocus, "--vp-halo-hover": T.haloHover, "--vp-halo-press": T.haloPressed,
    "--vp-selected": T.selectedBg, "--vp-hover": T.haloHover,
    "--vp-skeleton": T.skeleton, "--vp-shadow": T.shadow,
    "--vp-btnpadv": D.btnPadV + "px", "--vp-btnpadh": D.btnPadH + "px",
    "--vp-btnfont": D.btnFont + "px", "--vp-btnlh": D.btnLh + "px",
    "--vp-inputh": D.inputH + "px", "--vp-panelhead": D.panelHeadH + "px",
    "--vp-rowh": D.rowH + "px", "--vp-headh": D.headH + "px", "--vp-sp": D.sp,
  };

  const toggleDeep = (id) => setDeepOpen((cur) => (cur === id ? null : id));

  return (
    <div className="wv2">
      <style>{__WV2_STYLE}</style>

      {/* rail */}
      <nav className="wv2-rail" aria-label="sections">
        <button onClick={() => WvScrollTo("wv2-top")}>overview</button>
        <button onClick={() => WvScrollTo("wv2-story")}>the story</button>
        <button onClick={() => WvScrollTo("wv2-own")}>ownership</button>
        <button onClick={() => WvScrollTo("wv2-live")}>the system, live</button>
        <button onClick={() => WvScrollTo("wv2-components")}>components</button>
        <button onClick={() => WvScrollTo("wv2-access")}>accessibility</button>
        <button onClick={() => WvScrollTo("wv2-results")}>results</button>
      </nav>

      {/* ── hero: the viewport ── */}
      <header className="wv2-hero" id="wv2-top">
        <div className="wv2-floor" aria-hidden="true"></div>
        <div className="wv2-horizon" aria-hidden="true"></div>
        <span className="wv2-vplabel" style={{ top: 108, left: 24 }}>[ viewport 1 ] · perspective · shaded</span>
        <span className="wv2-vplabel" style={{ bottom: 20, right: 24 }}>surface.level350 · #1A1F25 · dark blue scheme</span>

        {/* the viewcube — autodesk's most recognizable piece of chrome */}
        <div className="wv2-scene" aria-hidden="true">
          <div className="wv2-cube">
            <span className="wv2-face f1">FRONT</span>
            <span className="wv2-face f2">RIGHT</span>
            <span className="wv2-face f3">BACK</span>
            <span className="wv2-face f4">LEFT</span>
            <span className="wv2-face f5">TOP</span>
            <span className="wv2-face f6"></span>
          </div>
          <span className="wv2-gizmo"><b className="x">x</b> · <b className="y">y</b> · <b className="z">z</b></span>
        </div>

        <div className="wv2-wrap">
          <button className="wv2-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="wv2-eyebrow">autodesk · weave design system · 2022 to 2025</div>
          <h1 className="wv2-h1">Products that grew up apart. <em>One system that holds.</em></h1>
          <p className="wv2-hero-sub">
            Weave is Autodesk's cross-platform design system, the foundation under Autodesk's
            whole portfolio: AutoCAD, Fusion, Revit, and Inventor among them. Three themes, three densities, thousands of designers
            and engineers on it. I worked on its core for three years.
          </p>
          <button className="wv2-cta" onClick={() => WvScrollTo("wv2-story")}>enter the system ↓</button>
          <div className="wv2-hero-meta">
            <span className="wv2-hero-chip"><b>role</b>Product Designer, Design Systems</span>
            <span className="wv2-hero-chip"><b>company</b>Globant for Autodesk</span>
            <span className="wv2-hero-chip"><b>platforms</b>All Autodesk products · AutoCAD · Fusion · Revit · Inventor…</span>
            <span className="wv2-hero-chip"><b>timeline</b>2022 to 2025</span>
          </div>
        </div>
      </header>

      {/* ── 01 · the story ── */}
      <section className="wv2-sec paper wv2-grid-bg" id="wv2-story">
        <div className="wv2-wrap">
          <span className="wv2-chip">the story · 01</span>
          <h2 className="wv2-h2">Every divergence was paid for twice.</h2>

          <div className="wv2-context">
            <p>Autodesk's products grew up separately. AutoCAD, Fusion, Revit, Inventor, to name just four, each with its own patterns and components, serving 1.5M+ users between them. Every divergence cost twice: once in duplicated engineering and once in users relearning the same interaction product by product. Weave is the system that unifies them without flattening what makes each product work.</p>
            <p>The hard part wasn't drawing components. It was a token architecture coherent enough to hold across three color schemes and three densities, nine combinations in all, while AutoCAD runs high-density panels over a drawing canvas and Fusion breathes at medium over a 3D viewport. I worked on the system's core: components, tokens, and the documentation that makes adoption self-service.</p>
          </div>

          <div className="wv2-stats">
            <div className="wv2-stat"><div className="n">14</div><div className="l">core components shipped, may 2025 release</div></div>
            <div className="wv2-stat"><div className="n"><span className="acc">3×3</span></div><div className="l">themes × densities · 9 combinations, one semantic layer</div></div>
            <div className="wv2-stat"><div className="n">all</div><div className="l">autodesk products on one architecture: autocad, fusion, revit, inventor among them</div></div>
            <div className="wv2-stat"><div className="n">1.5M+</div><div className="l">users across the products weave serves</div></div>
          </div>

          <div className="wv2-decisions">
            {WV_DECISIONS.map((d, i) => (
              <div className="wv2-decision" key={i}>
                <div className="wv2-dec-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="wv2-dec-title">{d.title}</div>
                  <p className="wv2-dec-p">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · ownership ── */}
      <section className="wv2-sec darkblue" id="wv2-own">
        <div className="wv2-wrap">
          <span className="wv2-chip">ownership · 02</span>
          <h2 className="wv2-h2">What I owned.</h2>
          <div className="wv2-own">
            {WV_OWN.map((f, i) => (
              <div className="wv2-own-item" key={i}>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
          <p className="wv2-collab">
            Weave is a large team's work: engineering owned the React implementation and theme-provider
            infrastructure, design leadership owned the roadmap. My lane was component design, token logic,
            and the specs and QA criteria that let product teams implement without a designer in the room.
            The cross-team workshop model from the Panel work became the team's standard for aligning before building.
          </p>
        </div>
      </section>

      {/* ── 03 · the system, live ── */}
      <section className="wv2-sec darkgray" id="wv2-live">
        <div className="wv2-wrap">
          <span className="wv2-chip">the system, live · 03</span>
          <h2 className="wv2-h2">Nine combinations. Try all of them.</h2>
          <p className="wv2-live-note">
            <strong>Not a screenshot. This is the real thing.</strong> Everything below is built
            from Weave's actual theme data (<span className="tok">@weave-design/theme-data</span>),
            so you can see for yourself how the three themes and three densities work. Pick a theme,
            pick a density, and watch every color, button, and row adjust. It's exactly what happens
            inside AutoCAD when you switch.
          </p>

          <div className="wv2-switch-row">
            <div className="wv2-switch" role="group" aria-label="color scheme">
              <span className="lbl">theme</span>
              <div className="wv2-seg">
                {Object.keys(WV_THEMES).map((t) => (
                  <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}>{WV_THEMES[t].label}</button>
                ))}
              </div>
            </div>
            <div className="wv2-switch" role="group" aria-label="density">
              <span className="lbl">density</span>
              <div className="wv2-seg">
                {Object.keys(WV_DENSITY).map((d) => (
                  <button key={d} aria-pressed={density === d} onClick={() => setDensity(d)}>{WV_DENSITY[d].label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="wv2-viewport" style={vpVars}>
            <div className="wv2-vp-head">
              <span>weave / {T.label} / {D.label} density</span>
              <span>surface.level300 → {T.s300}</span>
            </div>
            <div className="wv2-vp-body">
              {/* panel — panel.* roles */}
              <div className="wv2-panel">
                <div className="wv2-panel-head"><span>Panel title</span><span className="x">✕</span></div>
                <div className="wv2-panel-body">
                  <input className="wv2-input" placeholder="Search layers…" aria-label="search layers" />
                  <div className="wv2-menu" role="presentation">
                    <div className="mi sel">Ceiling plans</div>
                    <div className="mi">Doors</div>
                    <div className="mi">Elevations</div>
                  </div>
                  <div className="wv2-skl" aria-hidden="true"><span></span><span></span><span></span></div>
                </div>
              </div>

              {/* stage — buttons + data grid */}
              <div className="wv2-stage">
                <span className="wv2-row-label">button · solid · outline · flat · disabled</span>
                <div className="wv2-btnrow">
                  <button className="wv2-btn solid" type="button">Create</button>
                  <button className="wv2-btn outline" type="button">Options</button>
                  <button className="wv2-btn flat" type="button">Learn more</button>
                  <button className="wv2-btn solid" type="button" aria-disabled="true" tabIndex={0}>Create</button>
                </div>

                <span className="wv2-row-label">data grid · table.* roles, row heights from density</span>
                <div className="wv2-grid-demo">
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Category</th><th>Code</th></tr>
                    </thead>
                    <tbody>
                      <tr className="sel"><td>Ceiling plans</td><td>Architectural</td><td>110-01 <span className="check">✓</span></td></tr>
                      <tr><td>Doors</td><td>Furniture</td><td>400-02</td></tr>
                      <tr><td>Elevations</td><td>Architectural</td><td>110-03</td></tr>
                      <tr><td>Floor framing</td><td>Structural</td><td>250-01 <span className="check">✓</span></td></tr>
                    </tbody>
                  </table>
                  <div className="wv2-grid-foot"><span>Rows per page: 5</span><span>1–5 of 100</span><span>‹ ›</span></div>
                </div>
              </div>
            </div>
          </div>

          <p className="wv2-live-foot">
            hover a button: 2px halo · press: 4px halo (button.pressed.haloWidth) · tab through: focus halo in halo.focus, {T.haloFocus} ·
            disabled stays focusable at opacity.disabled 0.4 · row height {D.rowH}px, header {D.headH}px, button label {D.btnFont}/{D.btnLh}, all from the {D.label}-density metrics ·
            artifakt element renders as dm sans here unless installed
          </p>
        </div>
      </section>

      {/* ── 04 · component deep dives ── */}
      <section className="wv2-sec paper wv2-grid-bg" id="wv2-components">
        <div className="wv2-wrap">
          <span className="wv2-chip">components · 04</span>
          <h2 className="wv2-h2">Four components, four different lessons.</h2>
          <p className="wv2-sec-sub">
            The ones I owned end to end. Each header stays put; the full story and the real spec
            artifacts open in place. No subpages.
          </p>
          {WEAVE_DEEP_DIVES.map((id, i) => (
            <WvDeep key={id} id={id} index={i} open={deepOpen === id} onToggle={toggleDeep} />
          ))}
        </div>
      </section>

      {/* ── 05 · accessibility ── */}
      <section className="wv2-sec paper wv2-grid-bg" id="wv2-access">
        <div className="wv2-wrap">
          <span className="wv2-chip">accessibility · 05</span>
          <h2 className="wv2-h2">Accessibility you can try.</h2>
          <p className="wv2-sec-sub">Concrete and demoable: the focus behavior below is the real halo spec. Tab through and try it.</p>

          <div className="wv2-axx">
            <div className="wv2-ax">
              <span className="tag">halo.focus · every interactive component</span>
              <h4>Focus is a halo outside the silhouette.</h4>
              <p>2px outside the silhouette in the accent at 35% opacity: hover 2px, pressed 4px in the base color. The component never changes size, so focus can't cause reflow.</p>
              <div className="demo">
                <span className="wv2-halo-demo" aria-hidden="true">Focused</span>
                <button className="wv2-btn solid" style={{ "--vp-accent": "#0696d7", "--vp-halo": "rgba(6,150,215,0.35)", "--vp-halo-hover": "rgba(128,128,128,0.15)", "--vp-halo-press": "rgba(128,128,128,0.25)", "--vp-btnfont": "14px", "--vp-btnlh": "18px", "--vp-btnpadv": "8px", "--vp-btnpadh": "16px" }} type="button">Tab to me</button>
              </div>
            </div>
            <div className="wv2-ax">
              <span className="tag">opacity.disabled = 0.4</span>
              <h4>Disabled stays discoverable.</h4>
              <p>Disabled controls fade to 40% but keep their place in the layout and their label legible. In the live viewport above, the disabled button still takes focus so its state can be announced.</p>
              <div className="demo"><button className="wv2-btn solid" style={{ "--vp-accent": "#0696d7", "--vp-btnfont": "14px", "--vp-btnlh": "18px", "--vp-btnpadv": "8px", "--vp-btnpadh": "16px" }} type="button" aria-disabled="true" tabIndex={0}>Create</button><span style={{ fontFamily: "var(--wv-mono)", fontSize: 9.5, opacity: .6 }}>← still in the tab order</span></div>
            </div>
            <div className="wv2-ax">
              <span className="tag">density ≠ touch target</span>
              <h4>Small pixels, same reach.</h4>
              <p>High density drops button padding to 4×12 and rows to 20px for pointer-first CAD work. But the density choice belongs to the product context, never applied where touch is expected.</p>
              <div className="demo"><kbd>high 20px</kbd><kbd>medium 32px</kbd><kbd>low 32px+</kbd></div>
            </div>
            <div className="wv2-ax">
              <span className="tag">prefers-reduced-motion</span>
              <h4>Motion asks permission.</h4>
              <p>The hero's orbiting cube, the skeleton wave, and the ticker all stop under prefers-reduced-motion, on this page and in the system's own loading guidance: persistent UI stays static, only loading content moves.</p>
              <div className="demo"><kbd>@media (prefers-reduced-motion: reduce)</kbd></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 · results ── */}
      <section className="wv2-sec deep" id="wv2-results">
        <div className="wv2-wrap">
          <span className="wv2-chip">results · 06</span>
          <h2 className="wv2-h2">The system is doing its job when nobody asks how.</h2>

          <div className="wv2-results">
            <div className="wv2-result"><div className="rn">14</div><div className="rl">core components in the may 2025 release, adopted across autocad, fusion, and revit</div></div>
            <div className="wv2-result"><div className="rn">9</div><div className="rl">theme × density combinations, one semantic token layer, zero component forks</div></div>
            <div className="wv2-result"><div className="rn"><span className="tbd">TBD</span></div><div className="rl">teams adopting without designer support · the number is real, pending clearance to publish</div></div>
          </div>

          <div className="wv2-context" style={{ marginBottom: 48, gridTemplateColumns: "1fr" }}>
            <p>Three years on Weave taught me that the best systems are invisible: they enable the product without announcing themselves. When teams stop asking "how does this work?" and start shipping, the system is working. The documentation-first bet paid off in the quietest possible way: silence from the support channel.</p>
          </div>

          <div className="wv2-outcome">
            <div className="k">why this matters</div>
            <p>A design system for one product is a style guide. A system that holds across an entire product portfolio, three schemes, and three densities is an architecture. And architecture is a design decision.</p>
          </div>

          <NextProjectFooter currentId="weave" onAsk={onAsk} />
        </div>
      </section>
    </div>
  );
}

/* register the case layout — "case-study" is the wired route (#/weave); keep an alias too */
if (typeof LAYOUTS !== "undefined") {
  LAYOUTS["case-study"] = WeaveCase;
  LAYOUTS["weave-case"] = WeaveCase;
}

Object.assign(window, { WeaveInlinePreview, WeaveCase, WvCircle });
