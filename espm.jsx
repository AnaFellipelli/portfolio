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

  /* header protection: pure backdrop blur (no bar); items adapt to the band underneath */
  body.espm-mode .topbar::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    -webkit-mask-image: linear-gradient(#000 60%, transparent);
    mask-image: linear-gradient(#000 60%, transparent);
  }
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
    padding: 0 clamp(24px, 5vw, 72px) 0 clamp(24px, 15vw, 240px); }
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
  .es-ghost { position: absolute; top: 90px; left: 0; white-space: nowrap;
    font-family: var(--espm-display); font-weight: 900; text-transform: uppercase;
    font-size: clamp(120px, 24vw, 340px); line-height: 1; letter-spacing: -0.02em;
    color: rgba(255,255,255,0.05); pointer-events: none; user-select: none;
    display: flex; width: max-content; animation: espmGhost 60s linear infinite; }
  @keyframes espmGhost { to { transform: translateX(-50%); } }
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
  .es-hero-shot img { width: 100%; max-width: 520px; height: auto;
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

  /* ── marquee divider — the calendar's selected-day gradient, stretched into a band ── */
  .es-marquee-wrap { overflow: hidden; color: var(--paper); padding: 14px 0;
    background: linear-gradient(90deg, var(--pill-a), var(--pill-b)); /* sampled espm-3 · day pill */ }
  .es-marquee { display: flex; white-space: nowrap; width: max-content;
    animation: espmTicker 24s linear infinite; }
  .es-marquee-item { font-family: var(--espm-quirk); font-weight: 700; font-size: 13px;
    letter-spacing: 0.3em; text-transform: uppercase; padding-right: 8px; }
  @keyframes espmTicker { to { transform: translateX(-50%); } }

  /* ── screens — the UI showcase: everything visible, composed big ── */
  .es-wide { max-width: 1500px; margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 48px); display: flex; flex-direction: column;
    gap: clamp(40px, 6vw, 88px); }
  /* captures ship inside their own device frames with transparency — frameless */
  .es-shot { border: none; background: transparent; line-height: 0; }
  .es-shot img { width: 100%; height: auto; display: block; }
  .es-cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; opacity: .6; line-height: 1.6; padding: 14px 2px 0;
    text-align: center; }
  .es-duo { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 4vw, 56px);
    max-width: 980px; margin: 0 auto; width: 100%; }
  @media (max-width: 640px){ .es-duo { grid-template-columns: 1fr; } }

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
    margin: 0; line-height: 1.7; max-width: 88ch; }

  /* portfolio footer on the dark band */
  .es-sec.floor .pf-label { color: rgba(255,255,255,0.55); }
  .es-sec.floor .pf-next-link { color: var(--paper); }
  .es-sec.floor .pf-next-link:hover { color: var(--magenta); }
  .es-sec.floor .pf-pill { background: transparent; color: var(--paper);
    border-color: rgba(255,255,255,0.35); }
  .es-sec.floor .pf-pill:hover { color: var(--magenta); border-color: var(--magenta); }

  /* motion asks permission — every animation on this page is transform-only */
  @media (prefers-reduced-motion: reduce) {
    .es-ghost, .es-marquee { animation: none !important; }
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

function EspmScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function EspmMarquee({ items }) {
  return (
    <div className="es-marquee" aria-hidden="true">
      {[0, 1].map((half) => (
        <span key={half} style={{ display: "flex" }}>
          {items.map((t, i) => <span key={i} className="es-marquee-item">{t}</span>)}
        </span>
      ))}
    </div>
  );
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
        <button onClick={() => EspmScrollTo("es-screens")}>screens</button>
        <button onClick={() => EspmScrollTo("es-process")}>process</button>
        <button onClick={() => EspmScrollTo("es-decisions")}>decisions</button>
      </nav>

      {/* ── hero — the app's dark canvas, its orbs, and the rebrand's two words ── */}
      <header className="es-hero" id="es-top">
        <div className="es-blob b1" aria-hidden="true"></div>
        <div className="es-blob b2" aria-hidden="true"></div>
        <div className="es-ghost">
          {[0, 1].map((half) => (
            <span key={half} style={{ paddingRight: "0.5em" }}>INUSITADO ✦ ATITUDE ✦ NEW ON SCHOOL ✦&nbsp;</span>
          ))}
        </div>
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
              <div className="es-hero-meta">
                <span className="es-hero-chip"><b>role</b>{p.role || "ux/ui designer, with one colleague"}</span>
                <span className="es-hero-chip"><b>company</b>espm · graduation project</span>
                <span className="es-hero-chip"><b>platforms</b>mobile · ios</span>
                <span className="es-hero-chip"><b>timeline</b>one semester · 2021</span>
              </div>
            </div>
            <figure className="es-hero-shot">
              <img src="Frame 1000005225.png" alt="ESPM student app, two composed iPhone screens: the gradient home dashboard and the color-coded calendar" />
            </figure>
          </div>
        </div>
      </header>

      {/* ── marquee divider — the calendar's day-pill gradient, stretched into a band ── */}
      <div className="es-marquee-wrap">
        <EspmMarquee items={["new on school", "✦", "inusitado", "✦", "atitude", "✦", "espm student app", "✦", "36 students heard", "✦"]} />
      </div>

      {/* ── 01 · screens — the UI is the point: everything visible, composed big ── */}
      <section className="es-sec glass" id="es-screens">
        <div className="es-wrap">
          <span className="es-chip">the screens · 01</span><span className="es-count">4 captures</span>
          <h2 className="es-h2">A new identity deserved an app to match.</h2>
          <p className="es-lede">
            Every image below is the validated concept: the rebrand's gradients on a dark
            canvas, structure decided by 36 students before a single hi-fi screen. Frames as
            captured, nothing redrawn.
          </p>
        </div>

        <div className="es-wide">
          <div className="es-duo">
            <figure style={{ margin: 0 }}>
              <div className="es-shot"><img src="espm-4.png" alt="Home dashboard: ESPM gradient header blobs, quick-action rail (ID, Calendar, Finance, Requests, Credits), 'New on school' carousel with red Enroll button" loading="lazy" /></div>
              <figcaption className="es-cap">home · mobile · quick actions first: id, calendar, finance</figcaption>
            </figure>
            <figure style={{ margin: 0 }}>
              <div className="es-shot"><img src="espm-3.png" alt="Calendar: March with gradient selected-day pill, today and tomorrow lists with color-coded ticks for classes, tests and deadlines" loading="lazy" /></div>
              <figcaption className="es-cap">calendar · mobile · color-coded today and tomorrow</figcaption>
            </figure>
          </div>

          <div className="es-duo">
            <figure style={{ margin: 0 }}>
              <div className="es-shot"><img src="espm-1.png" alt="Student ID: glassmorphic card with photo, QR access code and gradient orbs on a dark background" loading="lazy" /></div>
              <figcaption className="es-cap">student id · mobile · glass card, qr access, no plastic</figcaption>
            </figure>
            <figure style={{ margin: 0 }}>
              <div className="es-shot"><img src="espm-5.png" alt="Marketing II course screen: exams with grade pills, next classes list, magenta gradient blob bleeding from the right edge" loading="lazy" /></div>
              <figcaption className="es-cap">grades · mobile · per-course exams and next classes</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── 02 · process ── */}
      <section className="es-sec light" id="es-process">
        <div className="es-wrap">
          <span className="es-chip">the process · 02</span>
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
