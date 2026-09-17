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

  /* ── section scaffolding — hairline rules, the site's exposed grid ── */
  .bt-sec { position: relative; padding: 96px 0 110px; }
  .bt-sec.paper { background: var(--paper); }
  .bt-sec.white { background: #fff; }
  .bt-sec.dark { background: var(--coal); color: var(--paper); }
  .bt-sec .rule-v { position: absolute; top: 0; bottom: 0; width: 1px;
    background: var(--hair); pointer-events: none; }
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

  /* ── hero — mirrors the landing page: one centered stack, the ✕ blown up behind it ── */
  .bt-hero { position: relative; background: var(--coal); color: var(--paper);
    overflow: hidden; padding: 130px 0 104px; }
  .bt-hero .bt-wrap { position: relative; }
  /* the mark, full blown: centered, bleeding past the viewport, sitting behind the words */
  .bt-xmark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-family: var(--bmt-grot); font-weight: 700; line-height: 1;
    font-size: min(118vh, 96vw); color: var(--mint); opacity: .16;
    pointer-events: none; user-select: none; z-index: 0;
    animation: btXin 1.2s var(--ease-out) both; }
  @keyframes btXin { from { transform: translate(-50%, -50%) scale(.82); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: .16; } }

  /* the centered stack itself */
  .bt-hero-core { position: relative; z-index: 1; max-width: 62ch; margin: 0 auto;
    text-align: center; display: flex; flex-direction: column; align-items: center; }
  .bt-back { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--paper); background: rgba(239,239,239,0.08);
    border: 1px solid rgba(239,239,239,0.4); padding: 9px 16px; cursor: pointer;
    margin-bottom: 44px; transition: background .2s ease; }
  .bt-back:hover { background: rgba(239,239,239,0.2); }
  .bt-eyebrow { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--mint); margin-bottom: 30px; }
  /* lowercase, light, one highlighted word: the landing hero's exact recipe,
     with the em's padding optically centered on the glyphs the same way */
  .bt-h1 { font-family: var(--bmt-grot); font-weight: 400; letter-spacing: -0.02em;
    text-transform: lowercase; font-size: clamp(38px, 6.6vw, 82px); line-height: 1.16;
    margin: 0 0 22px; max-width: 18ch; }
  .bt-h1 em { font-style: normal; font-weight: 700; background: var(--mint); color: var(--coal);
    display: inline-block; line-height: 1; padding: 0.1em 0.16em 0.16em;
    vertical-align: baseline; }
  .bt-hero-sub { font-size: clamp(16px, 1.7vw, 19px); line-height: 1.62;
    color: rgba(239,239,239,0.8); max-width: 56ch; margin: 0 0 36px; }
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

  /* ── ✕ divider strip — the logo's mark, the site's own motif ── */
  .bt-xstrip { display: flex; align-items: center; justify-content: center; gap: 34px;
    background: var(--paper); border-top: 1px solid var(--hair);
    border-bottom: 1px solid var(--hair); padding: 13px 0; overflow: hidden; }
  .bt-xstrip span { font-family: var(--bmt-grot); font-weight: 700; font-size: 13px; }
  .bt-xstrip span:nth-child(odd) { color: var(--mint); }
  .bt-xstrip span:nth-child(even) { color: var(--ink); opacity: .35; }

  /* ── screens — the shipped work, composed big (bw-wide pattern) ── */
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
  .dark .bt-missing { border-color: var(--hair-inv); }
  .dark .bt-missing b { color: var(--paper); }

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

  /* ── the motion, shown as a capture of the shipped site ── */
  .bt-mo-head { display: flex; align-items: baseline; gap: 14px; margin: 74px 0 18px; }
  .bt-mo-lede { font-size: 15px; line-height: 1.65; max-width: 60ch; margin: 0 0 34px; opacity: .8; }
  .bt-video { margin: 0; }
  .bt-video-frame { border: 1px solid var(--hair); background: var(--coal);
    line-height: 0; overflow: hidden; }
  .bt-video-frame video { width: 100%; height: auto; display: block; }

  /* ── decisions (dark band) + ownership (bw pattern) ── */
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
    .bt-xmark { animation: none !important; }
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

/* image with a graceful fallback: if the export isn't in the folder yet,
   show a labeled placeholder instead of a broken image */
function BmtImg({ src, alt, cap }) {
  const [missing, setMissing] = useStateBmt(false);
  return (
    <figure style={{ margin: 0 }}>
      {missing ? (
        <div className="bt-missing" role="img" aria-label={alt}>
          <span>export pending<br /><b>{src}</b><br />{cap}</span>
        </div>
      ) : (
        <div className="bt-shot">
          <img src={src} alt={alt} loading="lazy" onError={() => setMissing(true)} />
        </div>
      )}
      <figcaption className="bt-cap">{cap}</figcaption>
    </figure>
  );
}

/* the motion, as a capture of the shipped site: plays muted on loop once visible,
   and falls back to a labeled placeholder until the recording is in the folder */
function BmtVideo({ src, poster, cap }) {
  const [missing, setMissing] = useStateBmt(false);
  return (
    <figure className="bt-video">
      {missing ? (
        <div className="bt-missing" role="img" aria-label={cap}>
          <span>recording pending<br /><b>{src}</b><br />screen capture of bmtax.com.br</span>
        </div>
      ) : (
        <div className="bt-video-frame">
          <video src={src} poster={poster} muted loop playsInline autoPlay controls
            preload="metadata" onError={() => setMissing(true)} />
        </div>
      )}
      <figcaption className="bt-cap">{cap}</figcaption>
    </figure>
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

      {/* rail — same stops as baw/canal */}
      <nav className="bt-rail" aria-label="sections">
        <button onClick={() => BmtScrollTo("bt-top")}>overview</button>
        <button onClick={() => BmtScrollTo("bt-screens")}>screens</button>
        <button onClick={() => BmtScrollTo("bt-process")}>process</button>
        <button onClick={() => BmtScrollTo("bt-decisions")}>decisions</button>
      </nav>

      {/* ── hero — the landing page's centered stack, with the ✕ full blown behind it ── */}
      <header className="bt-hero" id="bt-top">
        <div className="bt-xmark" aria-hidden="true">✕</div>
        <div className="bt-wrap">
          <button className="bt-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="bt-hero-core">
            <div className="bt-eyebrow">bm tax · estúdio brizza · 2024</div>
            <h1 className="bt-h1">tax intelligence, made <em>legible</em></h1>
            <p className="bt-hero-sub">
              BMTax turns tax complexity into strategic decisions for large companies. Their website
              had to do the same job in miniature: take an intimidating subject (ICMS credits,
              tax reform, fiscal data) and make it feel precise, modern, and calm. I designed the
              entire site: structure, every layout, and the motion.
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
        <div className="rule-v" style={{ left: "12%" }}></div>
        <div className="bt-wrap">
          <span className="bt-chip">the screens · 01</span><span className="bt-count">6 captures</span>
          <h2 className="bt-h2">Blueprint, not brochure<span className="x">.</span></h2>
          <p className="bt-lede">
            Ink on off-white, coal bands, the mint rationed to the ✕, the numerals, and the
            actions, with hairline rules crossing the layout like a technical drawing.
            Desktop and mobile, Portuguese and English, live at bmtax.com.br.
          </p>
        </div>
        <div className="bt-wide">
          <BmtImg src="bmtax-home.png" alt="BM TAX homepage: film hero, product list on the coal band, mint numerals" cap="home · desktop · film hero, products, the numbers band" />
          <BmtImg src="bmtax-expertise.png" alt="BM TAX expertise page: five product verticals with imagery and detail blocks" cap="expertise · desktop · the five verticals" />
          <div className="bt-duo">
            <BmtImg src="bmtax-mobile-1.png" alt="BM TAX mobile homepage" cap="home · mobile" />
            <BmtImg src="bmtax-mobile-2.png" alt="BM TAX mobile expertise page" cap="expertise · mobile" />
          </div>
          <div className="bt-duo">
            <BmtImg src="bmtax-exp-1.png" alt="The six saved states of the BM TAX products band component in Figma" cap="produtos · the six-state component · from the figma file" />
            <BmtImg src="bmtax-exp-2.png" alt="The three designed states of the BM TAX contact page: form, success, and error" cap="contato · form, success, error · from the figma file" />
          </div>
        </div>
      </section>

      {/* ── 02 · process ── */}
      <section className="bt-sec white" id="bt-process">
        <div className="rule-v" style={{ right: "16%" }}></div>
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

          {/* the motion, as a capture of the shipped site */}
          <div className="bt-mo-head">
            <span className="bt-chip" style={{ marginBottom: 0 }}>the motion · in production</span>
          </div>
          <p className="bt-mo-lede">
            Counters that land on exact figures, blocks that settle with a short scale-and-fade,
            arrows that travel and stop. Recorded from the shipped site.
          </p>
          <BmtVideo src="bmtax-motion.mp4" poster="bmtax-motion-poster.jpg"
            cap="screen recording · bmtax.com.br · counters, reveals, and hover states in production" />
        </div>
      </section>

      {/* ── 03 · decisions + 04 · ownership (dark band) ── */}
      <section className="bt-sec dark" id="bt-decisions">
        <div className="rule-v" style={{ left: "11%" }}></div>
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
