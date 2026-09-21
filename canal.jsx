/* ════════════════════════════════════════════════════════════
   canal.jsx — immersive case page for CANAL Concept.
   The page wears Canal's skin: every value below is sampled from
   the shipped captures (canal-1…6.png) — annotated per token.
   Canal is the inverse of BAW: no noise — light tracked type,
   black/white/mist chrome, one pink dot, photography in charge.
   Full-bleed bands via body.canal-mode; the screens are the
   centerpiece, always visible, composed big.
   Registers LAYOUTS["canal-case"] → hash route #/canal (app.jsx).
   ════════════════════════════════════════════════════════════ */

const { useEffect: useEffectCnl, useState: useStateCnl } = React;

/* ── CANAL identity — sampled, not invented ──
   ink        #000000  (logotype + SHOP NOW band, sampled canal-1)
   paper      #ffffff  (header, mega menu, product panel, sampled canal-5)
   mist       #f7f7f7  (store page floor, sampled canal-3 / canal-6)
   studio     #c3cdd2  (photography backdrop, sampled canal-1)
   graphite   #3a3a3a  (the quiet "50% OFF" tag, sampled canal-3)
   dot pink   #fd005b  (cart badge dot — the store's only color, sampled canal-1)
   campaign   olive #747251 · terracotta #b57c68 (worn by the photography,
              sampled canal-1 / canal-3 — never by the chrome)
   radius     0 — squared everything: tags, bands, panels, buttons.
   type       thin tracked grotesque, uppercase, hierarchy by spacing
              not weight ("S H O P  N O W"). The storefront face reads
              as Helvetica/Neue Haas — not web-licensed here, so stacks
              declare it first and fall back: "Helvetica Neue" → Inter.
              Captions stay on the portfolio's --mono. */

const __CNL_STYLE = `
  /* free the page from the constrained canvas — full-bleed bands */
  body.canal-mode .canvas { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  /* a transformed ancestor would hijack the rail's position:fixed */
  body.canal-mode .page-enter { animation: none !important; }
  body.canal-mode .atmosphere, body.canal-mode .grain { display: none; }
  body.canal-mode { background: #f7f7f7; /* mist — store page floor, sampled canal-3 */ }

  body.canal-mode .topbar > * { position: relative; z-index: 1; }
  body.canal-mode .topbar .logo { color: #000000; transition: color .3s ease; }
  body.canal-mode .nav-link { color: rgba(0,0,0,0.55); transition: color .3s ease; }
  body.canal-mode .nav-link:hover, body.canal-mode .nav-link.active { color: #000000; }
  body.canal-mode.canal-head-invert .topbar .logo { color: #ffffff; }
  body.canal-mode.canal-head-invert .nav-link { color: rgba(255,255,255,0.66); }
  body.canal-mode.canal-head-invert .nav-link:hover,
  body.canal-mode.canal-head-invert .nav-link.active { color: #ffffff; }

  .cnlx {
    --ink: #000000;        /* sampled canal-1 · logotype + shop-now band */
    --paper: #ffffff;      /* sampled canal-5 · header + mega menu panel */
    --mist: #f7f7f7;       /* sampled canal-3 · store page floor */
    --studio: #c3cdd2;     /* sampled canal-1 · photography backdrop */
    --graphite: #3a3a3a;   /* sampled canal-3 · 50% off tag */
    --dot: #fd005b;        /* sampled canal-1 · cart badge dot */
    --cnl-display: "Helvetica Neue", "Inter", system-ui, sans-serif;
    --cnl-body: "Helvetica Neue", "Inter", system-ui, sans-serif;
    font-family: var(--cnl-body); color: var(--ink);
  }

  /* focus is brand-inked and visible everywhere; the pink dot rings dark bands */
  .cnlx :focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .cnlx .dark :focus-visible, .cnlx .cn-hero :focus-visible { outline-color: var(--dot); }

  /* the left inset clears the fixed rail; the right inset was far smaller, which made
     every band look pushed against the right edge. both are generous now. */
  .cn-wrap { max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(24px, 9vw, 150px) 0 max(212px, clamp(24px, 15vw, 240px)); }
  @media (max-width: 1100px){ .cn-wrap { padding-left: clamp(24px, 5vw, 72px);
    padding-right: clamp(24px, 5vw, 72px); } }

  /* ── left rail ── */
  .cn-rail { position: fixed; left: 36px; top: 50%; transform: translateY(-50%);
    z-index: 30; display: flex; flex-direction: column; gap: 20px;
    mix-blend-mode: difference; }
  @media (max-width: 1100px){ .cn-rail { display: none; } }
  .cn-rail button { display: flex; align-items: center; gap: 12px; background: none;
    border: none; padding: 0; cursor: pointer; font-family: var(--mono);
    font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #fff; opacity: .8; transition: opacity .2s ease; }
  .cn-rail button:hover { opacity: 1; }
  .cn-rail button::before { content: ""; width: 22px; height: 1px; background: #fff;
    transition: width .25s var(--ease-out); }
  .cn-rail button:hover::before { width: 40px; }

  /* ── section scaffolding — hairlines and squared chips, radius 0 throughout ── */
  .cn-sec { padding: 96px 0 110px; }
  .cn-sec.paper { background: var(--paper); }
  .cn-sec.mist { background: var(--mist); }
  .cn-sec.dark { background: var(--ink); color: var(--paper); }
  .cn-chip { display: inline-block; font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase; color: inherit;
    border: 1px solid currentColor; padding: 8px 14px; margin-bottom: 30px; opacity: .85; }
  .cn-count { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
    background: var(--graphite); /* the 50% off tag, repurposed */ color: var(--paper);
    padding: 8px 14px; margin-left: 12px; display: inline-block; vertical-align: baseline; margin-bottom: 30px; }
  .cn-h2 { font-family: var(--cnl-display); font-weight: 300; text-transform: uppercase;
    letter-spacing: 0.08em; font-size: clamp(30px, 5.2vw, 72px); line-height: 1.12;
    margin: 0 0 28px; max-width: 22ch; }
  .cn-lede { font-size: clamp(16px, 1.6vw, 19px); line-height: 1.65; max-width: 58ch;
    margin: 0 0 54px; opacity: .8; font-weight: 400; }

  /* ── hero — the SHOP NOW band's surface, blown up to a full viewport ── */
  .cn-hero { position: relative; background: var(--ink); color: var(--paper);
    overflow: hidden; padding: 150px 0 96px; }
  /* the hero's campaign portrait: right-hand column, ending inside the section (never
     bleeding into the band below) and starting past the copy so it never overlaps text.
     edges are feathered, not cut. drop canal-model.png in the folder. */
  .cn-hero-model { position: absolute; top: 96px; right: 0; bottom: 56px; width: 34%;
    pointer-events: none; user-select: none; overflow: hidden; }
  @media (max-width: 1180px){ .cn-hero-model { display: none; } }
  .cn-hero-model img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%;
    display: block; }
  .cn-hero-model .cn-model-ph { width: 100%; height: 100%;
    border-left: 1px dashed rgba(255,255,255,0.18);
    display: grid; place-items: center; text-align: center; padding: 30px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em;
    text-transform: uppercase; line-height: 2.1; color: rgba(255,255,255,0.32); }
  .cn-hero .cn-wrap { position: relative; }
  /* the hero copy is capped so it always clears the portrait column */
  @media (min-width: 1181px){
    .cn-hero .cn-h1, .cn-hero .cn-hero-sub, .cn-hero .cn-hero-actions { max-width: 60%; }
  }
  .cn-back { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--paper); background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.4); padding: 9px 16px; cursor: pointer;
    margin-bottom: 44px; transition: background .2s ease; }
  .cn-back:hover { background: rgba(255,255,255,0.18); }
  .cn-eyebrow { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.32em;
    text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 30px; }
  .cn-eyebrow .d { color: var(--dot); /* the cart dot, doing its one job */ }
  .cn-h1 { font-family: var(--cnl-display); font-weight: 200; text-transform: uppercase;
    letter-spacing: 0.1em; font-size: clamp(30px, 5.6vw, 84px); line-height: 1.16;
    margin: 0 0 42px; max-width: 20ch; }
  .cn-h1 .u { border-bottom: 3px solid var(--paper); /* the NEW IN active underline, sampled canal-5 */
    padding-bottom: 0.06em; }
  .cn-hero-sub { font-size: clamp(16px, 1.8vw, 20px); line-height: 1.6; font-weight: 400;
    color: rgba(255,255,255,0.82); max-width: 56ch; margin: 0 0 44px; }
  /* hero CTA — the store's signature SHOP NOW band, inverted for the ink ground */
  /* now an <a> to the live store: centered, undecorated, same silhouette */
  .cn-cta { position: relative; display: inline-flex; align-items: center;
    justify-content: center; width: min(420px, 100%);
    height: 58px; background: var(--paper); color: var(--ink); border: none;
    cursor: pointer; text-decoration: none; font-family: var(--cnl-display); font-weight: 400;
    font-size: 15px; letter-spacing: 0.42em; text-transform: uppercase;
    text-indent: 0.42em; transition: transform .2s var(--ease-out); }
  .cn-cta::after { content: ""; position: absolute; top: -5px; right: -5px;
    width: 12px; height: 12px; background: var(--dot); border-radius: 50%;
    /* the cart badge dot, sampled canal-1 — the page's entire color budget */ }
  .cn-cta:hover { transform: translateY(-2px); }
  .cn-cta:active { transform: scale(0.99); }
  .cn-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
  /* the button is deliberately pushed past the text column so it straddles the
     portrait's left edge: half on the ink ground, half over the photograph. */
  .cn-hero-actions { display: flex; align-items: center; gap: 22px; flex-wrap: wrap;
    position: relative; z-index: 2; margin-left: clamp(0px, 22vw, 320px); }
  @media (max-width: 1000px){ .cn-hero-actions { margin-left: 0; } }
  .cn-hero-chip { font-family: var(--mono); font-size: 10.5px; padding: 7px 14px;
    border: 1px solid rgba(255,255,255,0.35); color: rgba(255,255,255,0.85); }
  .cn-hero-chip b { color: var(--paper); font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; font-size: 9px; margin-right: 6px; }


  /* ── screens — the UI showcase: everything visible, composed big ── */
  .cn-wide { max-width: 1760px; margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 48px); display: flex; flex-direction: column;
    gap: clamp(40px, 6vw, 88px); }
  /* the section rail is position:fixed at the viewport's left edge and only
     exists above 1100px, so wide media has to start clear of it instead of
     running underneath the labels */
  @media (min-width: 1101px) { .cn-wide { padding-left: 212px; } }
  .cn-shot { border: 1px solid var(--ink); overflow: hidden; line-height: 0;
    background: var(--paper); }
  .cn-shot.bare { border: none; background: transparent; }
  .cn-shot img { width: 100%; height: auto; display: block; }
  .cn-cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; opacity: .6; line-height: 1.6; padding: 14px 2px 0;
    text-align: center; }
  .cn-duo { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 4vw, 56px);
    max-width: 980px; margin: 0 auto; width: 100%; }
  @media (max-width: 640px){ .cn-duo { grid-template-columns: 1fr; } }
  .cn-solo { max-width: 480px; margin: 0 auto; width: 100%; }

  /* ── screens, take two — full-bleed bands, same configuration as the manyfest
     case (.mnf-full): each capture runs the full viewport, the band's own left
     padding clears the fixed rail, and the band's background is sampled from
     that capture's own canvas so there's no seam between page and photo. ── */
  .cn-full { margin-top: 12px; margin-bottom: 0;
    padding: 0;
    padding-left: max(212px, clamp(24px, 15vw, 240px));
    margin-left: calc(-1 * (max((100vw - 1280px) / 2, 0px) + max(212px, clamp(24px, 15vw, 240px))));
    margin-right: calc(-1 * (max((100vw - 1280px) / 2, 0px) + clamp(24px, 9vw, 150px))); }
  .cn-full + .cn-full { margin-top: 0; }
  @media (max-width: 1100px){ .cn-full { padding-left: 0;
    margin-left: calc(-1 * clamp(24px, 5vw, 72px));
    margin-right: calc(-1 * clamp(24px, 5vw, 72px)); } }
  /* sized down to fit a desktop viewport: these are 3D device-mockup renders
     (roughly 4:3), not wide screenshots, so full width alone made them taller
     than the viewport. capping height and letting width follow keeps them
     centered inside the full-bleed band instead of forcing a giant scroll. */
  .cn-full img { display: block; width: auto; height: auto;
    max-width: 100%; max-height: min(640px, 68vh); margin: 0 auto; border: 0; }

  /* ── process — four beats, hairline-topped like the menu's dividers ── */
  .cn-process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  @media (max-width: 960px){ .cn-process { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .cn-process { grid-template-columns: 1fr; } }
  .cn-phase { border-top: 1px solid var(--ink); padding-top: 18px; }
  .cn-phase .k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.2em;
    text-transform: uppercase; opacity: .55; margin-bottom: 10px; }
  .cn-phase h4 { font-family: var(--cnl-display); font-weight: 400; text-transform: uppercase;
    letter-spacing: 0.14em; font-size: 15px; margin: 0 0 10px; }
  .cn-phase p { font-size: 14px; line-height: 1.62; margin: 0; opacity: .75; }

  /* ── decisions (dark band) ── */
  .cn-decisions { display: flex; flex-direction: column; margin-bottom: 72px; }
  .cn-decision { display: grid; grid-template-columns: 90px 1fr; gap: 0 32px;
    padding: 34px 0; border-top: 1px solid rgba(255,255,255,0.22); }
  .cn-decision:last-child { border-bottom: 1px solid rgba(255,255,255,0.22); }
  .cn-dec-num { font-family: var(--cnl-display); font-weight: 200;
    font-size: clamp(40px, 5vw, 64px); line-height: 1; color: rgba(255,255,255,0.2);
    letter-spacing: 0.04em; user-select: none; padding-top: 4px; }
  .cn-dec-title { font-family: var(--cnl-display); font-weight: 400; text-transform: uppercase;
    letter-spacing: 0.14em; font-size: clamp(15px, 1.8vw, 19px); margin: 0 0 12px; line-height: 1.35; }
  .cn-dec-p { font-size: 15px; line-height: 1.68; margin: 0; opacity: .78; }
  @media (max-width: 560px){ .cn-decision { grid-template-columns: 48px 1fr; gap: 0 20px; } }
  .cn-own { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 24px; margin-bottom: 28px; }
  @media (max-width: 860px){ .cn-own { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .cn-own { grid-template-columns: 1fr; } }
  .cn-own-item { border-top: 1px solid rgba(255,255,255,0.35); padding-top: 16px; }
  .cn-own-item h4 { font-family: var(--cnl-display); font-weight: 400; text-transform: uppercase;
    letter-spacing: 0.14em; font-size: 13px; margin: 0 0 8px; }
  .cn-own-item h4::before { content: ""; display: inline-block; width: 7px; height: 7px;
    border-radius: 50%; background: var(--dot); margin-right: 10px; vertical-align: 1px; }
  .cn-own-item p { font-size: 14px; line-height: 1.6; margin: 0; opacity: .72; }
  .cn-collab { font-family: var(--mono); font-size: 11.5px; opacity: .6;
    margin: 0; line-height: 1.7; max-width: none; }

  /* portfolio footer on the dark band */
  .cn-sec.dark .pf-label { color: rgba(255,255,255,0.55); }
  .cn-sec.dark .pf-next-link { color: var(--paper); }
  .cn-sec.dark .pf-next-link:hover { color: var(--dot); }
  .cn-sec.dark .pf-pill { background: transparent; color: var(--paper);
    border-color: rgba(255,255,255,0.35); }
  .cn-sec.dark .pf-pill:hover { color: var(--dot); border-color: var(--dot); }

  /* motion asks permission — every animation on this page is transform-only */
  @media (prefers-reduced-motion: reduce) {
    .cnlx * { transition-duration: 0.01ms !important; }
  }
`;

const CNL_DECISIONS = [
  {
    title: "Let the clothes do the talking",
    body: "Every layout decision starts from the same test: does this make the garment bigger or smaller? Imagery dominates the viewport on every screen. The mobile PDP opens as a full-bleed campaign photo with the interface compressed into a white panel at the thumb. The chrome never competes because the chrome is barely there: hairlines, white panels, tracked type."
  },
  {
    title: "Navigation was validated before pixels",
    body: "The full navigation workflow, mega menu columns on desktop and the accordion category tree on mobile, was mapped and validated with the client before high-fidelity design began. The taxonomy (roupas, essential, jeans, outlet, then fabric-level cuts like lã, alfaiataria, sarja) is how Canal's customer actually shops, so information-architecture decisions were the cheapest ones to get right early."
  },
];

const CNL_OWN = [
  { h: "Homepage concept", p: "The full-bleed campaign hero with compressed white UI panels: the template that set the store's visual grammar." },
  { h: "Navigation workflow", p: "Desktop mega menu and the mobile accordion tree, mapped, tested against the catalog, and validated with the client before hi-fi." },
  { h: "PDP, mobile + desktop", p: "Photography-first product pages: panel hierarchy, size row states, the SHOP NOW band, the guia de tamanhos." },
  { h: "Compre junto module", p: "The editorial cross-sell: stacked pairing on mobile, three-look shelf with the LEVE JUNTO panel on desktop." },
  { h: "Responsive system", p: "One tracked, hairlined layout language across breakpoints, same affordances at every size." },
  { h: "Discovery artifacts", p: "The business model canvas workshop outputs that framed the whole engagement: personas, motivations, differentiators." },
];

function CnlScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* hero campaign portrait, with a labeled placeholder until the export lands */
function CnlModel() {
  const [missing, setMissing] = useStateCnl(false);
  if (missing) {
    return (
      <div className="cn-model-ph" role="img" aria-label="Canal campaign portrait">
        <span>model image pending<br />canal-model.png</span>
      </div>
    );
  }
  return (
    <img src="canal-model.png" alt="Canal campaign portrait"
      loading="lazy" onError={() => setMissing(true)} />
  );
}

function CanalCase({ spec, onAsk }) {
  const p = (typeof PROJECTS !== "undefined" && PROJECTS.canal) || {};

  useEffectCnl(() => {
    document.body.classList.add("canal-mode");
    /* header items invert while the ink bands pass underneath */
    const onScroll = () => {
      const y = 46;
      let invert = false;
      for (const s of document.querySelectorAll(".cn-hero, .cn-sec")) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          invert = s.classList.contains("dark") || s.classList.contains("cn-hero");
          break;
        }
      }
      document.body.classList.toggle("canal-head-invert", invert);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("canal-mode", "canal-head-invert");
    };
  }, []);

  return (
    <div className="cnlx">
      <style>{__CNL_STYLE}</style>

      {/* rail */}
      <nav className="cn-rail" aria-label="sections">
        <button onClick={() => CnlScrollTo("cn-top")}>overview</button>
        <button onClick={() => CnlScrollTo("cn-screens")}>screens</button>
        <button onClick={() => CnlScrollTo("cn-process")}>process</button>
        <button onClick={() => CnlScrollTo("cn-decisions")}>decisions</button>
      </nav>

      {/* ── hero — ink ground; the campaign portrait carries it (no ghost tagline) ── */}
      <header className="cn-hero" id="cn-top">
        <div className="cn-hero-model">
          <CnlModel />
        </div>
        <div className="cn-wrap">
          <button className="cn-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="cn-eyebrow">canal concept <span className="d">●</span> studio brizza · 2023</div>
          <h1 className="cn-h1">Elegance,<br /><span className="u">on the shelf.</span></h1>
          <p className="cn-hero-sub">
            Canal is a Brazilian women's fashion brand known for elegant design and quality
            materials. The brand had evolved; its e-commerce, the highest-traffic touchpoint,
            hadn't, and every visit widened the credibility gap. The brief: make the store feel
            like the brand. Quietly, and in three sprints.
          </p>
          <div className="cn-hero-actions">
            <a className="cn-cta" href={p.liveUrl || "https://www.canal.com.br/"}
              target="_blank" rel="noopener noreferrer" aria-label="open the live canal store">
              visit the website <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>


      {/* ── 01 · screens — the UI is the point: everything visible, composed big.
           full-bleed bands, same configuration as the manyfest case study: each
           capture runs the full viewport, left padding clears the rail, and the
           band's background is sampled from that capture's own canvas. ── */}
      <section className="cn-sec mist" id="cn-screens">
        <div className="cn-wrap">
          <span className="cn-chip">the screens · 01</span><span className="cn-count">7 captures</span>
          <h2 className="cn-h2">Let the clothes do the talking.</h2>
          <p className="cn-lede">
            Every image below is the designed storefront: mobile and desktop, framed as
            captured. The chrome stays black, white, and mist so the photography carries all
            the color; the interface's job is to get out of the clothes' way and then sell them.
          </p>
        </div>

        {/* nested inside cn-wrap on purpose: the negative margins below cancel exactly this
            wrapper's own gutter + rail padding to reach the true viewport edge, then re-add
            the rail clearance for the image alone (same trick as manyfest's .mnf-full inside
            .mnf-wrap). without this wrapper the band drifts left of the viewport instead of
            clearing the rail. */}
        <div className="cn-wrap">
        <figure className="cn-full" style={{ background: "#efefea" }}>
          <img src="images-canal/canal1.jpg" alt="Two desktop browsers overlapped: the outlet hero at até 70% off, and the new in summer collection shelf behind it" loading="lazy" width="2600" height="1950" />
        </figure>

        <figure className="cn-full" style={{ background: "#282828" }}>
          <img src="images-canal/canal2.jpg" alt="Two mobile screens in phone frames: the in between sale hero at 50% off, and the new in summer collection listing" loading="lazy" width="2000" height="1500" />
        </figure>

        <figure className="cn-full" style={{ background: "#efefea" }}>
          <img src="images-canal/canal3.jpg" alt="Three desktop panes: a product page with compre junto and recomendações canal shelves, the mega menu open over the outlet hero, and a product gallery zoomed in a lightbox" loading="lazy" width="2600" height="1167" />
        </figure>

        <figure className="cn-full" style={{ background: "#282828" }}>
          <img src="images-canal/canal4.jpg" alt="Three mobile screens in phone frames: the calças femininas listing with 50% off tags, the filter panel open with price, size and color facets, and a full-bleed product portrait" loading="lazy" width="2400" height="1800" />
        </figure>

        <figure className="cn-full" style={{ background: "#efefea" }}>
          <img src="images-canal/canal5.jpg" alt="Two tilted mobile screens in phone frames: the winter/fall and summer drop collection banners, and the category tree accordion open with product suggestions" loading="lazy" width="2000" height="1500" />
        </figure>

        <figure className="cn-full" style={{ background: "#282828" }}>
          <img src="images-canal/canal6.jpg" alt="Two mobile screens in phone frames: a full-bleed product page for an olive dress, and the compre junto cross-sell with recomendações canal below it" loading="lazy" width="2000" height="1500" />
        </figure>

        <figure className="cn-full" style={{ background: "#efefea" }}>
          <img src="images-canal/canal7.jpg" alt="Three mobile screens in phone frames: the cart step, the email login step, and the delivery and payment review step of the customized checkout" loading="lazy" width="2400" height="1800" />
        </figure>
        </div>
      </section>

      {/* ── 02 · process ── */}
      <section className="cn-sec paper" id="cn-process">
        <div className="cn-wrap">
          <span className="cn-chip">the process · 02</span>
          <h2 className="cn-h2">Workshop to production, three sprints.</h2>
          <p className="cn-lede">
            Studio Brizza opened with the business before the screens: a canvas workshop set
            who Canal's customer is and why she buys, the navigation was locked next, and the
            UI was validated with the client before anything went to production.
          </p>
          <div className="cn-process">
            <div className="cn-phase">
              <div className="k">discover · 01</div>
              <h4>Canvas workshop</h4>
              <p>A business model canvas workshop with the Canal team surfaced motivations, differentiators, and personas. The argument for restraint came straight from the customer.</p>
            </div>
            <div className="cn-phase">
              <div className="k">define · 02</div>
              <h4>Navigation first</h4>
              <p>The full navigation workflow, from the mega menu to the mobile accordion tree and fabric-level taxonomy, mapped and validated with the client before high-fidelity design began.</p>
            </div>
            <div className="cn-phase">
              <div className="k">develop · 03</div>
              <h4>Homepage concept</h4>
              <p>The concept set the grammar: full-bleed campaign photography, white panels, thin tracked uppercase, hairlines. Then the system extended to PLP, PDP, and compre junto.</p>
            </div>
            <div className="cn-phase">
              <div className="k">deliver · 04</div>
              <h4>Validated, shipped</h4>
              <p>Client-validated UI across mobile and desktop went to production inside three sprints. Live at canal.com.br, where the brand finally meets its own store.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · decisions + ownership ── */}
      <section className="cn-sec dark" id="cn-decisions">
        <div className="cn-wrap">
          <span className="cn-chip">the decisions · 03</span>
          <h2 className="cn-h2">Elegance is what you leave out.</h2>
          <div className="cn-decisions">
            {CNL_DECISIONS.map((d, i) => (
              <div className="cn-decision" key={i}>
                <div className="cn-dec-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="cn-dec-title">{d.title}</div>
                  <p className="cn-dec-p">{d.body}</p>
                </div>
              </div>
            ))}
          </div>

          <span className="cn-chip">ownership · 04</span>
          <h2 className="cn-h2" style={{ fontSize: "clamp(26px, 4vw, 54px)" }}>What I owned.</h2>
          <div className="cn-own">
            {CNL_OWN.map((f, i) => (
              <div className="cn-own-item" key={i}>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
          <p className="cn-collab" style={{ marginBottom: 72 }}>
            Built at Studio Brizza with the lead designer, who owned art direction and the
            client relationship. I designed alongside: homepage concept, navigation, PDP,
            compre junto, and the responsive system were mine, from the canvas workshop
            through production handoff.
          </p>

          <NextProjectFooter currentId="canal" onAsk={onAsk} />
        </div>
      </section>

    </div>
  );
}

if (typeof LAYOUTS !== "undefined") LAYOUTS["canal-case"] = CanalCase;

Object.assign(window, { CanalCase });
