/* ════════════════════════════════════════════════════════════
   espm.jsx — immersive case page for the ESPM student app.
   The page wears the app's skin: every value below is sampled
   from the shipped captures (espm-1/3/4/5.png + the composed
   Frame 1000005225.png) — annotated per token. The hero carries
   the composed key art; the screens section shows the original
   captures, frameless in their own device frames (Ana's call).
   Full-bleed bands via body.espm-mode.
   Registers LAYOUTS["espm-case"] → hash route #/espm (app.jsx).
   ════════════════════════════════════════════════════════════ */

const { useEffect: useEffectEspm } = React;

/* ── ESPM identity — sampled, not invented ──
   floor       #1f1f1f  (page background, sampled espm-4 / espm-1)
   glass       #262626  (raised card surface, sampled espm-1 student-id card)
   chrome      #303031  (bottom nav bar, sampled espm-4)
   espm red    #d31e43  (Enroll CTA + active Home nav, sampled espm-4)
   tick red    #cf1f52  (calendar class tick, sampled espm-3)
   magenta     #e401ae  (header blob, sampled espm-4; #de01a2 on espm-5)
   violet      #b817cd  (orb, sampled espm-1; #9d20cf magenta circle)
   blue        #5236a5  (orb cool edge, sampled espm-1)
   pill grad   #d0207d → #c320c6 (calendar selected-day pill, sampled espm-3)
   cyan        #00c2ff  (schedule tick, sampled espm-3/espm-5)
   paper       #ffffff  (headings, sampled espm-4)
   radius      generous everywhere — 24–28px cards, full pills, ~8px CTA;
               the app has no squared corner, so neither does this page.
   type        heavy condensed grotesque for headings + an experimental
               display face for section titles ("New on school:", "March")
               — neither is web-licensed here, so stacks declare the brand
               face first and fall back:
               "Helvetica Neue Condensed" → Archivo 900 · "Neue Machina" →
               Space Mono for the quirky kickers · body → DM Sans. */

const __ESPM_STYLE = `
  /* free the page from the constrained canvas — full-bleed bands */
  body.espm-mode .canvas { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  /* a transformed ancestor would hijack the rail's position:fixed */
  body.espm-mode .page-enter { animation: none !important; }
  body.espm-mode .atmosphere, body.espm-mode .grain { display: none; }
  body.espm-mode { background: #1f1f1f; /* floor — sampled espm-4 background */ }

  body.espm-mode .topbar > * { position: relative; z-index: 1; }
  body.espm-mode .topbar .logo { color: #1f1f1f; transition: color .3s ease; }
  body.espm-mode .nav-link { color: rgba(31,31,31,0.6); transition: color .3s ease; }
  body.espm-mode .nav-link:hover, body.espm-mode .nav-link.active { color: #1f1f1f; }
  body.espm-mode.espm-head-invert .topbar .logo { color: #ffffff; }
  body.espm-mode.espm-head-invert .nav-link { color: rgba(255,255,255,0.72); }
  body.espm-mode.espm-head-invert .nav-link:hover,
  body.espm-mode.espm-head-invert .nav-link.active { color: #ffffff; }

  .espmx {
    --floor: #1f1f1f;     /* sampled espm-4 · page background */
    --glass: #262626;     /* sampled espm-1 · student-id glass card */
    --chrome: #303031;    /* sampled espm-4 · bottom nav bar */
    --red: #d31e43;       /* sampled espm-4 · Enroll CTA + Home nav */
    --tick: #cf1f52;      /* sampled espm-3 · calendar class tick */
    --magenta: #e401ae;   /* sampled espm-4 · header blob */
    --violet: #b817cd;    /* sampled espm-1 · orb */
    --blue: #5236a5;      /* sampled espm-1 · orb cool edge */
    --pill-a: #d0207d;    /* sampled espm-3 · day pill top */
    --pill-b: #c320c6;    /* sampled espm-3 · day pill bottom */
    --cyan: #00c2ff;      /* sampled espm-3 · schedule tick */
    --paper: #ffffff;     /* sampled espm-4 · headings */
    /* brand faces aren't web-licensed — declared first, falling back (see header note) */
    --espm-display: "Helvetica Neue Condensed", "Archivo", system-ui, sans-serif;
    --espm-quirk: "Neue Machina", "Space Mono", ui-monospace, monospace;
    --espm-body: "DM Sans", system-ui, sans-serif;
    font-family: var(--espm-body); color: var(--paper);
  }

  /* focus is brand-colored and visible everywhere; magenta ring on dark bands */
  .espmx :focus-visible { outline: 2px solid var(--magenta); outline-offset: 2px; }
  .espmx .light :focus-visible { outline-color: var(--red); }

  .es-wrap { max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 72px) 0 max(212px, clamp(24px, 15vw, 240px)); }
  @media (max-width: 1100px){ .es-wrap { padding-left: clamp(24px, 5vw, 72px); } }

  /* ── left rail ── */
  .es-rail { position: fixed; left: 36px; top: 50%; transform: translateY(-50%);
    z-index: 30; display: flex; flex-direction: column; gap: 20px;
    mix-blend-mode: difference; }
  @media (max-width: 1100px){ .es-rail { display: none; } }
  .es-rail button { display: flex; align-items: center; gap: 12px; background: none;
    border: none; padding: 0; cursor: pointer; font-family: var(--mono);
    font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #fff; opacity: .8; transition: opacity .2s ease; }
  .es-rail button:hover { opacity: 1; }
  .es-rail button::before { content: ""; width: 22px; height: 1.5px; background: #fff;
    border-radius: 2px; transition: width .25s var(--ease-out); }
  .es-rail button:hover::before { width: 40px; }

  /* ── section scaffolding — pill chips, the app rounds everything ── */
  .es-sec { padding: 96px 0 110px; }
  .es-sec.floor { background: var(--floor); color: var(--paper); }
  .es-sec.glass { background: var(--glass); color: var(--paper); }
  .es-sec.light { background: var(--paper); color: var(--floor); }
  .es-chip { display: inline-block; font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase; color: inherit;
    border: 1px solid currentColor; border-radius: 999px; padding: 8px 16px;
    margin-bottom: 30px; opacity: .85; }
  .es-count { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
    background: var(--red); color: var(--paper); padding: 8px 16px; margin-left: 12px;
    border-radius: 999px; display: inline-block; vertical-align: baseline; margin-bottom: 30px; }
  .es-h2 { font-family: var(--espm-display); font-weight: 900; letter-spacing: -0.02em;
    text-transform: uppercase; font-size: clamp(40px, 7vw, 100px); line-height: 0.94;
    margin: 0 0 28px; max-width: 15ch; }
  .es-lede { font-size: clamp(16px, 1.6vw, 20px); line-height: 1.6; max-width: 56ch;
    margin: 0 0 54px; opacity: .85; }

  /* ── hero — the app's own dark canvas + neon blobs + ghost display type ── */
  .es-hero { position: relative; background: var(--floor); color: var(--paper);
    overflow: hidden; padding: 150px 0 96px; }
  /* static blobs echo the app's gradient orbs (sampled espm-1/espm-4) — no animation */
  .es-blob { position: absolute; border-radius: 50%; filter: blur(70px);
    pointer-events: none; user-select: none; }
  .es-blob.b1 { width: 480px; height: 480px; right: -140px; top: -120px; opacity: .5;
    background: radial-gradient(circle at 35% 35%, var(--magenta), var(--violet) 60%, transparent 75%); }
  .es-blob.b2 { width: 420px; height: 420px; left: -160px; bottom: -180px; opacity: .45;
    background: radial-gradient(circle at 60% 40%, var(--tick), var(--blue) 65%, transparent 80%); }
  .es-hero .es-wrap { position: relative; }
  .es-back { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--paper); background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.4); border-radius: 999px; padding: 9px 18px;
    cursor: pointer; margin-bottom: 44px; transition: background .2s ease; }
  .es-back:hover { background: rgba(255,255,255,0.2); }
  .es-eyebrow { font-family: var(--espm-quirk); font-size: 11.5px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--magenta); margin-bottom: 30px; }
  /* hero grid — text left, the composed key art right */
  .es-hero-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: clamp(28px, 4vw, 72px); align-items: center; }
  @media (max-width: 1024px){ .es-hero-grid { grid-template-columns: 1fr; } }
  /* keep the key art proportionate to the text column: cap by viewport height
     so both phones always sit fully inside the hero */
  .es-hero-shot { margin: 0; line-height: 0; display: flex; justify-content: center; }
  /* no cap: the phones fill their grid column */
  .es-hero-shot img { width: 100%; max-width: none; height: auto;
    max-height: min(68vh, 640px); object-fit: contain; display: block; }
  @media (max-width: 1024px){ .es-hero-shot { max-width: 560px; justify-self: center; width: 100%; } }
  .es-h1 { font-family: var(--espm-display); font-weight: 900; letter-spacing: -0.02em;
    text-transform: uppercase; font-size: clamp(44px, 6.2vw, 104px); line-height: 0.9;
    margin: 0 0 42px; max-width: 12ch; }
  .es-h1 .neon { background: linear-gradient(100deg, var(--magenta), var(--violet));
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .es-hero-sub { font-size: clamp(17px, 1.8vw, 21px); line-height: 1.55;
    color: rgba(255,255,255,0.85); max-width: 54ch; margin: 0 0 44px; }
  /* hero CTA — the app's own signature component: the red Enroll bar (sampled espm-4) */
  .es-cta { display: inline-block; width: min(420px, 100%); height: 56px;
    background: var(--red); color: var(--paper); border: none; border-radius: 8px;
    cursor: pointer; font-family: var(--espm-display); font-weight: 900; font-size: 18px;
    letter-spacing: 0.06em; transition: transform .2s var(--ease-out); }
  .es-cta:hover { transform: translateY(-2px); }
  .es-cta:active { transform: scale(0.99); }
  .es-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
  .es-hero-chip { font-family: var(--mono); font-size: 10.5px; padding: 7px 16px;
    border: 1px solid rgba(255,255,255,0.35); border-radius: 999px;
    color: rgba(255,255,255,0.85); }
  .es-hero-chip b { color: var(--paper); font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; font-size: 9px; margin-right: 6px; }


  /* ── screens — the UI showcase: everything visible, composed big ── */
  .es-wide { max-width: 1760px; margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 48px); display: flex; flex-direction: column;
    gap: clamp(40px, 6vw, 88px); }
  /* the section rail is position:fixed at the viewport's left edge and only
     exists above 1100px, so wide media has to start clear of it instead of
     running underneath the labels */
  @media (min-width: 1101px) { .es-wide { padding-left: 212px; } }
  /* captures ship inside their own device frames with transparency — frameless */
  .es-shot { border: none; background: transparent; line-height: 0; }
  .es-shot img { width: 100%; height: auto; display: block; }
  .es-cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; opacity: .6; line-height: 1.6; padding: 14px 2px 0;
    text-align: center; }
  .es-duo { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 4vw, 56px);
    max-width: 980px; margin: 0 auto; width: 100%; }
  @media (max-width: 640px){ .es-duo { grid-template-columns: 1fr; } }

  /* ── screens, take two — full-bleed bands, same configuration as the manyfest
     case (.mnf-full): each capture runs the full viewport, the band's own left
     padding clears the fixed rail, and the band's background is sampled from
     that capture's own canvas so there's no seam between page and photo. ── */
  .es-full { margin-top: 12px; margin-bottom: 0;
    padding: 0;
    padding-left: max(212px, clamp(24px, 15vw, 240px));
    margin-left: calc(-1 * (max((100vw - 1280px) / 2, 0px) + max(212px, clamp(24px, 15vw, 240px))));
    margin-right: calc(-1 * (max((100vw - 1280px) / 2, 0px) + clamp(24px, 5vw, 72px))); }
  .es-full + .es-full { margin-top: 0; }
  @media (max-width: 1100px){ .es-full { padding-left: 0;
    margin-left: calc(-1 * clamp(24px, 5vw, 72px));
    margin-right: calc(-1 * clamp(24px, 5vw, 72px)); } }
  /* sized down to fit a desktop viewport: these are 3D device-mockup renders
     (roughly 4:3, or a wide sitemap), not fixed-aspect screenshots, so full
     width alone made the phone renders taller than the viewport. capping
     height and letting width follow keeps them centered inside the band
     instead of forcing a giant scroll. */
  .es-full img { display: block; width: auto; height: auto;
    max-width: 100%; max-height: min(640px, 68vh); margin: 0 auto; border: 0; }

  /* ── the remap sub-block, sitting inside the process section: a short
     sub-head + argument ahead of the two sitemaps, so "architecture, then
     skin" isn't just a caption but an actual explained decision. ── */
  .es-sub-head { display: flex; align-items: center; gap: 12px; margin: 64px 0 18px; }
  .es-sub-head .es-chip.sm { font-size: 10px; padding: 6px 12px; margin-bottom: 0; }
  .es-h3 { font-family: var(--espm-display); font-weight: 900; letter-spacing: -0.015em;
    text-transform: uppercase; font-size: clamp(24px, 3vw, 34px); line-height: 1.05;
    margin: 0 0 16px; max-width: 20ch; }
  .es-remap-p { font-size: clamp(15px, 1.4vw, 17px); line-height: 1.65; opacity: .85;
    margin: 0 0 8px; max-width: 68ch; }

  /* ── native sitemaps — real tree DIAGRAMS, drawn top-down exactly like the
     source flows: rounded boxes in rows, joined by drop lines, a horizontal
     distribution bar across each set of siblings, and arrowheads into every
     child. all of it is nested <ul>s with the connectors painted by
     ::before / ::after — no image, no SVG, no fixed-size canvas, so it
     reflows and never gets cut off by the page. two connector idioms, both
     taken from the source flows: .es-vt-row is the standard top-down fan
     (used for the whole legacy map), and .es-vt-stack is the grouped column
     the flows use under a section header, where a spine runs down the left
     and elbows into each item. box width, gaps and type size are clamp()ed
     to the viewport so the diagram shrinks instead of overflowing; only on
     phones does it pan inside its own scroller. no card: it sits on the
     section's own light background. ── */
  /* one rhythm for both sitemap blocks: a big, equal gap ABOVE each chip
     (whether what precedes it is the argument paragraph or the previous
     diagram's note) and a small one BELOW it, so the chip belongs to the
     diagram it labels instead of floating between the two. the chip's own
     30px base margin-bottom has to be zeroed here or that "small" gap below
     ends up bigger than the gap above — which was the uneven part. */
  .es-sm-head { margin: 72px 0 18px; line-height: 1; }
  .es-sm-head .es-chip.sm { font-size: 10px; padding: 6px 12px; margin-bottom: 0; }
  .es-sm-note { font-family: var(--espm-quirk); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; color: rgba(0,0,0,0.45); margin: 18px 0 0; }

  .es-vt-fig { margin: 0;
    --vt-w: clamp(86px, 8.6vw, 112px);   /* every box the same width, so rows read as levels */
    --vt-h: 48px;                        /* and the same height, so siblings sit on one line:
                                            tall enough for the longest label to wrap to two
                                            lines at the narrowest box, because one box growing
                                            a line taller would knock its whole row out of line */
    --v1: 22px;                          /* parent box down to the sibling bar */
    --v2: 24px;                          /* sibling bar down into each child */
    --hg: 9px;                           /* half the gap between siblings */
    --arm: clamp(16px, 1.7vw, 24px);     /* elbow arm inside a stacked group: long
                                            enough that the 5px arrowhead reads as
                                            an arrow on a line, not as a blob */
    --ln: rgba(0,0,0,0.34);
    --half: calc((var(--arm) + var(--vt-w)) / 2); }
  .es-vt-scroll { overflow-x: auto; overflow-y: hidden; padding: 2px 2px 10px; }
  /* reset the list defaults on the group CLASSES, never as ".es-vt ul" — a
     descendant selector like that outscores ".es-vt-row" (0,1,1 beats 0,1,0),
     so its "margin: 0" silently killed the margin-top that opens the gap
     between a parent box and its children, and every drop line (drawn from
     var(--v1) above its group) ended up inside the parent box instead. */
  .es-vt, .es-vt-row, .es-vt-stack { list-style: none; margin: 0; padding: 0; }
  /* left-aligned, not centred: the diagram then starts on the same line as
     the section's chip and paragraphs instead of floating in the column */
  .es-vt { display: flex; justify-content: flex-start; width: max-content; min-width: 100%; }
  .es-vt-li { position: relative; display: flex; flex-direction: column; align-items: center; }

  /* ── top-down fan: drop from the parent, bar across the siblings, drop into each ── */
  .es-vt-row { position: relative; display: flex; justify-content: center; margin-top: var(--v1); }
  .es-vt-row::before { content: ""; position: absolute; top: calc(-1 * var(--v1)); left: 50%;
    height: var(--v1); border-left: 1.5px solid var(--ln); }
  .es-vt-row > .es-vt-li { padding: var(--v2) var(--hg) 0; }
  .es-vt-row > .es-vt-li::before { content: ""; position: absolute; top: 0; left: 50%;
    height: var(--v2); border-left: 1.5px solid var(--ln); }
  /* the bar is a top border tiled across every sibling, then trimmed to half
     on the first and last so it starts and stops at the outermost centres.
     an only child gets left:50% and right:50% at once, i.e. nothing. */
  .es-vt-row > .es-vt-li::after { content: ""; position: absolute; top: 0; left: 0; right: 0;
    border-top: 1.5px solid var(--ln); }
  .es-vt-row > .es-vt-li:first-child::after { left: 50%; }
  .es-vt-row > .es-vt-li:last-child::after { right: 50%; }

  /* ── grouped column: one spine down the left, an elbow into each item ── */
  .es-vt-stack { position: relative; display: flex; flex-direction: column; margin-top: var(--v1); }
  .es-vt-stack::before { content: ""; position: absolute; top: calc(-1 * var(--v1));
    left: var(--half); height: var(--v1); border-left: 1.5px solid var(--ln); }
  .es-vt-stack::after { content: ""; position: absolute; top: 0; left: 0;
    width: var(--half); border-top: 1.5px solid var(--ln); }
  .es-vt-stack > .es-vt-li { align-items: flex-start; padding: 5px 0 5px var(--arm); }
  .es-vt-stack > .es-vt-li::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0;
    border-left: 1.5px solid var(--ln); }
  .es-vt-stack > .es-vt-li:last-child::before { bottom: 50%; }
  .es-vt-stack > .es-vt-li::after { content: ""; position: absolute; left: 0; top: 50%;
    width: var(--arm); border-top: 1.5px solid var(--ln); }

  /* arrowheads, same as the source flows: pointing down out of a fan,
     pointing right out of a stacked group's elbow. an absolutely positioned
     child is placed against its container's PADDING box, so top/left 0 sits
     inside the border — the tip has to be pushed back out by the box's own
     border width (--bw, which differs on the level-1 boxes) or the arrow
     lands on top of the border instead of meeting it. */
  .es-vt-row > .es-vt-li > .es-vt-node::before { content: ""; position: absolute;
    left: 50%; top: calc(-1 * var(--bw)); transform: translate(-50%, -100%);
    border-left: 4px solid transparent; border-right: 4px solid transparent;
    border-top: 5px solid var(--ln); }
  .es-vt-stack > .es-vt-li > .es-vt-node::before { content: ""; position: absolute;
    left: calc(-1 * var(--bw)); top: 50%; transform: translate(-100%, -50%);
    border-top: 4px solid transparent; border-bottom: 4px solid transparent;
    border-left: 5px solid var(--ln); }

  .es-vt-node { --bw: 1.5px;
    position: relative; box-sizing: border-box; flex: none;
    width: var(--vt-w); min-height: var(--vt-h);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 2px; text-align: center;
    padding: 6px 8px; border-radius: 8px;
    border: 1.5px solid rgba(0,0,0,0.22); background: #fff;
    font-family: var(--espm-body); font-size: clamp(9.5px, 0.84vw, 11.5px);
    line-height: 1.25; color: rgba(0,0,0,0.78); overflow-wrap: break-word; }
  /* tablet and down: the boxes are already at their floor, so buy the width
     back from the gaps instead, which keeps the widest map inside the column
     rather than making it pan */
  @media (max-width: 860px) { .es-vt-fig { --hg: 5px; --arm: 10px; } }
  .es-vt-tag { font-family: var(--espm-quirk); font-style: normal; font-size: 8px;
    line-height: 1.2; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--violet); }
  .es-vt-node.is-root { background: var(--red); border-color: var(--red); color: var(--paper);
    font-family: var(--espm-display); font-weight: 900; text-transform: uppercase;
    letter-spacing: -0.005em; }
  .es-vt-node.is-top { --bw: 2px; border-color: var(--magenta); border-width: 2px;
    color: var(--floor); font-weight: 700; background: rgba(228,1,174,0.06); }
  .es-vt-node.is-dup { border-style: dashed; border-color: rgba(0,0,0,0.3);
    background: transparent; color: rgba(0,0,0,0.45); font-style: italic; }

  /* ── process — research first, four beats ── */
  .es-process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  @media (max-width: 960px){ .es-process { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .es-process { grid-template-columns: 1fr; } }
  .es-phase { border-top: 2.5px solid var(--red); padding-top: 18px; }
  .es-phase .k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.2em;
    text-transform: uppercase; opacity: .55; margin-bottom: 10px; }
  .es-phase h4 { font-family: var(--espm-display); font-weight: 900; text-transform: uppercase;
    font-size: 19px; letter-spacing: -0.01em; margin: 0 0 10px; }
  .es-phase p { font-size: 14px; line-height: 1.62; margin: 0; opacity: .78; }

  /* ── decisions (dark band) ── */
  .es-decisions { display: flex; flex-direction: column; margin-bottom: 72px; }
  .es-decision { display: grid; grid-template-columns: 90px 1fr; gap: 0 32px;
    padding: 34px 0; border-top: 1.5px solid rgba(255,255,255,0.25); }
  .es-decision:last-child { border-bottom: 1.5px solid rgba(255,255,255,0.25); }
  .es-dec-num { font-family: var(--espm-display); font-weight: 900; letter-spacing: -0.04em;
    font-size: clamp(40px, 5vw, 68px); line-height: 1; color: rgba(255,255,255,0.16);
    user-select: none; padding-top: 4px; }
  .es-dec-title { font-family: var(--espm-display); font-weight: 900; text-transform: uppercase;
    font-size: clamp(17px, 2vw, 22px); margin: 0 0 12px; line-height: 1.2; letter-spacing: -0.005em; }
  .es-dec-p { font-size: 15px; line-height: 1.68; margin: 0; opacity: .8; }
  @media (max-width: 560px){ .es-decision { grid-template-columns: 48px 1fr; gap: 0 20px; } }
  .es-own { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 24px; margin-bottom: 28px; }
  @media (max-width: 860px){ .es-own { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .es-own { grid-template-columns: 1fr; } }
  .es-own-item { border-top: 2.5px solid var(--magenta); padding-top: 16px; }
  .es-own-item h4 { font-family: var(--espm-display); font-weight: 900; text-transform: uppercase;
    font-size: 15px; margin: 0 0 8px; }
  .es-own-item p { font-size: 14px; line-height: 1.6; margin: 0; opacity: .75; }
  .es-collab { font-family: var(--mono); font-size: 11.5px; opacity: .6;
    margin: 0; line-height: 1.7; max-width: none; }

  /* portfolio footer on the dark band */
  .es-sec.floor .pf-label { color: rgba(255,255,255,0.55); }
  .es-sec.floor .pf-next-link { color: var(--paper); }
  .es-sec.floor .pf-next-link:hover { color: var(--magenta); }
  .es-sec.floor .pf-pill { background: transparent; color: var(--paper);
    border-color: rgba(255,255,255,0.35); }
  .es-sec.floor .pf-pill:hover { color: var(--magenta); border-color: var(--magenta); }

  /* motion asks permission — what's left on this page is hover/transition only */
  @media (prefers-reduced-motion: reduce) {
    .espmx * { transition-duration: 0.01ms !important; }
  }
`;

const ESPM_DECISIONS = [
  {
    title: "Dark canvas, neon identity",
    body: "ESPM's new brand shouts in gradient magenta, violet, and blue. The app lets it: everything lives on a near-black canvas so the blobs and orbs carry the identity while content cards stay quiet and readable. The rebrand does the shouting; the interface does the studying."
  },
  {
    title: "One red, one job",
    body: "ESPM red exists in the interface for exactly two states: the primary action (Enroll) and where you are (Home). Every other color is expression: gradients, ticks, blobs. Because red never decorates, a student can find the one thing that acts on any screen without reading it."
  },
  {
    title: "Grades, schedule, money: one tap from home",
    body: "The 36-student survey came back unambiguous: students open the app for grades, class times, and financial info. So the home screen leads with a quick-action rail (ID, Calendar, Finance, Requests, Credits) instead of the news feed the legacy portal led with. What students come to do first comes first."
  },
  {
    title: "Architecture validated before hi-fi",
    body: "The restructured information architecture was tested with students at low fidelity before any visual design existed. By the time the neon skin went on, the skeleton had already survived contact with its users. The gradients decorate a structure that was proven boring-first."
  },
  {
    title: "Color-coded time",
    body: "In the calendar and grades flows, a thin colored tick classifies every entry: cyan for classes, amber for tests, pink for deadlines. A week becomes scannable before it's readable. It's the identity system doing functional work: the same palette, demoted to wayfinding."
  },
];

const ESPM_OWN = [
  { h: "Student survey", p: "Designed and ran the 36-student survey that decided the home screen's hierarchy: grades, schedule, and finance first." },
  { h: "Information architecture", p: "The restructured app map, from legacy portal to task-first structure, validated with students before hi-fi." },
  { h: "Home + quick actions", p: "The dashboard with the quick-action rail and 'New on school' carousel: the survey's findings, shipped as a screen." },
  { h: "Calendar & grades flows", p: "Color-coded schedule, per-course exams and next classes: the two screens students said they open daily." },
  { h: "Visual language", p: "The dark canvas + gradient blob system that translates the rebrand into UI, with red reserved for action." },
  { h: "Competitive audit", p: "The four-school benchmark (FAAP, FGV, Insper, Mackenzie), read for how each handled the same student jobs." },
];

/* ── the two sitemaps, native — nested <ul>/<li> with the connectors drawn
   in CSS, no image and no fixed-size canvas, so they reflow with the
   viewport instead of being scrolled like a picture.

   BOTH are transcribed node-for-node and edge-for-edge from Ana's original
   draw.io flows. two things in the legacy flow are easy to misread and are
   deliberately transcribed the way the source draws them: the boxes cascade
   down the page in a staircase, but a staircase there means SIBLINGS off one
   shared spine, not a chain — the small filled dot on a box's bottom edge is
   what marks a real parent, and only Tela Inicial, Login, Financeiro,
   Calendário, Mais and Institucional have one. So Notas e Faltas,
   Carteirinha and Financeiro are three siblings under Login (not a chain),
   and all nine institutional pages hang off Institucional alone — which is
   the actual finding the case argues: one parent used as a dumping ground.
   Labels are kept verbatim from the source flows, typos included. ── */
const ESPM_MAP_OLD = {
  label: "Tela Inicial",
  children: [
    { label: "Login", children: [
      { label: "Notas e Faltas" },
      { label: "Carteirinha" },
      { label: "Financeiro", children: [{ label: "Extrato" }] },
      { label: "Calendário", children: [
        { label: "Mais", children: [
          { label: "Biblioteca" },
          { label: "Ajuda" },
          { label: "Institucional", dup: true, tag: "loops back ↑" },
        ]},
      ]},
    ]},
    { label: "Esqueci minha senha", children: [
      { label: "Página na WEB - portal ESPM" },
    ]},
    { label: "Institucional", children: [
      { label: "Educação Continuada" },
      { label: "A ESPM" },
      { label: "Mestrado e Doutorado" },
      { label: "Vestibular" },
      { label: "Educação à Distância" },
      { label: "Graduação" },
      { label: "Para empresas" },
      { label: "Pós graduação" },
      { label: "Fale conosco" },
    ]},
  ],
};

/* the redesign, same notation and same root so before → after is
   like-for-like: one login, four task-first sections, nothing below them. */
const ESPM_MAP_NEW = {
  label: "Login",
  children: [
    { label: "Serviços (?)", children: [
      { label: "Financeiro" },
      { label: "Contato" },
      { label: "Requerimeto" },
      { label: "Whatsapp" },
      { label: "Bibliotecas e Recursos" },
    ]},
    { label: "outros", children: [
      { label: "Canvas" },
      { label: "Vagas" },
      { label: "Perfil" },
      { label: "Ajuda" },
      { label: "Horas ACOM e estágio" },
    ]},
    { label: "Academico", children: [
      { label: "Disciplinas (Notas e Faltas)" },
      { label: "ACOM e estágio" },
    ]},
    { label: "Tela Home", children: [
      { label: "Acessar carterinha" },
      { label: "Financeiro" },
      { label: "Acom e Estágio" },
      { label: "Requerimento" },
      { label: "Buscar" },
      { label: "Calendário" },
    ]},
  ],
};

/* which of the two connector idioms a group gets. the rule is about what
   the group CONTAINS, not how deep it sits:

   · a group that still has structure under it (any child with children of
     its own) fans out in a row — .es-vt-row: drop, bar across the siblings,
     drop into each, arrowhead down. this is what makes depth read as
     LEVELS, in horizontal bands across the page. using the column idiom
     here was the bug in the previous pass: each nested group stepped a
     little further right, so five levels read as indentation, like an
     outline, instead of as five rows.

   · a group that is nothing but leaves (a section's pages, with two or
     more of them) becomes a grouped column — .es-vt-stack: one spine down
     the left, an elbow and arrowhead right into each item. it costs one
     box of width no matter how many items it holds, which is what keeps
     Institucional's nine pages from being nine columns wide, and it's how
     the source flows draw a section's pages.

   a single child (Financeiro → Extrato) stays a row, where the bar
   collapses to nothing and you get a clean straight drop. */
function espmGroupKind(node) {
  const kids = node.children || [];
  const allLeaves = kids.every((k) => !k.children || k.children.length === 0);
  return allLeaves && kids.length >= 2 ? "es-vt-stack" : "es-vt-row";
}

function EspmTreeNode({ node, depth }) {
  const kids = node.children && node.children.length > 0;
  return (
    <li className="es-vt-li">
      <div className={"es-vt-node"
        + (depth === 0 ? " is-root" : "")
        + (depth === 1 ? " is-top" : "")
        + (node.dup ? " is-dup" : "")}>
        <span>{node.label}</span>
        {node.tag && <span className="es-vt-tag">{node.tag}</span>}
      </div>
      {kids && (
        <ul className={espmGroupKind(node)}>
          {node.children.map((c, i) => <EspmTreeNode key={i} node={c} depth={depth + 1} />)}
        </ul>
      )}
    </li>
  );
}

function EspmTree({ root, label, note }) {
  return (
    <figure className="es-vt-fig">
      <div className="es-vt-scroll" role="img" aria-label={label}>
        <ul className="es-vt"><EspmTreeNode node={root} depth={0} /></ul>
      </div>
      {note && <figcaption className="es-sm-note">{note}</figcaption>}
    </figure>
  );
}

function EspmScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function EspmCase({ spec, onAsk }) {
  const p = (typeof PROJECTS !== "undefined" && PROJECTS.espm) || {};

  useEffectEspm(() => {
    document.body.classList.add("espm-mode");
    /* header items invert while dark bands pass underneath */
    const onScroll = () => {
      const y = 46;
      let invert = false;
      for (const s of document.querySelectorAll(".es-hero, .es-sec")) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          invert = !s.classList.contains("light");
          break;
        }
      }
      document.body.classList.toggle("espm-head-invert", invert);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("espm-mode", "espm-head-invert");
    };
  }, []);

  return (
    <div className="espmx">
      <style>{__ESPM_STYLE}</style>

      {/* rail */}
      <nav className="es-rail" aria-label="sections">
        <button onClick={() => EspmScrollTo("es-top")}>overview</button>
        <button onClick={() => EspmScrollTo("es-process")}>process</button>
        <button onClick={() => EspmScrollTo("es-screens")}>screens</button>
        <button onClick={() => EspmScrollTo("es-decisions")}>decisions</button>
      </nav>

      {/* ── hero — the app's dark canvas, its orbs, and the rebrand's two words.
           no scrolling wordmark band: the blobs are static, nothing loops. ── */}
      <header className="es-hero" id="es-top">
        <div className="es-blob b1" aria-hidden="true"></div>
        <div className="es-blob b2" aria-hidden="true"></div>
        <div className="es-wrap">
          <button className="es-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="es-hero-grid">
            <div>
              <div className="es-eyebrow">espm student app · graduation project · 2021</div>
              <h1 className="es-h1">Inusitado <span className="neon">&amp; atitude.</span></h1>
              <p className="es-hero-sub">
                ESPM had just rebranded around two words, the unusual and attitude, and the
                student app we opened every day still looked like a legacy portal. Our graduation
                project rebuilt it from research up: a new brand identity deserved an app to match.
              </p>
              <button className="es-cta" onClick={() => EspmScrollTo("es-screens")}
                aria-label="see the app screens">
                Enroll →
              </button>
            </div>
            <figure className="es-hero-shot">
              <img src="Frame 1000005225.png" alt="ESPM student app, two composed iPhone screens: the gradient home dashboard and the color-coded calendar" />
            </figure>
          </div>
        </div>
      </header>

      {/* ── 01 · process ── */}
      <section className="es-sec light" id="es-process">
        <div className="es-wrap">
          <span className="es-chip">the process · 01</span>
          <h2 className="es-h2">Research before opinion.</h2>
          <p className="es-lede">
            Three layers of research came before any screen: what the brand promised, what the
            market did, what students actually needed. Then architecture, validated at low
            fidelity, and only then the neon.
          </p>
          <div className="es-process">
            <div className="es-phase">
              <div className="k">brand · 01</div>
              <h4>Positioning audit</h4>
              <p>ESPM's rebrand promised the unusual and attitude. We audited whether the student app lived up to it. It didn't: it was a portal wearing a logo.</p>
            </div>
            <div className="es-phase">
              <div className="k">market · 02</div>
              <h4>Four-school benchmark</h4>
              <p>FAAP, FGV, Insper, and Mackenzie, read for how each handled the same student-facing jobs: where they converged, and where nobody was trying.</p>
            </div>
            <div className="es-phase">
              <div className="k">students · 03</div>
              <h4>36-student survey</h4>
              <p>We asked the people who'd use it. Grades, schedules, and financial info came back as what students open the app to do first, so they lead the home screen.</p>
            </div>
            <div className="es-phase">
              <div className="k">structure · 04</div>
              <h4>Architecture, then skin</h4>
              <p>The restructured app map was validated with students at low fidelity before hi-fi. The gradients went onto a skeleton that had already been proven.</p>
            </div>
          </div>

          {/* the remapping, argued before it's shown: this is the "structure · 04" phase
              made concrete, not just a caption under two diagrams. */}
          <div className="es-sub-head"><span className="es-chip sm">remapping · before → after</span></div>
          <h3 className="es-h3">We remapped the app before we skinned it.</h3>
          <p className="es-remap-p">
            The legacy portal buried the same task under three different parents and dead-ended
            in institutional pages nobody opened twice. We flattened the whole map to two levels:
            one login, four task-first sections (Serviços, Outros, Acadêmico, Tela Home), each
            holding the actual jobs, finance, requests, calendar, credits, one tap from where a
            student lands instead of four taps deep.
          </p>
          <p className="es-remap-p">
            The new map was tested with students at low fidelity before a single gradient went
            on: fewer levels, no duplicate destinations, and every task reachable from home. The
            two sitemaps below are the same product, six months apart.
          </p>
        </div>

        {/* the two sitemaps, before → after: the argument above, made visible.
            transcribed node-for-node from Ana's original draw.io flows (see
            ESPM_MAP_OLD and ESPM_MAP_NEW above) and redrawn as top-down tree
            diagrams in real page content, so they reflow instead of being a
            screenshot or a fixed canvas. same notation on both, stacked one
            after the other, so the difference the reader sees is depth and
            nothing else. nested inside es-wrap for the same rail-clearing
            reason as the screens section. */}
        <div className="es-wrap">
          <div className="es-sm-head"><span className="es-chip sm">sitemap · before</span></div>
          <EspmTree root={ESPM_MAP_OLD} note="5 levels deep · 9 pages under one parent · 1 duplicate dead end"
            label="Tree diagram of the legacy portal: Tela Inicial branches into Login, Esqueci minha senha and Institucional. Login holds Notas e Faltas, Carteirinha, Financeiro (with Extrato) and Calendário, which goes through Mais to Biblioteca, Ajuda and a dead-end Institucional duplicate that loops back to the top level. Institucional alone holds nine institutional pages." />

          <div className="es-sm-head"><span className="es-chip sm">sitemap · after</span></div>
          <EspmTree root={ESPM_MAP_NEW} note="2 levels deep · every task one tap from home"
            label="Tree diagram of the redesigned app: Login into four task-first sections (Serviços, Outros, Academico, Tela Home), each holding its own pages and nothing deeper, validated with students before any hi-fi screen existed" />
        </div>
      </section>

      {/* ── 02 · screens — the UI is the point: everything visible, composed big.
           full-bleed bands, same configuration as the manyfest case study: each
           capture runs the full viewport, left padding clears the rail, and the
           band's background is sampled from that capture's own canvas. ── */}
      <section className="es-sec glass" id="es-screens">
        <div className="es-wrap">
          <span className="es-chip">the screens · 02</span><span className="es-count">4 captures</span>
          <h2 className="es-h2">A new identity deserved an app to match.</h2>
          <p className="es-lede">
            Every image below is the validated concept: the rebrand's gradients on a dark
            canvas, structure decided by 36 students before a single hi-fi screen. Frames as
            captured, nothing redrawn.
          </p>
        </div>

        {/* nested inside es-wrap on purpose: the negative margins below cancel exactly this
            wrapper's own gutter + rail padding to reach the true viewport edge, then re-add
            the rail clearance for the image alone (same trick as manyfest's .mnf-full inside
            .mnf-wrap). without this wrapper the band drifts left of the viewport instead of
            clearing the rail. */}
        <div className="es-wrap">
        <figure className="es-full" style={{ background: "#3e192c" }}>
          <img src="images-espm/espm1.jpg" alt="Marketing II course screen: grade and absence rings, a list of exams with scores, and the next classes list with room and time" loading="lazy" width="2000" height="1500" />
        </figure>

        <figure className="es-full" style={{ background: "#282828" }}>
          <img src="images-espm/espm2.jpg" alt="Calendar: March with a magenta-to-violet gradient selected-day pill, today's list showing color-coded ticks for a class, a test and a deadline" loading="lazy" width="1800" height="1350" />
        </figure>

        <figure className="es-full" style={{ background: "#2e1f3a" }}>
          <img src="images-espm/espm3.jpg" alt="Two phones: the home dashboard with gradient header blobs, quick-action rail (id, calendar, finance, requests, credits) and 'new on school' carousel, and the upcoming-events list with a red enroll band" loading="lazy" width="2200" height="1650" />
        </figure>

        <figure className="es-full" style={{ background: "#282828" }}>
          <img src="images-espm/espm4.jpg" alt="Four phones fanned out: per-course grades, the home dashboard with quick-action rail and 'new on school' carousel, the color-coded calendar, and the glassmorphic student id card" loading="lazy" width="2200" height="1650" />
        </figure>
        </div>
      </section>

      {/* ── 03 · decisions + ownership ── */}
      <section className="es-sec floor" id="es-decisions">
        <div className="es-wrap">
          <span className="es-chip">the decisions · 03</span>
          <h2 className="es-h2">Loud brand, quiet structure.</h2>
          <div className="es-decisions">
            {ESPM_DECISIONS.map((d, i) => (
              <div className="es-decision" key={i}>
                <div className="es-dec-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="es-dec-title">{d.title}</div>
                  <p className="es-dec-p">{d.body}</p>
                </div>
              </div>
            ))}
          </div>

          <span className="es-chip">ownership · 04</span>
          <h2 className="es-h2" style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}>What I owned.</h2>
          <div className="es-own">
            {ESPM_OWN.map((f, i) => (
              <div className="es-own-item" key={i}>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
          <p className="es-collab" style={{ marginBottom: 72 }}>
            Built with one colleague as an equal partnership: we split the research layers and
            reviewed every screen together; the brand-positioning audit was shared work. My first
            end-to-end project, and the pattern I still follow: research before opinion,
            architecture before interface.
          </p>

          <NextProjectFooter currentId="espm" onAsk={onAsk} />
        </div>
      </section>

    </div>
  );
}

if (typeof LAYOUTS !== "undefined") LAYOUTS["espm-case"] = EspmCase;

Object.assign(window, { EspmCase });
