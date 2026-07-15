/* ════════════════════════════════════════════════════════════
   baw.jsx — immersive case page for BAW Clothing.
   The page wears BAW's skin: every value below is sampled from
   the shipped screens (baw-1…5.png) — annotated per token.
   Full-bleed bands via body.baw-mode; the shipped screens are the
   centerpiece, composed big in their real device frames.
   Registers LAYOUTS["baw-case"] → hash route #/baw (app.jsx).
   ════════════════════════════════════════════════════════════ */

const { useState: useStateBaw, useEffect: useEffectBaw } = React;

/* ── BAW identity — sampled, not invented ──
   ink        #0d0d0d  (title/logotype, sampled baw-2 PDP capture)
   chalk      #f1f1f1  (panel surface, sampled baw-2)
   concrete   #e8e8e8  (page floor behind photography, sampled baw-2/baw-5)
   buy green  #64d987  (COMPRAR band, sampled baw-2)
   alert pink #ff0f54  ("ÚLTIMAS 13 UNIDADES", sampled baw-2)
   sale purple#9046d9  (SALE nav item, sampled baw-2)
   colorways  #000000 #cdc9c9 #303063 #336676 #b0d6cf #a68aa6 #f29ba4
              (PDP swatch column, sampled baw-3)
   radius     0 — the storefront is squared throughout; only the
              colorway swatches are circles.
   type       heavy grotesque display (Baw® logotype / headings) +
              geometric sans body — neither is web-licensed here, so
              stacks declare the brand face first and fall back:
              "Helvetica Now Display" → Archivo · "Futura PT" → DM Sans. */

const __BAW_STYLE = `
  /* free the page from the constrained canvas — full-bleed bands */
  body.baw-mode .canvas { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  /* a transformed ancestor would hijack the rail's position:fixed */
  body.baw-mode .page-enter { animation: none !important; }
  body.baw-mode .atmosphere, body.baw-mode .grain { display: none; }
  body.baw-mode { background: #e8e8e8; /* concrete — page floor, sampled baw-2 */ }

  /* header protection: pure backdrop blur (no bar); items adapt to the band underneath */
  body.baw-mode .topbar::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    -webkit-mask-image: linear-gradient(#000 60%, transparent);
    mask-image: linear-gradient(#000 60%, transparent);
  }
  body.baw-mode .topbar > * { position: relative; z-index: 1; }
  body.baw-mode .topbar .logo { color: #0d0d0d; transition: color .3s ease; }
  body.baw-mode .nav-link { color: rgba(13,13,13,0.6); transition: color .3s ease; }
  body.baw-mode .nav-link:hover, body.baw-mode .nav-link.active { color: #0d0d0d; }
  body.baw-mode.baw-head-invert .topbar .logo { color: #f1f1f1; }
  body.baw-mode.baw-head-invert .nav-link { color: rgba(241,241,241,0.72); }
  body.baw-mode.baw-head-invert .nav-link:hover,
  body.baw-mode.baw-head-invert .nav-link.active { color: #f1f1f1; }

  .bawx {
    --ink: #0d0d0d;        /* sampled baw-2 · titles + logotype */
    --chalk: #f1f1f1;      /* sampled baw-2 · panel surface */
    --concrete: #e8e8e8;   /* sampled baw-2 · page floor */
    --buy: #64d987;        /* sampled baw-2 · COMPRAR band */
    --alert: #ff0f54;      /* sampled baw-2 · last-units warning */
    --sale: #9046d9;       /* sampled baw-2 · SALE nav item */
    --baw-display: "Helvetica Now Display", "Archivo", system-ui, sans-serif;
    --baw-body: "Futura PT", "DM Sans", system-ui, sans-serif;
    font-family: var(--baw-body); color: var(--ink);
  }

  /* focus is brand-inked and visible everywhere; green ring on dark bands */
  .bawx :focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .bawx .dark :focus-visible, .bawx .bw-hero :focus-visible { outline-color: var(--buy); }

  .bw-wrap { max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 72px) 0 clamp(24px, 15vw, 240px); }
  @media (max-width: 1100px){ .bw-wrap { padding-left: clamp(24px, 5vw, 72px); } }

  /* ── left rail ── */
  .bw-rail { position: fixed; left: 36px; top: 50%; transform: translateY(-50%);
    z-index: 30; display: flex; flex-direction: column; gap: 20px;
    mix-blend-mode: difference; }
  @media (max-width: 1100px){ .bw-rail { display: none; } }
  .bw-rail button { display: flex; align-items: center; gap: 12px; background: none;
    border: none; padding: 0; cursor: pointer; font-family: var(--mono);
    font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #fff; opacity: .8; transition: opacity .2s ease; }
  .bw-rail button:hover { opacity: 1; }
  .bw-rail button::before { content: ""; width: 22px; height: 1.5px; background: #fff;
    transition: width .25s var(--ease-out); }
  .bw-rail button:hover::before { width: 40px; }

  /* ── section scaffolding — squared chips, the brand has no rounded corners ── */
  .bw-sec { padding: 96px 0 110px; }
  .bw-sec.chalk { background: var(--chalk); }
  .bw-sec.concrete { background: var(--concrete); }
  .bw-sec.dark { background: var(--ink); color: var(--chalk); }
  .bw-chip { display: inline-block; font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase; color: inherit;
    border: 1px solid currentColor; padding: 8px 14px; margin-bottom: 30px; opacity: .85; }
  .bw-count { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
    background: var(--ink); color: var(--chalk); padding: 8px 14px; margin-left: 12px;
    display: inline-block; vertical-align: baseline; margin-bottom: 30px; }
  .bw-h2 { font-family: var(--baw-display); font-weight: 900; letter-spacing: -0.02em;
    text-transform: uppercase; font-size: clamp(40px, 7vw, 100px); line-height: 0.94;
    margin: 0 0 28px; max-width: 15ch; }
  .bw-lede { font-size: clamp(16px, 1.6vw, 20px); line-height: 1.6; max-width: 56ch;
    margin: 0 0 54px; opacity: .85; }

  /* ── hero — the brand's boldest surface: ink + ghost display type ── */
  .bw-hero { position: relative; background: var(--ink); color: var(--chalk);
    overflow: hidden; padding: 150px 0 96px; }
  .bw-ghost { position: absolute; top: 90px; left: 0; white-space: nowrap;
    font-family: var(--baw-display); font-weight: 900; text-transform: uppercase;
    font-size: clamp(120px, 24vw, 340px); line-height: 1; letter-spacing: -0.02em;
    color: rgba(241,241,241,0.05); pointer-events: none; user-select: none;
    display: flex; width: max-content; animation: bawGhost 60s linear infinite; }
  @keyframes bawGhost { to { transform: translateX(-50%); } }
  .bw-hero .bw-wrap { position: relative; }
  .bw-back { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--chalk); background: rgba(241,241,241,0.08);
    border: 1px solid rgba(241,241,241,0.4); padding: 9px 16px; cursor: pointer;
    margin-bottom: 44px; transition: background .2s ease; }
  .bw-back:hover { background: rgba(241,241,241,0.2); }
  .bw-eyebrow { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--buy); margin-bottom: 30px; }
  .bw-h1 { font-family: var(--baw-display); font-weight: 900; letter-spacing: -0.02em;
    text-transform: uppercase; font-size: clamp(52px, 9.5vw, 150px); line-height: 0.9;
    margin: 0 0 42px; max-width: 11ch; }
  .bw-h1 .noise { background: var(--chalk); color: var(--ink);
    padding: 0 0.12em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
  .bw-hero-sub { font-size: clamp(17px, 1.8vw, 21px); line-height: 1.55;
    color: rgba(241,241,241,0.85); max-width: 54ch; margin: 0 0 44px; }
  /* hero CTA — same component as the PDP's COMPRAR band: a marquee in a green rectangle */
  .bw-cta { position: relative; display: inline-block; vertical-align: middle;
    width: min(420px, 100%); height: 58px; background: var(--buy); border: none;
    cursor: pointer; overflow: hidden; transition: transform .2s var(--ease-out); }
  .bw-cta:hover { transform: translateY(-2px); }
  .bw-cta:active { transform: scale(0.99); }
  .bw-cta .track { position: absolute; inset: 0; display: flex; align-items: center;
    white-space: nowrap; width: max-content; animation: bawTicker 14s linear infinite; }
  .bw-cta .track span { font-family: var(--baw-display); font-weight: 900; font-size: 19px;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink); padding: 0 26px; }
  .bw-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
  .bw-hero-chip { font-family: var(--mono); font-size: 10.5px; padding: 7px 14px;
    border: 1px solid rgba(241,241,241,0.35); color: rgba(241,241,241,0.85); }
  .bw-hero-chip b { color: var(--chalk); font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; font-size: 9px; margin-right: 6px; }
  /* ── marquee divider — the storefront's own mechanism (the COMPRAR band scrolls) ── */
  .bw-marquee-wrap { overflow: hidden; background: var(--buy); color: var(--ink); padding: 14px 0; }
  .bw-marquee { display: flex; white-space: nowrap; width: max-content;
    animation: bawTicker 24s linear infinite; }
  .bw-marquee-item { font-family: var(--baw-display); font-weight: 900; font-size: 14px;
    letter-spacing: 0.3em; text-transform: uppercase; padding-right: 8px; }
  @keyframes bawTicker { to { transform: translateX(-50%); } }

  /* ── screens — the UI showcase: everything visible, composed big ── */
  .bw-wide { max-width: 1500px; margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 48px); display: flex; flex-direction: column;
    gap: clamp(40px, 6vw, 88px); }
  .bw-shot { border: 1.5px solid var(--ink); overflow: hidden; line-height: 0;
    background: var(--concrete); }
  .bw-shot.bare { border: none; background: transparent; }
  .bw-shot img { width: 100%; height: auto; display: block; }
  .bw-cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; opacity: .6; line-height: 1.6; padding: 14px 2px 0;
    text-align: center; }
  .bw-duo { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 4vw, 56px);
    max-width: 980px; margin: 0 auto; width: 100%; }
  @media (max-width: 640px){ .bw-duo { grid-template-columns: 1fr; } }

  /* ── process — double diamond, four beats ── */
  .bw-process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  @media (max-width: 960px){ .bw-process { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .bw-process { grid-template-columns: 1fr; } }
  .bw-phase { border-top: 2.5px solid var(--ink); padding-top: 18px; }
  .bw-phase .k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.2em;
    text-transform: uppercase; opacity: .55; margin-bottom: 10px; }
  .bw-phase h4 { font-family: var(--baw-display); font-weight: 900; text-transform: uppercase;
    font-size: 19px; letter-spacing: -0.01em; margin: 0 0 10px; }
  .bw-phase p { font-size: 14px; line-height: 1.62; margin: 0; opacity: .78; }

  /* ── decisions (dark band) ── */
  .bw-decisions { display: flex; flex-direction: column; margin-bottom: 72px; }
  .bw-decision { display: grid; grid-template-columns: 90px 1fr; gap: 0 32px;
    padding: 34px 0; border-top: 1.5px solid rgba(241,241,241,0.25); }
  .bw-decision:last-child { border-bottom: 1.5px solid rgba(241,241,241,0.25); }
  .bw-dec-num { font-family: var(--baw-display); font-weight: 900; letter-spacing: -0.04em;
    font-size: clamp(40px, 5vw, 68px); line-height: 1; color: rgba(241,241,241,0.16);
    user-select: none; padding-top: 4px; }
  .bw-dec-title { font-family: var(--baw-display); font-weight: 900; text-transform: uppercase;
    font-size: clamp(17px, 2vw, 22px); margin: 0 0 12px; line-height: 1.2; letter-spacing: -0.005em; }
  .bw-dec-p { font-size: 15px; line-height: 1.68; margin: 0; opacity: .8; }
  @media (max-width: 560px){ .bw-decision { grid-template-columns: 48px 1fr; gap: 0 20px; } }
  .bw-own { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 24px; margin-bottom: 28px; }
  @media (max-width: 860px){ .bw-own { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .bw-own { grid-template-columns: 1fr; } }
  .bw-own-item { border-top: 2.5px solid var(--buy); padding-top: 16px; }
  .bw-own-item h4 { font-family: var(--baw-display); font-weight: 900; text-transform: uppercase;
    font-size: 15px; margin: 0 0 8px; }
  .bw-own-item p { font-size: 14px; line-height: 1.6; margin: 0; opacity: .75; }
  .bw-collab { font-family: var(--mono); font-size: 11.5px; opacity: .6;
    margin: 0; line-height: 1.7; max-width: 88ch; }

  /* portfolio footer on the dark band */
  .bw-sec.dark .pf-label { color: rgba(241,241,241,0.55); }
  .bw-sec.dark .pf-next-link { color: var(--chalk); }
  .bw-sec.dark .pf-next-link:hover { color: var(--buy); }
  .bw-sec.dark .pf-pill { background: transparent; color: var(--chalk);
    border-color: rgba(241,241,241,0.35); }
  .bw-sec.dark .pf-pill:hover { color: var(--buy); border-color: var(--buy); }

  /* motion asks permission — every animation on this page is transform-only */
  @media (prefers-reduced-motion: reduce) {
    .bw-ghost, .bw-marquee, .bw-cta .track { animation: none !important; }
    .bawx * { transition-duration: 0.01ms !important; }
  }
`;

const BAW_DECISIONS = [
  {
    title: "Break the rhythm, keep the usability",
    body: "BAW's identity is interruption: oversized ghost headlines bleeding off-canvas, marquee bands, photography that shoves the UI aside. The rule that made it shippable: layout can break rhythm, but never affordance. Prices, sizes, and the buy action sit exactly where a shopper's hand expects them, on every breakpoint. The chaos is art-directed; the commerce is boring on purpose."
  },
  {
    title: "Color stays neutral at rest, assertive on interaction",
    body: "The whole interface lives in ink on chalk and concrete, sampled straight from the shipped screens. Green (#64D987) exists for exactly one job: buy. Pink (#FF0F54) for scarcity. Purple (#9046D9) for SALE. Because chrome never competes, the street photography and the product do all the shouting, and the three accents read as commands instead of decoration."
  },
  {
    title: "The buy button is a marquee",
    body: "COMPRAR scrolls inside its own band. The loudest element on the PDP is also the most conventional one: a full-width green rectangle exactly where conversion patterns say it should be. Brand expression and e-commerce orthodoxy in the same 58 pixels. It's the project's thesis in one component."
  },
  {
    title: "Carry the brand all the way through checkout",
    body: "Most VTEX stores drop to the default checkout at the exact moment money changes hands. We customized the VTEX checkout so type, color, and tone survive payment. They're the riskiest screens to touch and the most valuable, because brand trust matters most when a card number is being typed."
  },
  {
    title: "Validate navigation before drawing screens",
    body: "A complete navigation workflow (category tree, filters, search behavior) was mapped and validated with the client before high-fidelity design started. With 1,000+ products live, information architecture was the real conversion surface; the homepage concepts came second."
  },
];

const BAW_OWN = [
  { h: "PDP + PLP design", p: "Product detail and listing pages, mobile and desktop: colorway picker, size row, buy band, scarcity messaging." },
  { h: "Navigation workflow", p: "Category tree, mega menu, search and filter behavior, mapped and validated with the client before hi-fi." },
  { h: "Homepage concepts", p: "Concept directions for the ghost-type + photography language, iterated with the lead designer." },
  { h: "VTEX checkout skin", p: "The customized checkout flow that keeps BAW's type and color through payment." },
  { h: "Responsive system", p: "One layout language across breakpoints: same affordances, different noise levels." },
  { h: "Discovery artifacts", p: "Workshop facilitation support and the business model canvas that framed scope." },
];

function BawScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function BawMarquee({ items }) {
  return (
    <div className="bw-marquee" aria-hidden="true">
      {[0, 1].map((half) => (
        <span key={half} style={{ display: "flex" }}>
          {items.map((t, i) => <span key={i} className="bw-marquee-item">{t}</span>)}
        </span>
      ))}
    </div>
  );
}

function BawCase({ spec, onAsk }) {
  const p = (typeof PROJECTS !== "undefined" && PROJECTS.baw) || {};

  useEffectBaw(() => {
    document.body.classList.add("baw-mode");
    /* header items invert while the ink bands pass underneath */
    const onScroll = () => {
      const y = 46;
      let invert = false;
      for (const s of document.querySelectorAll(".bw-hero, .bw-sec")) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          invert = s.classList.contains("dark") || s.classList.contains("bw-hero");
          break;
        }
      }
      document.body.classList.toggle("baw-head-invert", invert);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("baw-mode", "baw-head-invert");
    };
  }, []);

  return (
    <div className="bawx">
      <style>{__BAW_STYLE}</style>

      {/* rail */}
      <nav className="bw-rail" aria-label="sections">
        <button onClick={() => BawScrollTo("bw-top")}>overview</button>
        <button onClick={() => BawScrollTo("bw-screens")}>screens</button>
        <button onClick={() => BawScrollTo("bw-process")}>process</button>
        <button onClick={() => BawScrollTo("bw-decisions")}>decisions</button>
      </nav>

      {/* ── hero — ink, ghost type, the slogan as the statement ── */}
      <header className="bw-hero" id="bw-top">
        <div className="bw-ghost">
          {[0, 1].map((half) => (
            <span key={half} style={{ paddingRight: "0.5em" }}>WE MAKE NOISE NOT FASHION&nbsp;★&nbsp;</span>
          ))}
        </div>
        <div className="bw-wrap">
          <button className="bw-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="bw-eyebrow">baw clothing · studio brizza · 2024</div>
          <h1 className="bw-h1">We make <span className="noise">noise,</span> not fashion.</h1>
          <p className="bw-hero-sub">
            BAW is one of Brazil's loudest streetwear brands, and loud design usually costs
            conversion. The brief was to keep both: an e-commerce experience unmistakably BAW,
            disciplined enough to sell, all the way through a customized VTEX checkout.
          </p>
          <button className="bw-cta" onClick={() => BawScrollTo("bw-screens")}
            aria-label="enter the store">
            <span className="track" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => <span key={i}>Enter the store →</span>)}
            </span>
          </button>
          <div className="bw-hero-meta">
            <span className="bw-hero-chip"><b>role</b>{p.role || "product designer, with the lead designer"}</span>
            <span className="bw-hero-chip"><b>company</b>baw clothing · studio brizza</span>
            <span className="bw-hero-chip"><b>platforms</b>mobile · desktop · vtex</span>
            <span className="bw-hero-chip"><b>timeline</b>3 sprints · shipped 2024</span>
          </div>
        </div>
      </header>

      {/* ── marquee divider — buy-green, the storefront's own mechanism ── */}
      <div className="bw-marquee-wrap">
        <BawMarquee items={["we make noise", "★", "not fashion", "★", "baw clothing", "★", "vtex checkout", "★", "1032 produtos", "★"]} />
      </div>

      {/* ── 01 · screens — the UI is the point: everything visible, composed big ── */}
      <section className="bw-sec concrete" id="bw-screens">
        <div className="bw-wrap">
          <span className="bw-chip">the screens · 01</span><span className="bw-count">5 captures</span>
          <h2 className="bw-h2">Loud, and it still converts.</h2>
          <p className="bw-lede">
            Every image below is the shipped product: mobile and desktop, framed as captured.
            Street photography carries the noise; the UI stays ink-on-chalk so the products
            and the pictures do the talking.
          </p>
        </div>

        {/* the composed storefront — full-width, no frame on the frame */}
        <div className="bw-wide">
          <figure className="bw-fig" style={{ margin: 0 }}>
            <div className="bw-shot bare"><img src="baw-1.png" alt="BAW homepage: desktop and two mobile screens composed over gas-station street photography, slogan 'we make noise not fashion'" loading="lazy" /></div>
            <figcaption className="bw-cap">home · the composed storefront · mobile + desktop</figcaption>
          </figure>

          <figure className="bw-fig" style={{ margin: 0 }}>
            <div className="bw-shot"><img src="baw-2.png" alt="Desktop product page: cropped t-shirt, colorway swatches, size row and green COMPRAR marquee band" loading="lazy" /></div>
            <figcaption className="bw-cap">pdp · desktop · swatch column, size row, the comprar marquee band</figcaption>
          </figure>

          <div className="bw-duo">
            <figure className="bw-fig" style={{ margin: 0 }}>
              <div className="bw-shot bare"><img src="baw-3.png" alt="Mobile product page in a phone frame: price, colorway swatches and product photography" loading="lazy" /></div>
              <figcaption className="bw-cap">pdp · mobile · thumb-first hierarchy</figcaption>
            </figure>
            <figure className="bw-fig" style={{ margin: 0 }}>
              <div className="bw-shot bare"><img src="baw-4.png" alt="Mobile category listing for camisetas: photographic category header over a two-column product grid" loading="lazy" /></div>
              <figcaption className="bw-cap">plp · mobile · 1032 produtos, photographic headers</figcaption>
            </figure>
          </div>

          <figure className="bw-fig" style={{ margin: 0 }}>
            <div className="bw-shot"><img src="baw-5.png" alt="Desktop product carousel: ghost oversized 'CLASSICOS' headline behind a row of product cards with colorway swatches" loading="lazy" /></div>
            <figcaption className="bw-cap">plp · desktop · ghost headline bleeding behind the shelf</figcaption>
          </figure>
        </div>
      </section>

      {/* ── 02 · process ── */}
      <section className="bw-sec chalk" id="bw-process">
        <div className="bw-wrap">
          <span className="bw-chip">the process · 02</span>
          <h2 className="bw-h2">Double diamond, three sprints.</h2>
          <p className="bw-lede">
            Studio Brizza ran the engagement on the Double Diamond. Discovery set the business
            frame, definition locked the navigation before pixels, and everything shipped
            across mobile and desktop in three sprints, checkout included.
          </p>
          <div className="bw-process">
            <div className="bw-phase">
              <div className="k">discover · 01</div>
              <h4>Workshop + canvas</h4>
              <p>Discovery workshop with the BAW team and a business model canvas to frame who buys, why, and where the margin lives, before any screen existed.</p>
            </div>
            <div className="bw-phase">
              <div className="k">define · 02</div>
              <h4>Navigation first</h4>
              <p>A complete navigation workflow (category tree, filters, search) mapped and validated with the client. With 1,000+ SKUs, the IA was the conversion surface.</p>
            </div>
            <div className="bw-phase">
              <div className="k">develop · 03</div>
              <h4>Concepts to system</h4>
              <p>Homepage concept directions, then the full mobile + desktop layout language: ghost type, marquee bands, ink-on-chalk chrome, photography full-bleed.</p>
            </div>
            <div className="bw-phase">
              <div className="k">deliver · 04</div>
              <h4>Through checkout</h4>
              <p>Shipped on VTEX in three sprints, with a customized checkout that carries the brand through payment: the screens most stores leave on default.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · decisions + ownership ── */}
      <section className="bw-sec dark" id="bw-decisions">
        <div className="bw-wrap">
          <span className="bw-chip">the decisions · 03</span>
          <h2 className="bw-h2">Bold where it brands, boring where it sells.</h2>
          <div className="bw-decisions">
            {BAW_DECISIONS.map((d, i) => (
              <div className="bw-decision" key={i}>
                <div className="bw-dec-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="bw-dec-title">{d.title}</div>
                  <p className="bw-dec-p">{d.body}</p>
                </div>
              </div>
            ))}
          </div>

          <span className="bw-chip">ownership · 04</span>
          <h2 className="bw-h2" style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}>What I owned.</h2>
          <div className="bw-own">
            {BAW_OWN.map((f, i) => (
              <div className="bw-own-item" key={i}>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
          <p className="bw-collab" style={{ marginBottom: 72 }}>
            Built at Studio Brizza with the lead designer, who owned art direction and the brand
            relationship; VTEX implementation by the studio's engineering partners. I designed
            alongside: PDP/PLP, navigation, responsive system, and the checkout skin were mine.
          </p>

          <NextProjectFooter currentId="baw" onAsk={onAsk} />
        </div>
      </section>

    </div>
  );
}

if (typeof LAYOUTS !== "undefined") LAYOUTS["baw-case"] = BawCase;

Object.assign(window, { BawCase });
