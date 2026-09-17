/* ════════════════════════════════════════════════════════════
   bmtax.jsx — immersive case page for BM TAX.
   The page wears BMtax's skin: every value below is sampled from
   the live site (bmtax.com.br) — annotated per token.
   Focus of this case: the visual system, the motion language
   (rebuilt live in code, no videos), and the iteration story.
   Registers LAYOUTS["bmtax-case"] → hash route #/bmtax (app.jsx).
   ════════════════════════════════════════════════════════════ */

const { useState: useStateBmt, useEffect: useEffectBmt, useRef: useRefBmt } = React;

/* ── BMtax identity — sampled from the live site, not invented ──
   ink        #292E34  (body text, sampled bmtax.com.br)
   coal       #181818  (dark bands: nossos produtos, em alta cards)
   paper      #EFEFEF  (page floor / off-white surface)
   mint       #16DED0  (the ✕ in the logo, big numerals, CONTATO)
   hairline   rgba(0,0,0,0.55) at 1px — the exposed grid lines
              that cross the whole layout like blueprint rules
   type       Space Grotesk, everywhere: nav, body, and the
              150px stat numerals. one family, many weights.
   radius     ~4px on buttons; the layout itself is squared.  */

const __BMT_STYLE = `
  /* free the page from the constrained canvas — full-bleed bands */
  body.bmt-mode .canvas { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  /* a transformed ancestor would hijack the rail's position:fixed */
  body.bmt-mode .page-enter { animation: none !important; }
  body.bmt-mode .atmosphere, body.bmt-mode .grain { display: none; }
  body.bmt-mode { background: #efefef; /* paper — page floor, sampled live */ }

  /* header protection: pure backdrop blur (no bar); items adapt to the band underneath */
  body.bmt-mode .topbar::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    -webkit-mask-image: linear-gradient(#000 60%, transparent);
    mask-image: linear-gradient(#000 60%, transparent);
  }
  body.bmt-mode .topbar > * { position: relative; z-index: 1; }
  body.bmt-mode .topbar .logo { color: #292e34; transition: color .3s ease; }
  body.bmt-mode .nav-link { color: rgba(41,46,52,0.6); transition: color .3s ease; }
  body.bmt-mode .nav-link:hover, body.bmt-mode .nav-link.active { color: #292e34; }
  body.bmt-mode.bmt-head-invert .topbar .logo { color: #efefef; }
  body.bmt-mode.bmt-head-invert .nav-link { color: rgba(239,239,239,0.72); }
  body.bmt-mode.bmt-head-invert .nav-link:hover,
  body.bmt-mode.bmt-head-invert .nav-link.active { color: #16ded0; }

  .bmt {
    --ink: #292e34;       /* sampled live · body text */
    --coal: #181818;      /* sampled live · dark bands */
    --paper: #efefef;     /* sampled live · page floor */
    --mint: #16ded0;      /* sampled live · the ✕, numerals, contato */
    --hair: rgba(41,46,52,0.25);      /* the exposed grid, on paper */
    --hair-inv: rgba(239,239,239,0.22); /* the exposed grid, on coal */
    --bmt-grot: "Space Grotesk", "Archivo", system-ui, sans-serif;
    font-family: var(--bmt-grot); color: var(--ink);
  }

  /* focus is visible everywhere; mint ring on dark bands */
  .bmt :focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .bmt .dark :focus-visible { outline-color: var(--mint); }

  .bt-wrap { max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 72px) 0 clamp(24px, 15vw, 240px); }
  @media (max-width: 1100px){ .bt-wrap { padding-left: clamp(24px, 5vw, 72px); } }

  /* ── left rail ── */
  .bt-rail { position: fixed; left: 36px; top: 50%; transform: translateY(-50%);
    z-index: 30; display: flex; flex-direction: column; gap: 20px;
    mix-blend-mode: difference; }
  @media (max-width: 1100px){ .bt-rail { display: none; } }
  .bt-rail button { display: flex; align-items: center; gap: 12px; background: none;
    border: none; padding: 0; cursor: pointer; font-family: var(--mono);
    font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #fff; opacity: .8; transition: opacity .2s ease; }
  .bt-rail button:hover { opacity: 1; }
  .bt-rail button::before { content: ""; width: 22px; height: 1.5px; background: #fff;
    transition: width .25s var(--ease-out); }
  .bt-rail button:hover::before { width: 40px; }

  /* ── the exposed grid — the site's signature: hairlines crossing the layout ── */
  .bt-sec { position: relative; padding: 96px 0 110px; }
  .bt-sec.paper { background: var(--paper); }
  .bt-sec.dark { background: var(--coal); color: var(--paper); }
  .bt-sec .rule-h { position: absolute; left: 0; right: 0; height: 1px;
    background: var(--hair); pointer-events: none; }
  .bt-sec.dark .rule-h { background: var(--hair-inv); }
  .bt-sec .rule-v { position: absolute; top: 0; bottom: 0; width: 1px;
    background: var(--hair); pointer-events: none; }
  .bt-sec.dark .rule-v { background: var(--hair-inv); }
  @media (max-width: 760px){ .bt-sec .rule-v { display: none; } }

  .bt-chip { display: inline-block; font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase; color: inherit;
    border: 1px solid currentColor; padding: 8px 14px; margin-bottom: 30px; opacity: .85; }
  .bt-h2 { font-family: var(--bmt-grot); font-weight: 700; letter-spacing: -0.03em;
    font-size: clamp(40px, 7vw, 96px); line-height: 1.0; margin: 0 0 28px; max-width: 16ch; }
  .bt-h2 .x { color: var(--mint); font-weight: 700; }
  .bt-lede { font-size: clamp(16px, 1.6vw, 20px); line-height: 1.6; max-width: 56ch;
    margin: 0 0 54px; opacity: .85; }

  /* ── hero — coal, hairline grid, the mint ✕ as the only color ── */
  .bt-hero { position: relative; background: var(--coal); color: var(--paper);
    overflow: hidden; padding: 150px 0 96px; }
  .bt-hero .grid-lines { position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(var(--hair-inv) 1px, transparent 1px),
      linear-gradient(90deg, var(--hair-inv) 1px, transparent 1px);
    background-size: 25% 33%; opacity: .8; }
  .bt-hero .bt-wrap { position: relative; }
  .bt-xmark { position: absolute; top: 110px; right: clamp(24px, 8vw, 120px);
    font-family: var(--bmt-grot); font-weight: 700; font-size: clamp(120px, 20vw, 300px);
    line-height: 1; color: var(--mint); opacity: .9; pointer-events: none; user-select: none;
    animation: btXin 1.1s var(--ease-out) both; }
  @keyframes btXin { from { transform: scale(.6) rotate(-14deg); opacity: 0; }
    to { transform: scale(1) rotate(0deg); opacity: .9; } }
  @media (max-width: 900px){ .bt-xmark { display: none; } }
  .bt-back { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--paper); background: rgba(239,239,239,0.08);
    border: 1px solid rgba(239,239,239,0.4); padding: 9px 16px; cursor: pointer;
    margin-bottom: 44px; transition: background .2s ease; }
  .bt-back:hover { background: rgba(239,239,239,0.2); }
  .bt-eyebrow { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--mint); margin-bottom: 30px; }
  .bt-h1 { font-family: var(--bmt-grot); font-weight: 700; letter-spacing: -0.03em;
    font-size: clamp(48px, 8.5vw, 130px); line-height: 0.98; margin: 0 0 42px; max-width: 13ch; }
  .bt-h1 .x { color: var(--mint); }
  .bt-hero-sub { font-size: clamp(17px, 1.8vw, 21px); line-height: 1.55;
    color: rgba(239,239,239,0.85); max-width: 54ch; margin: 0 0 44px; }
  .bt-cta { display: inline-flex; align-items: center; gap: 14px;
    font-family: var(--bmt-grot); font-weight: 700; font-size: 13px;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--coal);
    background: var(--mint); border: none; border-radius: 4px; padding: 18px 26px;
    cursor: pointer; transition: transform .2s var(--ease-out); }
  .bt-cta:hover { transform: translateY(-2px); }
  .bt-cta:active { transform: scale(0.98); }
  .bt-cta .arr { transition: transform .25s var(--ease-out); }
  .bt-cta:hover .arr { transform: translateX(5px); }
  .bt-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
  .bt-hero-chip { font-family: var(--mono); font-size: 10.5px; padding: 7px 14px;
    border: 1px solid rgba(239,239,239,0.35); color: rgba(239,239,239,0.85); }
  .bt-hero-chip b { color: var(--paper); font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; font-size: 9px; margin-right: 6px; }

  /* ── ✕ divider strip — the logo's mark, used the way the site uses it ── */
  .bt-xstrip { display: flex; align-items: center; justify-content: center; gap: 34px;
    background: var(--paper); border-top: 1px solid var(--hair);
    border-bottom: 1px solid var(--hair); padding: 13px 0; overflow: hidden; }
  .bt-xstrip span { font-family: var(--bmt-grot); font-weight: 700; font-size: 13px; }
  .bt-xstrip span:nth-child(odd) { color: var(--mint); }
  .bt-xstrip span:nth-child(even) { color: var(--ink); opacity: .35; }

  /* ── 01 · visual system ── */
  .bt-pal { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 44px; }
  @media (max-width: 760px){ .bt-pal { grid-template-columns: repeat(2, 1fr); } }
  .bt-sw { border: 1px solid var(--hair); }
  .bt-sw .c { height: 92px; }
  .bt-sw .m { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.08em;
    padding: 10px 12px; line-height: 1.7; border-top: 1px solid var(--hair);
    background: #fff; }
  .bt-sw .m b { display: block; text-transform: uppercase; letter-spacing: 0.14em; }

  .bt-spec { border: 1px solid var(--hair); background: #fff; padding: clamp(24px, 4vw, 48px);
    margin-bottom: 44px; }
  .bt-spec .big { font-family: var(--bmt-grot); font-weight: 700; letter-spacing: -0.03em;
    font-size: clamp(38px, 6vw, 84px); line-height: 1.02; margin: 0 0 10px; }
  .bt-spec .big .x { color: var(--mint); }
  .bt-spec .cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em;
    text-transform: uppercase; opacity: .55; margin-bottom: 30px; }
  .bt-spec-row { display: grid; grid-template-columns: 130px 1fr; gap: 20px;
    align-items: baseline; padding: 12px 0; border-top: 1px solid var(--hair); }
  .bt-spec-row .k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: .6; }
  @media (max-width: 560px){ .bt-spec-row { grid-template-columns: 90px 1fr; } }

  .bt-grid-demo { position: relative; border: 1px solid var(--hair); background: var(--paper);
    padding: clamp(24px, 4vw, 48px); overflow: hidden; }
  .bt-grid-demo .gl-h, .bt-grid-demo .gl-v { position: absolute; background: var(--hair); }
  .bt-grid-demo .gl-h { left: 0; right: 0; height: 1px; }
  .bt-grid-demo .gl-v { top: 0; bottom: 0; width: 1px; }
  .bt-grid-demo p { position: relative; font-size: 15px; line-height: 1.65; max-width: 44ch;
    margin: 0; opacity: .8; }
  .bt-grid-demo .tag { position: relative; font-family: var(--mono); font-size: 9.5px;
    letter-spacing: 0.16em; text-transform: uppercase; opacity: .5; margin-bottom: 14px; }

  /* ── 02 · motion — live recreations ── */
  .bt-motion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 860px){ .bt-motion-grid { grid-template-columns: 1fr; } }
  .bt-mo { border: 1px solid var(--hair-inv); background: #202020; padding: 26px 26px 30px;
    display: flex; flex-direction: column; gap: 16px; min-height: 250px; }
  .bt-mo .k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--mint); }
  .bt-mo h4 { font-family: var(--bmt-grot); font-weight: 700; font-size: 19px;
    letter-spacing: -0.01em; margin: 0; }
  .bt-mo p { font-size: 13.5px; line-height: 1.6; margin: 0; opacity: .7; }
  .bt-mo .stage { margin-top: auto; padding-top: 18px; min-height: 96px;
    display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
  .bt-replay { align-self: flex-start; font-family: var(--mono); font-size: 9.5px;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--paper); background: none;
    border: 1px solid rgba(239,239,239,0.35); padding: 7px 12px; cursor: pointer;
    transition: border-color .2s ease, color .2s ease; }
  .bt-replay:hover { border-color: var(--mint); color: var(--mint); }

  /* demo · counters (the numbers band) */
  .bt-num { display: flex; align-items: baseline; gap: 8px; }
  .bt-num .n { font-family: var(--bmt-grot); font-weight: 700; letter-spacing: -0.03em;
    font-size: clamp(44px, 5vw, 72px); line-height: 1; color: var(--mint);
    font-variant-numeric: tabular-nums; }
  .bt-num .l { font-family: var(--bmt-grot); font-weight: 500; font-size: 12px;
    line-height: 1.4; max-width: 14ch; opacity: .8; }

  /* demo · sizeIn reveal (the site's own keyframe name) */
  .bt-sizein { width: 120px; height: 80px; background: var(--paper); color: var(--coal);
    display: grid; place-items: center; font-family: var(--mono); font-size: 9px;
    letter-spacing: 0.12em; text-transform: uppercase; }
  .bt-sizein.play { animation: btSizeIn .7s var(--ease-out) both; }
  @keyframes btSizeIn { from { transform: scale(.92); opacity: 0; }
    to { transform: scale(1); opacity: 1; } }

  /* demo · squared arrow button */
  .bt-arrbtn { display: inline-flex; align-items: center; gap: 12px;
    font-family: var(--bmt-grot); font-weight: 700; font-size: 12px;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--paper);
    background: none; border: none; cursor: pointer; padding: 0; }
  .bt-arrbtn .box { width: 38px; height: 38px; border: 1px solid var(--mint);
    border-radius: 4px; display: grid; place-items: center; color: var(--mint);
    overflow: hidden; position: relative; }
  .bt-arrbtn .box i { font-style: normal; transition: transform .3s var(--ease-out); }
  .bt-arrbtn:hover .box i { transform: translateX(26px); }
  .bt-arrbtn .box::before { content: "→"; position: absolute; left: -26px; top: 50%;
    transform: translateY(-50%); transition: transform .3s var(--ease-out); }
  .bt-arrbtn:hover .box::before { transform: translate(26px, -50%); }
  .bt-arrbtn.mint-fill .box { background: var(--mint); color: var(--coal); }

  /* demo · product list rows (nossos produtos) */
  .bt-prod { width: 100%; }
  .bt-prod button { display: flex; align-items: center; gap: 12px; width: 100%;
    background: none; border: none; border-bottom: 1px solid rgba(239,239,239,0.15);
    color: var(--paper); font-family: var(--bmt-grot); font-weight: 500;
    font-size: 16px; text-align: left; padding: 11px 2px; cursor: pointer;
    transition: padding-left .25s var(--ease-out), color .2s ease; }
  .bt-prod button .xm { color: var(--mint); font-weight: 700;
    opacity: 0; transform: scale(.5); transition: opacity .25s ease, transform .25s var(--ease-out); }
  .bt-prod button:hover { padding-left: 12px; color: #fff; }
  .bt-prod button:hover .xm { opacity: 1; transform: scale(1); }

  .bt-mo-foot { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.04em;
    opacity: .55; line-height: 1.8; margin: 34px 0 0; }
  .bt-mo-foot b { color: var(--mint); font-weight: 700; }

  /* ── 03 · iteration ── */
  .bt-iter { display: flex; flex-direction: column; gap: clamp(36px, 5vw, 64px); }
  .bt-round { display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: start; }
  @media (max-width: 760px){ .bt-round { grid-template-columns: 1fr; } }
  .bt-round .meta .no { font-family: var(--bmt-grot); font-weight: 700;
    letter-spacing: -0.03em; font-size: clamp(38px, 4.5vw, 60px); line-height: 1;
    color: var(--mint); }
  .bt-round .meta h4 { font-family: var(--bmt-grot); font-weight: 700; font-size: 18px;
    margin: 10px 0 8px; letter-spacing: -0.01em; }
  .bt-round .meta p { font-size: 13.5px; line-height: 1.6; margin: 0; opacity: .72; }

  /* ── screens + image fallback ── */
  .bt-wide { max-width: 1500px; margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 48px); display: flex; flex-direction: column;
    gap: clamp(40px, 6vw, 80px); }
  .bt-shot { border: 1px solid var(--hair); background: #fff; line-height: 0; }
  .bt-shot img { width: 100%; height: auto; display: block; }
  .bt-cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; opacity: .6; line-height: 1.6; padding: 14px 2px 0;
    text-align: center; }
  .bt-duo { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 4vw, 56px);
    max-width: 980px; margin: 0 auto; width: 100%; }
  @media (max-width: 640px){ .bt-duo { grid-template-columns: 1fr; } }
  .bt-missing { border: 1.5px dashed var(--hair); background: transparent;
    min-height: 220px; display: grid; place-items: center; padding: 30px;
    font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.08em;
    line-height: 1.9; text-align: center; opacity: .55; }
  .bt-missing b { color: var(--ink); }
  .dark .bt-missing b { color: var(--paper); }
  .dark .bt-missing { border-color: var(--hair-inv); }

  /* ── decisions (dark band) + ownership ── */
  .bt-decisions { display: flex; flex-direction: column; margin-bottom: 72px; }
  .bt-decision { display: grid; grid-template-columns: 90px 1fr; gap: 0 32px;
    padding: 34px 0; border-top: 1px solid rgba(239,239,239,0.22); }
  .bt-decision:last-child { border-bottom: 1px solid rgba(239,239,239,0.22); }
  .bt-dec-num { font-family: var(--bmt-grot); font-weight: 700; letter-spacing: -0.04em;
    font-size: clamp(40px, 5vw, 66px); line-height: 1; color: rgba(22,222,208,0.35);
    user-select: none; padding-top: 4px; }
  .bt-dec-title { font-family: var(--bmt-grot); font-weight: 700;
    font-size: clamp(18px, 2.1vw, 23px); margin: 0 0 12px; line-height: 1.2;
    letter-spacing: -0.01em; }
  .bt-dec-p { font-size: 15px; line-height: 1.68; margin: 0; opacity: .8; }
  @media (max-width: 560px){ .bt-decision { grid-template-columns: 48px 1fr; gap: 0 20px; } }
  .bt-own { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 24px; margin-bottom: 28px; }
  @media (max-width: 860px){ .bt-own { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .bt-own { grid-template-columns: 1fr; } }
  .bt-own-item { border-top: 2.5px solid var(--mint); padding-top: 16px; }
  .bt-own-item h4 { font-family: var(--bmt-grot); font-weight: 700; font-size: 16px; margin: 0 0 8px; }
  .bt-own-item p { font-size: 14px; line-height: 1.6; margin: 0; opacity: .75; }
  .bt-collab { font-family: var(--mono); font-size: 11.5px; opacity: .6;
    margin: 0; line-height: 1.7; max-width: 88ch; }

  /* portfolio footer on the dark band */
  .bt-sec.dark .pf-label { color: rgba(239,239,239,0.55); }
  .bt-sec.dark .pf-next-link { color: var(--paper); }
  .bt-sec.dark .pf-next-link:hover { color: var(--mint); }
  .bt-sec.dark .pf-pill { background: transparent; color: var(--paper);
    border-color: rgba(239,239,239,0.35); }
  .bt-sec.dark .pf-pill:hover { color: var(--mint); border-color: var(--mint); }

  /* motion asks permission — every animation here is transform/opacity-only */
  @media (prefers-reduced-motion: reduce) {
    .bt-xmark, .bt-sizein.play { animation: none !important; }
    .bmt * { transition-duration: 0.01ms !important; }
  }
`;

const BMT_DECISIONS = [
  {
    title: "One accent, spent in exactly three places",
    body: "The whole site lives in ink on off-white and coal, and the brand's mint (#16DED0) is rationed: the ✕ of the logo, the 150-pixel numerals, and the actions. Because nothing else is allowed to be that color, a tax consultancy's driest assets — statistics and CTAs — become the loudest things on the page. Restraint is what makes the accent read as confidence instead of decoration."
  },
  {
    title: "Expose the grid instead of hiding it",
    body: "Hairline rules cross the entire layout, joining sections like a technical drawing. For a company whose product is precision — files, calculations, compliance — the blueprint look isn't a style layered on top; it's the argument. The structure of the page performs the structure of the service."
  },
  {
    title: "One typeface, many volumes",
    body: "Space Grotesk does everything: nav labels, body text, headings, and the giant numerals. Hierarchy comes from size and weight, never from switching voices. That's what keeps a content-heavy institutional site feeling like one calm system instead of a template with sections."
  },
  {
    title: "Motion that behaves like the data it presents",
    body: "Every moving element resolves to a precise final state: counters land on exact figures, reveals settle with a short ease-out, arrows travel and stop. No bounce, no float, nothing decorative. The motion language had to say the same thing the numbers do — measured, verifiable, done."
  },
  {
    title: "Every interactive moment is a designed state",
    body: "The products band exists as a six-state component — one per highlighted vertical — so its hover behavior runs as a real Figma prototype. The contact page ships as three states: form, success, and error. Nothing interactive was left as a note in the margin; if it moves or responds, there's a frame for it."
  },
];

const BMT_OWN = [
  { h: "The whole website", p: "Every page and every layout, desktop and mobile: home, sobre, expertise, notícias, equipe, contato — PT and EN." },
  { h: "The visual system", p: "How the existing brand becomes an interface: the exposed grid, the mint budget, the type scale, the ✕ as a graphic motif." },
  { h: "Motion design", p: "The full motion language: the counters, the sizeIn reveals, arrow-button behavior, hover states — specified per element for handoff." },
  { h: "State design", p: "Six saved states for the products band's hover prototype; three for the contact flow — form, success, error." },
  { h: "Content layouts", p: "Templates flexible enough for tax-reform explainers, product verticals, articles, and the Intelligence Tax Hub showcase." },
  { h: "Handoff", p: "Specs and behavior notes for development — states, breakpoints, and the motion timing that survived into production." },
];

/* the numbers the site itself leads with — recreated as live counters */
const BMT_NUMS = [
  { to: 18, label: "mil CNPJs monitorados" },
  { to: 2, label: "trilhões de reais analisados" },
  { to: 45, label: "TB de dados processados com IA" },
  { to: 5, label: "milhões de documentos em minutos" },
];

function BmtScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* image with a graceful fallback: if the export isn't in the folder yet,
   show a labeled placeholder instead of a broken image */
function BmtImg({ src, alt, cap, bare }) {
  const [missing, setMissing] = useStateBmt(false);
  return (
    <figure style={{ margin: 0 }}>
      {missing ? (
        <div className="bt-missing" role="img" aria-label={alt}>
          <span>export pending<br /><b>{src}</b><br />{cap}</span>
        </div>
      ) : (
        <div className={"bt-shot" + (bare ? " bare" : "")}>
          <img src={src} alt={alt} loading="lazy" onError={() => setMissing(true)} />
        </div>
      )}
      <figcaption className="bt-cap">{cap}</figcaption>
    </figure>
  );
}

/* count-up numeral: starts when scrolled into view, lands on the exact figure.
   respects prefers-reduced-motion (jumps straight to the final value). */
function BmtNum({ to, label, replayKey }) {
  const [val, setVal] = useStateBmt(0);
  const ref = useRefBmt(null);
  const ran = useRefBmt(false);

  useEffectBmt(() => {
    ran.current = false;
    setVal(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => {
      if (ran.current) return;
      ran.current = true;
      if (reduce) { setVal(to); return; }
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); /* ease-out cubic — lands, doesn't bounce */
        setVal(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { run(); io.disconnect(); }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to, replayKey]);

  return (
    <div className="bt-num" ref={ref}>
      <span className="n">{val}</span>
      <span className="l">{label}</span>
    </div>
  );
}

function BmtaxCase({ spec, onAsk }) {
  const p = (typeof PROJECTS !== "undefined" && PROJECTS.bmtax) || {};
  const [countKey, setCountKey] = useStateBmt(0);
  const [sizeKey, setSizeKey] = useStateBmt(0);

  useEffectBmt(() => {
    document.body.classList.add("bmt-mode");
    /* header items invert while the coal bands pass underneath */
    const onScroll = () => {
      const y = 46;
      let invert = false;
      for (const s of document.querySelectorAll(".bt-hero, .bt-sec")) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          invert = s.classList.contains("dark") || s.classList.contains("bt-hero");
          break;
        }
      }
      document.body.classList.toggle("bmt-head-invert", invert);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("bmt-mode", "bmt-head-invert");
    };
  }, []);

  return (
    <div className="bmt">
      <style>{__BMT_STYLE}</style>

      {/* rail */}
      <nav className="bt-rail" aria-label="sections">
        <button onClick={() => BmtScrollTo("bt-top")}>overview</button>
        <button onClick={() => BmtScrollTo("bt-visual")}>visual</button>
        <button onClick={() => BmtScrollTo("bt-motion")}>motion</button>
        <button onClick={() => BmtScrollTo("bt-iteration")}>the file</button>
        <button onClick={() => BmtScrollTo("bt-screens")}>screens</button>
        <button onClick={() => BmtScrollTo("bt-decisions")}>decisions</button>
      </nav>

      {/* ── hero — coal, hairline grid, the mint ✕ ── */}
      <header className="bt-hero" id="bt-top">
        <div className="grid-lines" aria-hidden="true"></div>
        <div className="bt-xmark" aria-hidden="true">✕</div>
        <div className="bt-wrap">
          <button className="bt-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="bt-eyebrow">bm tax · estúdio brizza · 2024</div>
          <h1 className="bt-h1">Tax intelligence, made legible<span className="x">✕</span></h1>
          <p className="bt-hero-sub">
            BMTax turns tax complexity into strategic decisions for large companies. Their website
            had to do the same job in miniature: take an intimidating subject — ICMS credits,
            tax reform, fiscal data — and make it feel precise, modern, and calm. I designed the
            entire site: structure, every layout, and the motion language.
          </p>
          <button className="bt-cta" onClick={() => BmtScrollTo("bt-visual")}>
            see the system <span className="arr" aria-hidden="true">→</span>
          </button>
          <div className="bt-hero-meta">
            <span className="bt-hero-chip"><b>role</b>{p.role || "product designer — full website ux/ui + motion"}</span>
            <span className="bt-hero-chip"><b>client</b>bm tax · estúdio brizza</span>
            <span className="bt-hero-chip"><b>platforms</b>desktop · mobile · pt/en</span>
            <span className="bt-hero-chip"><b>shipped</b>2024 · live at bmtax.com.br</span>
          </div>
        </div>
      </header>

      {/* ✕ divider */}
      <div className="bt-xstrip" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => <span key={i}>✕</span>)}
      </div>

      {/* ── 01 · the visual system ── */}
      <section className="bt-sec paper" id="bt-visual">
        <div className="rule-h" style={{ top: 0 }}></div>
        <div className="rule-v" style={{ left: "12%" }}></div>
        <div className="bt-wrap">
          <span className="bt-chip">the visual system · 01</span>
          <h2 className="bt-h2">Blueprint, not brochure<span className="x">.</span></h2>
          <p className="bt-lede">
            The brand already existed — the wordmark with its mint ✕. My job was turning it into
            an interface language: three colors with strict jobs, one typeface at many volumes,
            and the layout's structure left deliberately visible.
          </p>

          <div className="bt-pal">
            <div className="bt-sw"><div className="c" style={{ background: "#efefef" }}></div>
              <div className="m"><b>paper · #EFEFEF</b>the page floor. almost everything sits on it.</div></div>
            <div className="bt-sw"><div className="c" style={{ background: "#292e34" }}></div>
              <div className="m"><b>ink · #292E34</b>every word. softened black, never pure.</div></div>
            <div className="bt-sw"><div className="c" style={{ background: "#181818" }}></div>
              <div className="m"><b>coal · #181818</b>the dark bands: products, em alta.</div></div>
            <div className="bt-sw"><div className="c" style={{ background: "#16ded0" }}></div>
              <div className="m"><b>mint · #16DED0</b>rationed: the ✕, the numerals, the actions.</div></div>
          </div>

          <div className="bt-spec">
            <div className="big">Space Grotesk<span className="x">.</span></div>
            <div className="cap">one family · nav to numerals · file styles: título 42 · subtítulo 24 · texto 16 (mobile 32 / 18 / 14)</div>
            <div className="bt-spec-row"><span className="k">numerals · 700</span>
              <span style={{ fontFamily: "var(--bmt-grot)", fontWeight: 700, fontSize: "clamp(34px,4.5vw,64px)", letterSpacing: "-0.03em", color: "#16ded0", lineHeight: 1 }}>18 · 2 · 45 · 5</span></div>
            <div className="bt-spec-row"><span className="k">heading · 700</span>
              <span style={{ fontFamily: "var(--bmt-grot)", fontWeight: 700, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: "-0.02em" }}>Inteligência tributária para decisões estratégicas.</span></div>
            <div className="bt-spec-row"><span className="k">body · 400</span>
              <span style={{ fontSize: 16, lineHeight: 1.6 }}>Unimos excelência tributária, profundidade analítica e inovação tecnológica.</span></div>
            <div className="bt-spec-row"><span className="k">label · 500 caps</span>
              <span style={{ fontWeight: 500, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>nossos produtos · em alta · contato</span></div>
          </div>

          <div className="bt-grid-demo">
            <div className="gl-h" style={{ top: "26%" }}></div>
            <div className="gl-h" style={{ bottom: "22%" }}></div>
            <div className="gl-v" style={{ left: "18%" }}></div>
            <div className="gl-v" style={{ right: "24%" }}></div>
            <div className="tag">the exposed grid</div>
            <p>
              Hairline rules run across the whole site, connecting sections like a technical
              drawing. Content doesn't float in white space — it's plotted. For a company that
              processes terabytes of fiscal data, the precision is the brand.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 · motion — rebuilt live ── */}
      <section className="bt-sec dark" id="bt-motion">
        <div className="rule-v" style={{ left: "9%" }}></div>
        <div className="bt-wrap">
          <span className="bt-chip">the motion · 02</span>
          <h2 className="bt-h2">Motion that lands, never floats<span className="x">.</span></h2>
          <p className="bt-lede">
            The site opens on a full-bleed film, then every element that moves resolves to an
            exact final state. These aren't videos of the motion — they're the behaviors
            themselves, rebuilt in code. Hover, scroll, and replay them.
          </p>

          <div className="bt-motion-grid">
            <div className="bt-mo">
              <span className="k">counters</span>
              <h4>The numbers band</h4>
              <p>BMTax's proof points count up when they enter the viewport and land on the exact figure — ease-out cubic, no overshoot. The site's real numbers:</p>
              <div className="stage" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {BMT_NUMS.map((n) => <BmtNum key={n.label + countKey} to={n.to} label={n.label} replayKey={countKey} />)}
              </div>
              <button className="bt-replay" onClick={() => setCountKey((k) => k + 1)}>↻ replay</button>
            </div>

            <div className="bt-mo">
              <span className="k">reveals</span>
              <h4>sizeIn — the site's own keyframe</h4>
              <p>Blocks arrive with a short scale-and-fade (0.92 → 1), settling in ~700ms. Enough to feel alive, never enough to delay reading.</p>
              <div className="stage">
                <div key={sizeKey} className="bt-sizein play">block</div>
                <div key={sizeKey + "b"} className="bt-sizein play" style={{ animationDelay: ".12s" }}>block</div>
                <div key={sizeKey + "c"} className="bt-sizein play" style={{ animationDelay: ".24s" }}>block</div>
              </div>
              <button className="bt-replay" onClick={() => setSizeKey((k) => k + 1)}>↻ replay</button>
            </div>

            <div className="bt-mo">
              <span className="k">micro-interaction</span>
              <h4>The squared arrow</h4>
              <p>Every CTA carries an outlined square with an arrow. On hover, the arrow exits right and re-enters from the left — travel with a destination. Try it:</p>
              <div className="stage">
                <button className="bt-arrbtn">saiba mais <span className="box"><i>→</i></span></button>
                <button className="bt-arrbtn mint-fill">fale com um especialista <span className="box"><i>→</i></span></button>
              </div>
            </div>

            <div className="bt-mo">
              <span className="k">hover states</span>
              <h4>The product list</h4>
              <p>The five verticals sit as bare text on the coal band. Hovering indents the row and reveals the mint ✕ — the logo's mark doing wayfinding work. Try it:</p>
              <div className="stage">
                <div className="bt-prod">
                  {["Crédito Acumulado e Ressarcimento", "Reforma Tributária", "Revisão Fiscal", "Due Diligence", "Microsserviços"].map((t) => (
                    <button key={t}><span className="xm">✕</span>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="bt-mo-foot">
            every behavior on this page is <b>transform and opacity only</b>, and honors
            prefers-reduced-motion — the same rule the handoff specs set for production.
          </p>
        </div>
      </section>

      {/* ── 03 · the working file — states, not stills ── */}
      <section className="bt-sec paper" id="bt-iteration">
        <div className="rule-h" style={{ top: 0 }}></div>
        <div className="rule-v" style={{ right: "16%" }}></div>
        <div className="bt-wrap">
          <span className="bt-chip">the working file · 03</span>
          <h2 className="bt-h2">Designed in states, not stills<span className="x">.</span></h2>
          <p className="bt-lede">
            Twenty-four screens in the file — fourteen desktop, ten mobile — but the real work
            is in what surrounds them: every interactive moment exists as a designed state, so
            the motion could be prototyped and handed off instead of described.
          </p>

          <div className="bt-iter">
            <div className="bt-round">
              <div className="meta">
                <div className="no">6✕</div>
                <h4>The products band</h4>
                <p>The dark band holding the five verticals lives as a six-state component — one variant per highlighted product — so the hover interaction runs as a real prototype, not an annotation.</p>
              </div>
              <BmtImg src="bmtax-exp-1.png" alt="The six saved states of the BM TAX products band component in Figma" cap="produtos · the six-state component · from the figma file" />
            </div>
            <div className="bt-round">
              <div className="meta">
                <div className="no">3✕</div>
                <h4>Contact, including the bad day</h4>
                <p>The contact page ships as three designed states: the form, the thank-you ("obrigado pela mensagem!"), and the error ("ops... algo deu errado"). The unhappy path got the same care as the happy one.</p>
              </div>
              <BmtImg src="bmtax-exp-2.png" alt="The three designed states of the BM TAX contact page: form, success, and error" cap="contato · form, success, error · from the figma file" />
            </div>
            <div className="bt-round">
              <div className="meta">
                <div className="no">24</div>
                <h4>Screens, one system</h4>
                <p>Home, sobre, expertise, blog, listagem, post, time, pessoa, políticas, 404 — desktop and mobile, held together by three text styles per platform and a handful of color variables.</p>
              </div>
              <BmtImg src="bmtax-final.png" alt="The shipped BM TAX design: exposed grid, mint accents, Space Grotesk" cap="shipped · live at bmtax.com.br" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · screens ── */}
      <section className="bt-sec paper" id="bt-screens" style={{ paddingTop: 0 }}>
        <div className="bt-wrap">
          <span className="bt-chip">the screens · 04</span>
          <h2 className="bt-h2">Shipped, PT and EN<span className="x">.</span></h2>
          <p className="bt-lede">
            Home, expertise, notícias, equipe, contato — every layout desktop and mobile,
            in two languages, live at bmtax.com.br.
          </p>
        </div>
        <div className="bt-wide">
          <BmtImg src="bmtax-home.png" alt="BM TAX homepage: film hero, product list on the coal band, mint numerals" cap="home · desktop · film hero, products, the numbers band" />
          <BmtImg src="bmtax-expertise.png" alt="BM TAX expertise page: five product verticals with imagery and detail blocks" cap="expertise · desktop · the five verticals" />
          <div className="bt-duo">
            <BmtImg src="bmtax-mobile-1.png" alt="BM TAX mobile homepage" cap="home · mobile" />
            <BmtImg src="bmtax-mobile-2.png" alt="BM TAX mobile expertise page" cap="expertise · mobile" />
          </div>
        </div>
      </section>

      {/* ── 05 · decisions + ownership ── */}
      <section className="bt-sec dark" id="bt-decisions">
        <div className="rule-v" style={{ left: "11%" }}></div>
        <div className="bt-wrap">
          <span className="bt-chip">the decisions · 05</span>
          <h2 className="bt-h2">Precision as a design language<span className="x">.</span></h2>
          <div className="bt-decisions">
            {BMT_DECISIONS.map((d, i) => (
              <div className="bt-decision" key={i}>
                <div className="bt-dec-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="bt-dec-title">{d.title}</div>
                  <p className="bt-dec-p">{d.body}</p>
                </div>
              </div>
            ))}
          </div>

          <span className="bt-chip">ownership · 06</span>
          <h2 className="bt-h2" style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}>What I owned<span className="x">.</span></h2>
          <div className="bt-own">
            {BMT_OWN.map((f, i) => (
              <div className="bt-own-item" key={i}>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
          <p className="bt-collab" style={{ marginBottom: 72 }}>
            Built at Estúdio Brizza for BMTax. The brand identity already existed; the website —
            its structure, every layout, and the motion language — was mine end to end, with the
            studio handling the client relationship.
          </p>

          <NextProjectFooter currentId="bmtax" onAsk={onAsk} />
        </div>
      </section>

    </div>
  );
}

if (typeof LAYOUTS !== "undefined") LAYOUTS["bmtax-case"] = BmtaxCase;

Object.assign(window, { BmtaxCase });
