/* ════════════════════════════════════════════════════════════
   bmtax.jsx — immersive case page for BM TAX.
   The page wears BMtax's skin: every value below is sampled from
   the live site (bmtax.com.br) — annotated per token.
   Same skeleton as the other studio brizza cases (baw, canal):
   hero → screens 01 → process 02 → decisions 03 + ownership 04.
   The motion language is rebuilt live in code inside process.
   Registers LAYOUTS["bmtax-case"] → hash route #/bmtax (app.jsx).
   ════════════════════════════════════════════════════════════ */

const { useState: useStateBmt, useEffect: useEffectBmt } = React;

/* ── BMtax identity — sampled from the live site, not invented ──
   ink        #292E34  (body text, sampled bmtax.com.br)
   coal       #181818  (dark bands: nossos produtos, em alta)
   paper      #EFEFEF  (page floor / off-white surface)
   mint       #16DED0  (the ✕ in the logo, big numerals, CONTATO —
              the file's "main color" variable, verified)
   hairline   1px rules that cross the whole layout like a
              technical drawing
   type       Space Grotesk everywhere (file styles: título 42 ·
              subtítulo 24 · texto 16; mobile 32/18/14)          */

const __BMT_STYLE = `
  /* --bt-r is the reveal radius. registering it is what makes it interpolable, so the
     spotlight EASES open and shut instead of snapping. unsupported browsers just get
     the snap, which still works. */
  @property --bt-r { syntax: "<length>"; inherits: true; initial-value: 0px; }

  /* free the page from the constrained canvas — full-bleed bands */
  body.bmt-mode .canvas { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  /* a transformed ancestor would hijack the rail's position:fixed */
  body.bmt-mode .page-enter { animation: none !important; }
  body.bmt-mode .atmosphere, body.bmt-mode .grain { display: none; }
  body.bmt-mode { background: #efefef; /* paper — page floor, sampled live */ }

  body.bmt-mode .topbar > * { position: relative; z-index: 1; }
  body.bmt-mode .topbar .logo { color: #292e34; transition: color .3s ease; }
  body.bmt-mode .nav-link { color: rgba(41,46,52,0.6); transition: color .3s ease; }
  body.bmt-mode .nav-link:hover, body.bmt-mode .nav-link.active { color: #292e34; }
  body.bmt-mode.bmt-head-invert .topbar .logo { color: #efefef; }
  body.bmt-mode.bmt-head-invert .nav-link { color: rgba(239,239,239,0.72); }
  body.bmt-mode.bmt-head-invert .nav-link:hover,
  body.bmt-mode.bmt-head-invert .nav-link.active { color: #16ded0; }
  /* paper veil over the hero only — the ✕ still runs to the top edge and shows
     through it; it just passes under a soft light wash so the ink logo and nav stay
     legible where they cross the coal arms. the topbar's own mask feathers the
     bottom, so there is no straight edge. */
  body.bmt-mode.bmt-hero-top .topbar::before {
    background: linear-gradient(to bottom,
      rgba(239,239,239,0.82) 0%, rgba(239,239,239,0.66) 58%, rgba(239,239,239,0) 100%);
  }

  .bmt {
    --ink: #292e34;       /* sampled live · body text */
    --coal: #181818;      /* sampled live · dark bands */
    --paper: #efefef;     /* sampled live · page floor */
    --mint: #16ded0;      /* sampled live · file var "main color" */
    --hair: rgba(41,46,52,0.25);        /* the exposed grid, on paper */
    --hair-inv: rgba(239,239,239,0.22); /* the exposed grid, on coal */
    --bmt-grot: "Space Grotesk", "Archivo", system-ui, sans-serif;
    font-family: var(--bmt-grot); color: var(--ink);
  }

  /* focus is visible everywhere; mint ring on dark bands */
  .bmt :focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .bmt .dark :focus-visible, .bmt .bt-hero :focus-visible { outline-color: var(--mint); }

  .bt-wrap { max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(24px, 9vw, 150px) 0 max(212px, clamp(24px, 15vw, 240px)); }
  @media (max-width: 1100px){ .bt-wrap { padding-left: clamp(24px, 5vw, 72px);
    padding-right: clamp(24px, 5vw, 72px); } }

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

  /* ── section scaffolding — hairline rules, the site's exposed grid ── */
  .bt-sec { position: relative; padding: 96px 0 110px; }
  .bt-sec.paper { background: var(--paper); }
  .bt-sec.white { background: #fff; }
  .bt-sec.dark { background: var(--coal); color: var(--paper); }
  /* the hairlines are the page's grid: they sit in the GUTTERS, 44px outside the
     content column, so they frame the copy instead of slicing through a headline. */
  .bt-sec .rule-v { position: absolute; top: 0; bottom: 0; width: 1px;
    background: var(--hair); pointer-events: none; }
  .bt-sec .rule-v.at-text-start { left: calc(max((100vw - 1280px) / 2, 0px) + max(212px, clamp(24px, 15vw, 240px)) - 44px); }
  .bt-sec .rule-v.at-text-end { right: calc(max((100vw - 1280px) / 2, 0px) + clamp(24px, 9vw, 150px) - 44px); }
  @media (max-width: 1100px){
    .bt-sec .rule-v.at-text-start { left: clamp(24px, 5vw, 72px); }
    .bt-sec .rule-v.at-text-end { right: clamp(24px, 5vw, 72px); }
  }
  .bt-sec.dark .rule-v { background: var(--hair-inv); }
  @media (max-width: 760px){ .bt-sec .rule-v { display: none; } }
  .bt-chip { display: inline-block; font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase; color: inherit;
    border: 1px solid currentColor; padding: 8px 14px; margin-bottom: 30px; opacity: .85; }
  .bt-count { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
    background: var(--ink); color: var(--paper); padding: 8px 14px; margin-left: 12px;
    display: inline-block; vertical-align: baseline; margin-bottom: 30px; }
  .bt-h2 { font-family: var(--bmt-grot); font-weight: 700; letter-spacing: -0.03em;
    font-size: clamp(40px, 7vw, 96px); line-height: 1.0; margin: 0 0 28px; max-width: 16ch; }
  .bt-h2 .x { color: var(--mint); font-weight: 700; }
  .bt-lede { font-size: clamp(16px, 1.6vw, 20px); line-height: 1.6; max-width: 56ch;
    margin: 0 0 54px; opacity: .85; }

  /* ── hero — the site's own device: the ✕ is a WINDOW, not a glyph. the media shows
     through the brand mark and the copy sits in the crossing. the mark comes from
     logo_icon.png, so the arms keep their real pointed tips: an earlier hand-drawn
     polygon filled the corners instead, which is what made it read as a fat bowtie. ── */
  /* no top padding: the ✕ band starts at the very top edge of the viewport, so there
     is no paper strip above it. the header and the back button float over the mark. */
  .bt-hero { position: relative; background: var(--paper); color: var(--ink);
    overflow: hidden; padding: 0; }
  /* the band is FULL HEIGHT, and that is what makes the mark work. the ✕ is sized by
     width (see below), so the band's height decides how much of it you see: a short
     band crops it into a horizontal mass, a full-height one shows the whole crossing
     with the arms running off all four edges. */
  .bt-xband { position: relative; width: 100%; height: 100vh;
    min-height: 520px; margin-top: 0; }
  /* masked with the brand's own icon (logo_icon.png, white ✕ on transparent), so the
     bar weight and the angles are the real mark rather than a polygon I guessed at.
     scaled by width and bleeding vertically, undistorted, like the shipped hero. */
  /* the ✕ is a WINDOW onto the coal fill, always open — no hover, no cursor-tracking.
     --bt-r stays huge so the radial mask never actually clips the crossing. */
  .bt-xband { --bt-r: 300vmax; --bt-x: 50%; --bt-y: 50%; }
  /* the ✕-shaped window itself. it holds only a ghost tint, so with the fill masked
     away the shape is hinted and nothing more. */
  .bt-xwin { position: absolute; inset: 0; overflow: hidden;
    background: rgba(41,46,52,0.055);
    -webkit-mask-image: url(logo_icon.png); mask-image: url(logo_icon.png);
    /* NEVER 100% 100%: that stretches the mark. the icon is square, so sizing it by
       WIDTH keeps the arms at their true 45° and makes it bleed past the top and
       bottom edges. paired with the full-height band above, the arms also reach the
       left and right edges, so the ✕ bleeds on all four sides without distorting. */
    -webkit-mask-size: 100% auto; mask-size: 100% auto;
    -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
    -webkit-mask-position: center; mask-position: center;
    animation: btXin 1.1s var(--ease-out) both; }
  /* the coal fill, opened only where the cursor is. --bt-r is 0px until the pointer
     enters the band, so at rest this layer is masked away completely. nesting it
     inside .bt-xwin intersects the two masks: spotlight ∩ ✕. */
  .bt-xfill { position: absolute; inset: 0; background: var(--coal);
    -webkit-mask-image: radial-gradient(circle var(--bt-r) at var(--bt-x) var(--bt-y),
      #000 0%, #000 64%, rgba(0,0,0,0) 100%);
    mask-image: radial-gradient(circle var(--bt-r) at var(--bt-x) var(--bt-y),
      #000 0%, #000 64%, rgba(0,0,0,0) 100%);
    -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
  /* a soft vignette INSIDE the fill (so the spotlight still governs it) */
  .bt-xfill::after { content: ""; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(50% 60% at 50% 47%, rgba(10,12,13,0.88), rgba(10,12,13,0.5) 60%, transparent 82%); }
  /* the crossing's own scrim, always on: the copy has coal behind it at the centre
     of the mark. clipped by the ✕ like everything else. */
  .bt-xcore { position: absolute; inset: 0; pointer-events: none; opacity: 1;
    background: radial-gradient(40% 31% at 50% 50%,
      rgba(10,12,13,0.94), rgba(10,12,13,0.58) 60%, transparent 86%); }
  @keyframes btXin { from { transform: scale(1.04); opacity: 0; }
    to { transform: scale(1); opacity: 1; } }
  /* the media filling the ✕; the gradient is what shows if no export is in yet */
  .bt-xwin .bt-xmedia { position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; display: block; }
  .bt-xwin .bt-xfallback { position: absolute; inset: 0;
    background:
      radial-gradient(120% 90% at 74% 18%, rgba(22,222,208,0.34), transparent 60%),
      radial-gradient(90% 80% at 18% 88%, rgba(41,46,52,0.9), transparent 62%),
      linear-gradient(140deg, #14171a, #23282d 58%, #101214); }
  /* the copy block sits in the crossing, on the coal fill, so it's paper throughout */
  .bt-hero-core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    z-index: 2; width: min(44ch, 74%); text-align: center;
    display: flex; flex-direction: column; align-items: center;
    color: var(--paper); text-shadow: 0 1px 24px rgba(10,12,13,0.55); }
  /* floats over the band, clear of the fixed header (88px tall). it can land on the
     paper wedge or on a coal arm depending on the viewport ratio, so it carries its
     own faint paper fill and stays ink either way. */
  .bt-back { position: absolute; z-index: 3; top: 104px; left: clamp(20px, 4vw, 44px);
    font-family: var(--mono); font-size: 10.5px;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink);
    background: rgba(239,239,239,0.86); border: 1px solid rgba(41,46,52,0.35);
    -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
    padding: 9px 16px; cursor: pointer;
    transition: background .2s ease, color .2s ease, border-color .2s ease; }
  .bt-back:hover { background: rgba(239,239,239,0.98); }
  .bt-eyebrow { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--mint); margin-bottom: 18px; }
  /* lowercase, light, one highlighted word: the landing hero's exact recipe,
     with the em's padding optically centered on the glyphs the same way */
  .bt-h1 { font-family: var(--bmt-grot); font-weight: 400; letter-spacing: -0.02em;
    text-transform: lowercase; font-size: clamp(30px, 3.9vw, 54px); line-height: 1.14;
    margin: 0 0 16px; max-width: 20ch; }
  .bt-h1 em { font-style: normal; font-weight: 700; background: var(--mint); color: var(--coal);
    display: inline-block; line-height: 1; padding: 0.1em 0.16em 0.16em;
    vertical-align: baseline; }
  /* inherits the hero-core colour so it crossfades with it instead of staying paper */
  .bt-hero-sub { font-size: clamp(14px, 1.15vw, 16px); line-height: 1.6;
    color: inherit; opacity: 0.86; max-width: 48ch; margin: 0 0 26px; }
  .bt-cta { display: inline-flex; align-items: center; gap: 14px; text-decoration: none;
    font-family: var(--bmt-grot); font-weight: 700; font-size: 13px;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--coal);
    background: var(--mint); border: none; border-radius: 4px; padding: 18px 26px;
    cursor: pointer; transition: transform .2s var(--ease-out); }
  .bt-cta:hover { transform: translateY(-2px); }
  .bt-cta:active { transform: scale(0.98); }
  .bt-cta .arr { transition: transform .25s var(--ease-out); }
  .bt-cta:hover .arr { transform: translateX(5px); }
  /* hero actions: the cta plus a link out to the shipped site */
  .bt-hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
    justify-content: center; }
  .bt-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px;
    justify-content: center; }
  .bt-hero-chip { font-family: var(--mono); font-size: 10.5px; padding: 7px 14px;
    border: 1px solid rgba(239,239,239,0.35); color: rgba(239,239,239,0.85); }
  .bt-hero-chip b { color: var(--paper); font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; font-size: 9px; margin-right: 6px; }

  /* motion turned down: skip only the load-in scale/fade on the ✕ mask */
  @media (prefers-reduced-motion: reduce) {
    .bt-xwin { animation: none; }
  }

  /* ── ✕ divider strip — the logo's mark, the site's own motif ── */
  .bt-xstrip { display: flex; align-items: center; justify-content: center; gap: 34px;
    background: var(--paper); border-top: 1px solid var(--hair);
    border-bottom: 1px solid var(--hair); padding: 13px 0; overflow: hidden; }
  .bt-xstrip span { font-family: var(--bmt-grot); font-weight: 700; font-size: 13px; }
  .bt-xstrip span:nth-child(odd) { color: var(--mint); }
  .bt-xstrip span:nth-child(even) { color: var(--ink); opacity: .35; }

  /* ── screens — the shipped work, composed big (bw-wide pattern) ── */
  .bt-wide { max-width: 1760px; margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 48px); display: flex; flex-direction: column;
    gap: clamp(40px, 6vw, 80px); }
  /* the section rail is position:fixed at the viewport's left edge and only
     exists above 1100px, so wide media has to start clear of it instead of
     running underneath the labels */
  @media (min-width: 1101px) { .bt-wide { padding-left: 212px; } }
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
  .dark .bt-missing { border-color: var(--hair-inv); }
  .dark .bt-missing b { color: var(--paper); }

  /* ── screens, shipped — full-bleed bands, same configuration as the other
     case studies (.mnf-full / .bw-full / .cn-full / .es-full): each capture
     runs the full viewport, the band's own left padding clears the fixed
     rail, and the band's background is sampled from that capture's own
     canvas so there's no seam between page and photo. images are ~2.2:1
     composed mockups, not tall full-page scrolls, so height is capped and
     centered rather than forced to 100% width. ── */
  .bt-full { margin-top: 12px; margin-bottom: 0;
    padding: 0;
    padding-left: max(212px, clamp(24px, 15vw, 240px));
    margin-left: calc(-1 * (max((100vw - 1280px) / 2, 0px) + max(212px, clamp(24px, 15vw, 240px))));
    margin-right: calc(-1 * (max((100vw - 1280px) / 2, 0px) + clamp(24px, 9vw, 150px))); }
  .bt-full + .bt-full { margin-top: 0; }
  @media (max-width: 1100px){ .bt-full { padding-left: 0;
    margin-left: calc(-1 * clamp(24px, 5vw, 72px));
    margin-right: calc(-1 * clamp(24px, 5vw, 72px)); } }
  .bt-full img { display: block; width: auto; height: auto;
    max-width: 100%; max-height: min(640px, 68vh); margin: 0 auto; border: 0; }

  /* ── scrollable screen frames — the shipped page inside a window you can actually
     scroll. one tall full-page capture per screen, so it reads like a prototype but
     costs a single image request instead of an embedded figma player. ── */
  .bt-scroller { margin: 0; }
  .bt-frame { max-width: 1180px; margin: 0 auto;
    border: 1px solid var(--hair); background: var(--paper);
    box-shadow: 0 30px 70px rgba(24,24,24,0.13); overflow: hidden; }
  .bt-frame-bar { position: relative; display: flex; align-items: center;
    padding: 11px 14px; border-bottom: 1px solid var(--hair); background: #e7e7e7; }
  .bt-frame-dots { display: flex; gap: 6px; }
  .bt-frame-dots i { width: 9px; height: 9px; border-radius: 50%; display: block;
    background: rgba(41,46,52,0.22); }
  .bt-frame-url { position: absolute; left: 50%; transform: translateX(-50%);
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
    color: rgba(41,46,52,0.62); background: var(--paper);
    border: 1px solid var(--hair); border-radius: 100px; padding: 4px 16px;
    white-space: nowrap; }
  .bt-viewport { position: relative; }
  /* the window. NOT overscroll-behavior: contain — when it reaches the end the page
     should carry on scrolling, otherwise the frame swallows the scroll and traps you. */
  /* an explicit height, NOT aspect-ratio + max-height: with both, chrome preserves the
     ratio by shrinking the WIDTH, so the window stops filling its own frame. a real
     browser window is a fixed height anyway. capped so the frame never swallows the
     viewport, which would lose the caption and any sense of which thing you scroll. */
  .bt-view { position: relative; overflow-y: auto; overflow-x: hidden;
    height: min(72vh, 620px); background: #fff; line-height: 0;
    scrollbar-width: thin; scrollbar-color: rgba(41,46,52,0.3) transparent; }
  .bt-view::-webkit-scrollbar { width: 8px; }
  .bt-view::-webkit-scrollbar-thumb { background: rgba(41,46,52,0.28);
    border-radius: 100px; }
  .bt-view::-webkit-scrollbar-track { background: transparent; }
  .bt-view img { width: 100%; height: auto; display: block; }
  /* keyboard users scroll this with the arrow keys, so it has to show focus */
  .bt-view:focus-visible { outline: 2px solid var(--mint); outline-offset: -2px; }
  /* the affordance: sits on the frame, not inside the scroll, and leaves once used */
  .bt-scroll-hint { position: absolute; right: 14px; bottom: 14px; z-index: 2;
    font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--paper); background: rgba(24,24,24,0.82);
    padding: 7px 12px; border-radius: 100px; pointer-events: none;
    transition: opacity .4s var(--ease-out); }
  .bt-scroll-hint.gone { opacity: 0; }
  /* phone: same mechanism, a taller window and no browser chrome */
  .bt-frame.phone { max-width: 310px; margin: 0 auto; border-radius: 22px; }
  .bt-frame.phone .bt-frame-bar { justify-content: center; padding: 9px 14px; }
  .bt-frame.phone .bt-frame-url { position: static; transform: none; }
  .bt-frame.phone .bt-view { height: min(68vh, 580px); }
  .bt-view .bt-missing { min-height: 100%; height: 100%; border: none;
    line-height: 1.9; }

  /* ── process — four phases (bw-process pattern) ── */
  .bt-process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  @media (max-width: 960px){ .bt-process { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .bt-process { grid-template-columns: 1fr; } }
  .bt-phase { border-top: 2.5px solid var(--ink); padding-top: 18px; }
  .bt-phase .k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.2em;
    text-transform: uppercase; opacity: .55; margin-bottom: 10px; }
  .bt-phase h4 { font-family: var(--bmt-grot); font-weight: 700;
    font-size: 19px; letter-spacing: -0.01em; margin: 0 0 10px; }
  .bt-phase p { font-size: 14px; line-height: 1.62; margin: 0; opacity: .78; }


  /* ── decisions (dark band) + ownership (bw pattern) ── */
  .bt-decisions { display: flex; flex-direction: column; margin-bottom: 72px; }
  /* the dividers are full-bleed rules, not borders on the row: they run the whole
     width of the band, edge to edge, instead of stopping at the text column. */
  .bt-decision { position: relative; display: grid; grid-template-columns: 90px 1fr;
    gap: 0 32px; padding: 34px 0; }
  .bt-decision::before, .bt-decision:last-child::after {
    content: ""; position: absolute; left: 50%; width: 100vw; transform: translateX(-50%);
    height: 1px; background: rgba(239,239,239,0.22); pointer-events: none; }
  .bt-decision::before { top: 0; }
  .bt-decision:last-child::after { bottom: 0; }
  .bt-dec-num { font-family: var(--bmt-grot); font-weight: 700; letter-spacing: -0.04em;
    font-size: clamp(40px, 5vw, 66px); line-height: 1; color: rgba(22,222,208,0.35);
    user-select: none; padding-top: 4px; }
  .bt-dec-title { font-family: var(--bmt-grot); font-weight: 700;
    font-size: clamp(18px, 2.1vw, 23px); margin: 0 0 12px; line-height: 1.2;
    letter-spacing: -0.01em; }
  .bt-dec-p { font-size: 15px; line-height: 1.68; margin: 0; opacity: .8; }
  @media (max-width: 560px){ .bt-decision { grid-template-columns: 48px 1fr; gap: 0 20px; } }
  .bt-own { position: relative; display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 26px 24px; margin-bottom: 28px; }
  @media (max-width: 860px){ .bt-own { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .bt-own { grid-template-columns: 1fr; } }
  /* two paper rules run the full band, end to end, and the mint tops sit on top of
     them: the grid keeps reading across the gaps between the columns. */
  .bt-own-rule { position: absolute; left: 50%; width: 100vw; transform: translateX(-50%);
    height: 1px; background: rgba(239,239,239,0.28); pointer-events: none; z-index: 0; }
  .bt-own-item { position: relative; z-index: 1;
    border-top: 2.5px solid var(--mint); padding-top: 16px; }
  .bt-own-item h4 { font-family: var(--bmt-grot); font-weight: 700; font-size: 16px; margin: 0 0 8px; }
  .bt-own-item p { font-size: 14px; line-height: 1.6; margin: 0; opacity: .75; }
  .bt-collab { font-family: var(--mono); font-size: 11.5px; opacity: .6;
    margin: 0; line-height: 1.7; max-width: none; }

  /* portfolio footer on the dark band */
  .bt-sec.dark .pf-label { color: rgba(239,239,239,0.55); }
  .bt-sec.dark .pf-next-link { color: var(--paper); }
  .bt-sec.dark .pf-next-link:hover { color: var(--mint); }
  .bt-sec.dark .pf-pill { background: transparent; color: var(--paper);
    border-color: rgba(239,239,239,0.35); }
  .bt-sec.dark .pf-pill:hover { color: var(--mint); border-color: var(--mint); }

  /* motion asks permission — every animation here is transform/opacity-only */
  @media (prefers-reduced-motion: reduce) {
    .bt-xwin { animation: none !important; }
    .bmt * { transition-duration: 0.01ms !important; }
  }
`;

const BMT_DECISIONS = [
  {
    title: "One accent, spent in exactly three places",
    body: "The whole site lives in ink on off-white and coal, and the brand's mint (#16DED0) is rationed: the ✕ of the logo, the 150-pixel numerals, and the actions. Because nothing else is allowed to be that color, a tax consultancy's driest assets (statistics and CTAs) become the loudest things on the page. Restraint is what makes the accent read as confidence instead of decoration."
  },
  {
    title: "Expose the grid instead of hiding it",
    body: "Hairline rules cross the entire layout, joining sections like a technical drawing. For a company whose product is precision (files, calculations, compliance), the blueprint look isn't a style layered on top; it's the argument. The structure of the page performs the structure of the service."
  },
  {
    title: "One typeface, many volumes",
    body: "Space Grotesk does everything: nav labels, body text, headings, and the giant numerals. Three text styles per platform (título 42, subtítulo 24, texto 16 on desktop; 32/18/14 on mobile) hold all twenty-four screens. Hierarchy comes from size and weight, never from switching voices."
  },
  {
    title: "Motion that behaves like the data it presents",
    body: "Every moving element resolves to a precise final state: counters land on exact figures, reveals settle with a short ease-out, arrows travel and stop. No bounce, no float, nothing decorative. The motion language had to say the same thing the numbers do: measured, verifiable, done."
  },
  {
    title: "Every interactive moment is a designed state",
    body: "The products band exists as a six-state component (one per highlighted vertical), so its hover behavior runs as a real Figma prototype. The contact page ships as three states: form, success, and error. Nothing interactive was left as a note in the margin; if it moves or responds, there's a frame for it."
  },
];

const BMT_OWN = [
  { h: "The whole website", p: "Every page and every layout, desktop and mobile: home, sobre, expertise, notícias, equipe, contato, in PT and EN." },
  { h: "The visual language", p: "How the existing brand becomes an interface: the exposed grid, the mint budget, the type scale, the ✕ as a graphic motif." },
  { h: "Motion design", p: "The full motion language: the counters, the sizeIn reveals, arrow-button behavior, hover states, specified per element for handoff." },
  { h: "State design", p: "Six saved states for the products band's hover prototype; three for the contact flow: form, success, error." },
  { h: "Content layouts", p: "Templates flexible enough for tax-reform explainers, product verticals, articles, and the Intelligence Tax Hub showcase." },
  { h: "Handoff", p: "Specs and behavior notes for development: states, breakpoints, and the motion timing that survived into production." },
];

function BmtScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* what shows through the ✕: bmtax-hero.jpg when it's in the folder, otherwise the
   gradient, so the hero reads properly either way */
function BmtHeroMedia() {
  const [missing, setMissing] = useStateBmt(false);
  if (missing) return <div className="bt-xfallback" aria-hidden="true"></div>;
  return (
    <img className="bt-xmedia" src="bmtax-hero.jpg" alt=""
      aria-hidden="true" onError={() => setMissing(true)} />
  );
}

function BmtaxCase({ spec, onAsk }) {
  const p = (typeof PROJECTS !== "undefined" && PROJECTS.bmtax) || {};
  useEffectBmt(() => {
    document.body.classList.add("bmt-mode");
    /* header items invert while the coal bands pass underneath */
    const onScroll = () => {
      const y = 46;
      let invert = false;
      for (const s of document.querySelectorAll(".bt-hero, .bt-sec")) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          invert = s.classList.contains("dark");
          break;
        }
      }
      document.body.classList.toggle("bmt-head-invert", invert);
      /* the hero's ✕ reaches the top edge, and the chrome straddles it: the corners
         are paper, the arms are coal, so no single text colour reads. while the hero
         is under the header, the scrim gets a paper tint so the ink chrome reads over
         both. it fades out with the existing mask, so it is a veil, not a block. */
      const hero = document.querySelector(".bt-hero");
      document.body.classList.toggle("bmt-hero-top",
        !!hero && hero.getBoundingClientRect().bottom > y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.body.classList.remove("bmt-mode", "bmt-head-invert");
    };
  }, []);

  return (
    <div className="bmt">
      <style>{__BMT_STYLE}</style>

      {/* rail — same stops as baw/canal */}
      <nav className="bt-rail" aria-label="sections">
        <button onClick={() => BmtScrollTo("bt-top")}>overview</button>
        <button onClick={() => BmtScrollTo("bt-screens")}>screens</button>
        <button onClick={() => BmtScrollTo("bt-process")}>process</button>
        <button onClick={() => BmtScrollTo("bt-decisions")}>decisions</button>
      </nav>

      {/* ── hero — the ✕ as a window, the way the shipped site builds it ── */}
      <header className="bt-hero" id="bt-top">
        <div className="bt-xband">
          <button className="bt-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="bt-xwin">
            <div className="bt-xfill"><BmtHeroMedia /></div>
            <div className="bt-xcore" aria-hidden="true"></div>
          </div>
          <div className="bt-hero-core">
            <div className="bt-eyebrow">bm tax · estúdio brizza · 2024</div>
            <h1 className="bt-h1">tax intelligence, made <em>legible</em></h1>
            <p className="bt-hero-sub">
              A tax consultancy's website, end to end: structure, every layout, and the motion.
              The job was to take an intimidating subject and make it feel precise and calm.
            </p>
            <div className="bt-hero-actions">
              <a className="bt-cta" href={p.liveUrl || "https://bmtax.com.br/"}
                target="_blank" rel="noopener noreferrer">
                visit the live site <span className="arr" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ✕ divider — the strip, like baw's marquee band */}
      <div className="bt-xstrip" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => <span key={i}>✕</span>)}
      </div>

      {/* ── 01 · screens — the shipped work, composed big ── */}
      <section className="bt-sec paper" id="bt-screens">
        <div className="rule-v at-text-start"></div>
        <div className="bt-wrap">
          <span className="bt-chip">the screens · 01</span><span className="bt-count">5 captures</span>
          <h2 className="bt-h2">Blueprint, not brochure<span className="x">.</span></h2>
          <p className="bt-lede">
            Ink on off-white, coal bands, the mint rationed to the ✕, the numerals, and the
            actions, with hairline rules crossing the layout like a technical drawing.
            Desktop and mobile, Portuguese and English, live at bmtax.com.br.
          </p>
        </div>

        {/* nested inside bt-wrap on purpose: the negative margins below cancel exactly this
            wrapper's own gutter + rail padding to reach the true viewport edge, then re-add
            the rail clearance for the image alone (same trick as the other case studies'
            .xx-full inside .xx-wrap). without this wrapper the band drifts left of the
            viewport instead of clearing the rail. */}
        <div className="bt-wrap">
        <figure className="bt-full" style={{ background: "#d6d6d2" }}>
          <img src="images-bmtax/BMTAx1.jpg" alt="Contact flow, desktop and mobile: the 'entre em contato' form, then the 'obrigado pela mensagem' success state" loading="lazy" width="2600" height="1172" />
        </figure>

        <figure className="bt-full" style={{ background: "#353535" }}>
          <img src="images-bmtax/BMTAx2.jpg" alt="Two desktop pages: the blog listing 'inteligência tributária para decisões estratégicas', and the nosso time page with a founder's profile card" loading="lazy" width="2600" height="1172" />
        </figure>

        <figure className="bt-full" style={{ background: "#d6d6d2" }}>
          <img src="images-bmtax/BMTAX5.jpg" alt="Three mobile screens: the homepage hero, the 'a bmtax' intro copy, and the nossos números stat list" loading="lazy" width="2700" height="1161" />
        </figure>

        <figure className="bt-full" style={{ background: "#d6d6d2" }}>
          <img src="images-bmtax/BMTAx3.jpg" alt="Sobre page, desktop and mobile: the somos bento grid (inovação, precisão, estratégia, tecnologia, the bmtax wordmark) followed by the intro paragraph and a saiba mais button" loading="lazy" width="2600" height="1167" />
        </figure>

        <figure className="bt-full" style={{ background: "#353535" }}>
          <img src="images-bmtax/BMTAX4.jpg" alt="BM TAX homepage, two panes: the film hero reading 'simplificando o universo tributário' with the products list below, then the nossos números stat band and the em alta blog carousel" loading="lazy" width="2700" height="1212" />
        </figure>
        </div>
      </section>

      {/* ── 02 · process ── */}
      <section className="bt-sec white" id="bt-process">
        <div className="rule-v at-text-end"></div>
        <div className="bt-wrap">
          <span className="bt-chip">the process · 02</span>
          <h2 className="bt-h2">Precision as a design language<span className="x">.</span></h2>
          <p className="bt-lede">
            The brand already existed: the wordmark with its mint ✕. The work was turning it
            into a website, twenty-four screens deep, with every interactive moment designed
            as a state and the motion specified for handoff.
          </p>
          <div className="bt-process">
            <div className="bt-phase">
              <div className="k">language · 01</div>
              <h4>Brand to interface</h4>
              <p>Three colors with strict jobs, one typeface at many volumes, and the layout's structure left deliberately visible: hairline rules join the sections like a blueprint.</p>
            </div>
            <div className="bt-phase">
              <div className="k">structure · 02</div>
              <h4>24 screens</h4>
              <p>Home, sobre, expertise, blog, listagem, post, time, pessoa, políticas, 404: fourteen desktop and ten mobile layouts, PT and EN, held by three text styles per platform.</p>
            </div>
            <div className="bt-phase">
              <div className="k">states · 03</div>
              <h4>States, not stills</h4>
              <p>The products band is a six-state component so its hover runs as a real prototype; the contact page ships as three designed states: form, success, and the error nobody designs.</p>
            </div>
            <div className="bt-phase">
              <div className="k">motion · 04</div>
              <h4>Specified, then shipped</h4>
              <p>The full-bleed film opens the site; after that, everything that moves resolves to an exact final state (counters, reveals, arrows), specified per element and delivered in 2024.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · decisions + 04 · ownership (dark band) ── */}
      <section className="bt-sec dark" id="bt-decisions">
        <div className="rule-v at-text-start"></div>
        {/* the matching rule on the far side: it closes the band and separates the
            footer block from the page edge instead of leaving it open */}
        <div className="rule-v at-text-end"></div>
        <div className="bt-wrap">
          <span className="bt-chip">the decisions · 03</span>
          <h2 className="bt-h2">Measured, verifiable, done<span className="x">.</span></h2>
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

          <span className="bt-chip">ownership · 04</span>
          <h2 className="bt-h2" style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}>What I owned<span className="x">.</span></h2>
          <div className="bt-own">
            {/* the two full-bleed rules, one per row of the grid */}
            <div className="bt-own-rule" style={{ top: 0 }} aria-hidden="true"></div>
            <div className="bt-own-rule" style={{ top: "calc(50% + 13px)" }} aria-hidden="true"></div>
            {BMT_OWN.map((f, i) => (
              <div className="bt-own-item" key={i}>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
          <p className="bt-collab" style={{ marginBottom: 72 }}>
            Built at Estúdio Brizza for BMTax. The brand identity already existed; the website (its structure,
            every layout, and the motion language) was mine end to end, with the
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
