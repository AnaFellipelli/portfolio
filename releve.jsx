/* ════════════════════════════════════════════════════════════
   releve.jsx — immersive case page for (r)elevē, the ballet
   correction app. ELISAVA capstone, 2026.
   The page wears the product's skin: a black stage, aurora
   gradients, and the app's own tokens — every value below is
   sampled from the shipped deck (releve-1…4) or read straight
   out of the prototype's token table (releve-proto.html · const C).
   The centerpiece is the LIVE prototype, embedded in demo mode.
   Full-bleed bands via body.releve-mode; ends with
   NextProjectFooter inside the last dark band.
   Registers LAYOUTS["releve-case"] → hash route #/releve (app.jsx).
   ════════════════════════════════════════════════════════════ */

const { useEffect: useEffectRlv } = React;

/* ── (r)elevē identity — sampled, not invented ──
   stage black  #000000  (deck page bg, sampled releve-1/2/4)
   app black    #080808  (prototype token C.bg)
   card         #111114  (prototype token C.card)
   text         #f0f0f0  (prototype token C.text)
   purple       #7B6EF6  (prototype token C.purple)
   pink         #D455A8  (prototype token C.pink)
   green        #4EC994  (prototype token C.green)
   magenta      #E040A0  (prototype deep-gradient stop · score ring)
   violet       #5B3FE8  (prototype deep-gradient stop · score ring)
   peach        #F4A77A  (prototype score-ring first stop)
   aurora blue  #323ac4  (sampled releve cover gradient)
   aurora coral #fcac9e  (sampled releve cover gradient)
   grad         135deg #D455A8 → #7B6EF6 (prototype token C.grad)
   radius       rounded throughout — cards 14–28, pills 999
                (read from the prototype's borderRadius values)
   type         Inter (body) · JetBrains Mono (data) ·
                Cormorant Garamond italic (the "(r)" and the human
                voice) — all three are the app's own faces and are
                web-licensed on Google Fonts, imported below.
                The deck's display face is a rounded geometric sans
                that isn't web-licensed; headings stack
                "Product Sans" first and fall back to Poppins,
                the closest licensed cut. */

const __RLV_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@1,500&family=Poppins:wght@500;600;700&display=swap');

  /* free the page from the constrained canvas — full-bleed bands */
  body.releve-mode .canvas { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  /* a transformed ancestor would hijack the rail's position:fixed */
  body.releve-mode .page-enter { animation: none !important; }
  body.releve-mode .atmosphere, body.releve-mode .grain { display: none; }
  body.releve-mode { background: #000; /* stage black — sampled releve-2 */ }

  /* header protection: backdrop blur only (no bar); every band here is
     dark, so the scroll handler keeps items inverted the whole way down */
  body.releve-mode .topbar::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    -webkit-mask-image: linear-gradient(#000 60%, transparent);
    mask-image: linear-gradient(#000 60%, transparent);
  }
  body.releve-mode .topbar > * { position: relative; z-index: 1; }
  body.releve-mode.releve-head-invert .topbar .logo { color: #f0f0f0; }
  body.releve-mode.releve-head-invert .nav-link { color: rgba(240,240,240,0.6); }
  body.releve-mode.releve-head-invert .nav-link:hover,
  body.releve-mode.releve-head-invert .nav-link.active { color: #f0f0f0; }

  .rlvx {
    --stage: #000000;       /* sampled releve-2 · slide bg */
    --bgapp: #080808;       /* prototype C.bg */
    --card: #111114;        /* prototype C.card */
    --card-hi: #18181c;     /* prototype C.cardHi */
    --line: rgba(255,255,255,0.07);   /* prototype C.border */
    --line-hi: rgba(255,255,255,0.14);
    --text: #f0f0f0;        /* prototype C.text */
    --dim: rgba(255,255,255,0.45);    /* prototype C.dim */
    --purple: #7B6EF6;      /* prototype C.purple */
    --pink: #D455A8;        /* prototype C.pink */
    --green: #4EC994;       /* prototype C.green */
    --magenta: #E040A0;     /* prototype score-ring stop */
    --violet: #5B3FE8;      /* prototype score-ring stop */
    --peach: #F4A77A;       /* prototype score-ring stop */
    --ablue: #323ac4;       /* sampled releve cover · aurora blue */
    --acoral: #fcac9e;      /* sampled releve cover · aurora coral */
    --grad: linear-gradient(135deg, var(--pink), var(--purple)); /* prototype C.grad */
    --rl-display: "Product Sans", "Poppins", "Inter", system-ui, sans-serif;
    --rl-body: "Inter", "Helvetica Neue", system-ui, sans-serif;
    --rl-mono: "JetBrains Mono", "SF Mono", ui-monospace, monospace;
    --rl-serif: "Cormorant Garamond", "Times New Roman", serif;
    font-family: var(--rl-body); color: var(--text); background: var(--stage);
  }

  /* focus is brand-colored and visible everywhere on the dark stage */
  .rlvx :focus-visible { outline: 2px solid var(--purple); outline-offset: 3px; border-radius: 4px; }

  .rl-wrap { max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 72px) 0 clamp(24px, 15vw, 240px); }
  @media (max-width: 1100px){ .rl-wrap { padding-left: clamp(24px, 5vw, 72px); } }

  /* ── left rail ── */
  .rl-rail { position: fixed; left: 36px; top: 50%; transform: translateY(-50%);
    z-index: 30; display: flex; flex-direction: column; gap: 20px;
    mix-blend-mode: difference; }
  @media (max-width: 1100px){ .rl-rail { display: none; } }
  .rl-rail button { display: flex; align-items: center; gap: 12px; background: none;
    border: none; padding: 0; cursor: pointer; font-family: var(--rl-mono);
    font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #fff; opacity: .8; transition: opacity .2s ease; }
  .rl-rail button:hover { opacity: 1; }
  .rl-rail button::before { content: ""; width: 22px; height: 1.5px; background: #fff;
    transition: width .25s var(--ease-out); }
  .rl-rail button:hover::before { width: 40px; }

  /* ── section scaffolding — rounded chips, the product is rounded throughout ── */
  .rl-sec { padding: 96px 0 110px; }
  .rl-sec.stage { background: var(--stage); }
  .rl-sec.app { background: var(--bgapp); }
  .rl-chip { display: inline-block; font-family: var(--rl-mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--text);
    border: 1px solid var(--line-hi); border-radius: 999px; padding: 8px 16px;
    margin-bottom: 30px; opacity: .9; }
  .rl-count { font-family: var(--rl-mono); font-size: 10px; letter-spacing: 0.1em;
    background: var(--grad); color: #fff; padding: 8px 14px; border-radius: 999px;
    margin-left: 12px; display: inline-block; vertical-align: baseline; margin-bottom: 30px; }
  .rl-h2 { font-family: var(--rl-display); font-weight: 700; letter-spacing: -0.03em;
    font-size: clamp(38px, 6.4vw, 92px); line-height: 1.0; margin: 0 0 28px; max-width: 16ch; }
  .rl-h2 em { font-family: var(--rl-serif); font-style: italic; font-weight: 500;
    font-size: 1.12em; letter-spacing: -0.01em; }
  .rl-lede { font-size: clamp(16px, 1.6vw, 19px); line-height: 1.65; max-width: 58ch;
    margin: 0 0 54px; color: var(--dim); }
  .rl-lede strong { color: var(--text); font-weight: 600; }

  /* ── hero — the black stage, aurora behind, ghost slogan scrolling ── */
  .rl-hero { position: relative; background: var(--stage); overflow: hidden;
    padding: 150px 0 100px; }
  /* aurora — the deck's gradient atmosphere, rebuilt from sampled stops.
     transform-only drift, and it sits behind everything. */
  .rl-aurora { position: absolute; top: -22%; right: -14%; width: 68vw; height: 68vw;
    max-width: 980px; max-height: 980px; border-radius: 50%; pointer-events: none;
    background:
      radial-gradient(closest-side at 62% 36%, rgba(252,172,158,0.42), transparent 62%),
      radial-gradient(closest-side at 40% 60%, rgba(224,64,160,0.5), transparent 64%),
      radial-gradient(closest-side at 58% 76%, rgba(50,58,196,0.55), transparent 66%);
    filter: blur(54px); opacity: .85;
    animation: rlDrift 26s ease-in-out infinite alternate; }
  @keyframes rlDrift { to { transform: translate(-7%, 6%) rotate(14deg) scale(1.08); } }
  .rl-ghost { position: absolute; top: 96px; left: 0; white-space: nowrap;
    font-family: var(--rl-display); font-weight: 700; letter-spacing: -0.02em;
    font-size: clamp(110px, 22vw, 300px); line-height: 1;
    color: rgba(240,240,240,0.045); pointer-events: none; user-select: none;
    display: flex; width: max-content; animation: rlGhost 70s linear infinite; }
  @keyframes rlGhost { to { transform: translateX(-50%); } }
  .rl-hero .rl-wrap { position: relative; }
  .rl-back { font-family: var(--rl-mono); font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--text); background: rgba(255,255,255,0.06);
    border: 1px solid var(--line-hi); border-radius: 999px; padding: 9px 18px;
    cursor: pointer; margin-bottom: 44px; transition: background .2s ease; }
  .rl-back:hover { background: rgba(255,255,255,0.14); }
  .rl-eyebrow { font-family: var(--rl-mono); font-size: 11.5px; letter-spacing: 0.32em;
    text-transform: uppercase; margin-bottom: 30px;
    background: var(--grad); -webkit-background-clip: text; background-clip: text;
    color: transparent; width: max-content; max-width: 100%; }
  .rl-h1 { font-family: var(--rl-display); font-weight: 700; letter-spacing: -0.035em;
    font-size: clamp(46px, 8.4vw, 128px); line-height: 0.98; margin: 0 0 40px; max-width: 13ch; }
  .rl-h1 em { font-family: var(--rl-serif); font-style: italic; font-weight: 500;
    font-size: 1.1em; letter-spacing: -0.01em;
    background: linear-gradient(100deg, var(--peach), var(--magenta) 45%, var(--purple));
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .rl-hero-sub { font-size: clamp(17px, 1.8vw, 21px); line-height: 1.6;
    color: rgba(240,240,240,0.78); max-width: 54ch; margin: 0 0 44px; }
  /* hero CTA — the app's own signature component: the gradient pill
     (upload FAB + primary buttons share this exact fill, radius and glow) */
  .rl-cta { display: inline-flex; align-items: center; gap: 12px;
    background: var(--grad); color: #fff; border: none; border-radius: 999px;
    padding: 17px 30px; font-family: var(--rl-body); font-size: 15px; font-weight: 600;
    letter-spacing: 0.01em; cursor: pointer;
    box-shadow: 0 8px 20px rgba(224,64,160,0.4), 0 4px 10px rgba(91,63,232,0.35); /* prototype FAB shadow */
    transition: transform .2s var(--ease-out); }
  .rl-cta:hover { transform: translateY(-2px); }
  .rl-cta:active { transform: scale(0.98); }
  .rl-cta .arr { font-family: var(--rl-mono); }
  .rl-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 44px; }
  .rl-hero-chip { font-family: var(--rl-mono); font-size: 10.5px; padding: 8px 15px;
    border: 1px solid var(--line-hi); border-radius: 999px; color: rgba(240,240,240,0.8); }
  .rl-hero-chip b { color: var(--text); font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; font-size: 9px; margin-right: 6px; }

  /* ── screens — the product is the point: live build + real artifacts ── */
  .rl-wide { max-width: 1500px; margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 48px); display: flex; flex-direction: column;
    gap: clamp(40px, 6vw, 88px); }
  .rl-shot { border: 1px solid var(--line-hi); border-radius: 20px; overflow: hidden;
    line-height: 0; background: var(--stage); }
  .rl-shot.bare { border: none; border-radius: 24px; background: transparent; }
  .rl-shot img { width: 100%; height: auto; display: block; }
  .rl-cap { font-family: var(--rl-mono); font-size: 10px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--dim); line-height: 1.6; padding: 14px 2px 0;
    text-align: center; }
  .rl-duo { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 4vw, 56px);
    max-width: 980px; margin: 0 auto; width: 100%; }
  @media (max-width: 640px){ .rl-duo { grid-template-columns: 1fr; } }

  /* the live prototype — the app in its own phone shell, running in demo mode */
  .rl-proto { display: flex; flex-direction: column; align-items: center; }
  .rl-proto-kicker { font-family: var(--rl-mono); font-size: 10.5px; letter-spacing: 0.24em;
    text-transform: uppercase; margin-bottom: 22px; display: inline-flex;
    align-items: center; gap: 10px; color: var(--text); }
  .rl-proto-kicker::before { content: ""; width: 8px; height: 8px; border-radius: 4px;
    background: var(--green); /* prototype C.green — the "live" dot */ }
  .rl-phone { width: min(393px, calc(100vw - 48px)); height: 820px; border-radius: 55px;
    /* the prototype's own shell: 393px, radius 55, hairline border — read from its CSS */
    border: 2px solid rgba(255,255,255,0.1); overflow: hidden; background: #000;
    box-shadow: 0 40px 120px rgba(0,0,0,0.9), 0 0 90px rgba(91,63,232,0.18); }
  .rl-phone iframe { width: 100%; height: 100%; border: 0; display: block; background: #000; }
  @media (max-width: 460px){ .rl-phone { height: 74vh; min-height: 560px; border-radius: 36px; } }

  /* ── process — four beats ── */
  .rl-process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  @media (max-width: 960px){ .rl-process { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .rl-process { grid-template-columns: 1fr; } }
  .rl-phase { border-top: 2.5px solid var(--purple); padding-top: 18px; }
  .rl-phase:nth-child(2n) { border-top-color: var(--pink); }
  .rl-phase .k { font-family: var(--rl-mono); font-size: 9.5px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--dim); margin-bottom: 10px; }
  .rl-phase h4 { font-family: var(--rl-display); font-weight: 600; letter-spacing: -0.01em;
    font-size: 19px; margin: 0 0 10px; }
  .rl-phase p { font-size: 14px; line-height: 1.62; margin: 0; color: var(--dim); }

  /* ── decisions + ownership (last dark band) ── */
  .rl-decisions { display: flex; flex-direction: column; margin-bottom: 72px; }
  .rl-decision { display: grid; grid-template-columns: 90px 1fr; gap: 0 32px;
    padding: 34px 0; border-top: 1px solid var(--line-hi); }
  .rl-decision:last-child { border-bottom: 1px solid var(--line-hi); }
  .rl-dec-num { font-family: var(--rl-display); font-weight: 700; letter-spacing: -0.04em;
    font-size: clamp(40px, 5vw, 68px); line-height: 1; user-select: none; padding-top: 4px;
    background: linear-gradient(135deg, rgba(212,85,168,0.35), rgba(123,110,246,0.35));
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .rl-dec-title { font-family: var(--rl-display); font-weight: 600; letter-spacing: -0.015em;
    font-size: clamp(18px, 2vw, 23px); margin: 0 0 12px; line-height: 1.2; }
  .rl-dec-p { font-size: 15px; line-height: 1.68; margin: 0; color: var(--dim); }
  .rl-dec-p strong { color: var(--text); font-weight: 600; }
  @media (max-width: 560px){ .rl-decision { grid-template-columns: 48px 1fr; gap: 0 20px; } }
  .rl-own { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 24px; margin-bottom: 28px; }
  @media (max-width: 860px){ .rl-own { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px){ .rl-own { grid-template-columns: 1fr; } }
  .rl-own-item { border-top: 2.5px solid; border-image: var(--grad) 1; padding-top: 16px; }
  .rl-own-item h4 { font-family: var(--rl-display); font-weight: 600; letter-spacing: -0.01em;
    font-size: 15.5px; margin: 0 0 8px; }
  .rl-own-item p { font-size: 14px; line-height: 1.6; margin: 0; color: var(--dim); }
  .rl-collab { font-family: var(--rl-mono); font-size: 11.5px; color: var(--dim);
    margin: 0; line-height: 1.7; max-width: 88ch; }

  /* portfolio footer on the dark band */
  .rlvx .pf-label { color: rgba(240,240,240,0.5); }
  .rlvx .pf-next-link { color: var(--text); }
  .rlvx .pf-next-link:hover { color: var(--pink); }
  .rlvx .pf-pill { background: transparent; color: var(--text); border-color: var(--line-hi); }
  .rlvx .pf-pill:hover { color: var(--purple); border-color: var(--purple); }

  /* motion asks permission — every animation on this page is transform-only */
  @media (prefers-reduced-motion: reduce) {
    .rl-ghost, .rl-aurora { animation: none !important; }
    .rlvx * { transition-duration: 0.01ms !important; }
  }
`;

const RLV_PHASES = [
  {
    k: "research · 01", h: "The gap, named",
    p: "Studio observation and the Queensland University study pointed at the same moment: dancers enter \"a state of disbelief at what they observed\", the gap between what they felt and what they did. Naming that gap became the product thesis.",
  },
  {
    k: "personas · 02", h: "Six dancers, one spectrum",
    p: "Six dancers from Emma, 16 (RAD exam in 23 days, £85 on the line) to Mayara, 36 (corps de ballet, 0.1-second precision). All needed the same thing: specific, timestamped corrections they could revisit.",
  },
  {
    k: "build · 03", h: "Six layers, one database",
    p: "Capture → Pose → Smooth → Rules → Persist → Present. MediaPipe reads 33 landmarks per frame; per-exercise analysers measure them against RAD-calibrated ranges; every threshold and cue lives in one ballet_database.json.",
  },
  {
    k: "test · 04", h: "Six pairs of eyes, one demi-plié",
    p: "Moderated sessions with the same exercise across all six dancers, tuning thresholds until corrections matched what a teacher in the room would say, then rewriting the cues until they sounded like her too.",
  },
];

const RLV_DECISIONS = [
  {
    title: "Metrics first",
    body: "The default was dataset-first: label hundreds of videos, train a model to imitate the labels. I refused it. The engine measures MediaPipe landmarks against joint-angle ranges tied directly to the RAD syllabus. Every correction is a rule you can read, instead of a pattern guessed from examples. Transparent to a teacher, defensible in a studio, and viable without a dataset that doesn't exist.",
  },
  {
    title: "Kill false positives before they speak",
    body: "A tool that cries wolf teaches dancers to ignore it. Pose estimation jitters, limbs occlude, one frame can look catastrophic and mean nothing. So the engine gates on landmark visibility, requires errors to hold across a window of frames, separates on/off thresholds with hysteresis, and smooths raw angles with moving averages. None of it shows in the report. Invisible engineering is what makes the visible output trustworthy.",
  },
  {
    title: "Corrections speak like a teacher",
    body: "Every cue is bilingual (EN/PT), timestamped to the exact moment, and phrased as an action instead of a judgment: \"rotate the knees over the 2nd and 3rd toes, actively pushing them outward.\" No rank, no leaderboard, no red F. The deck's rule made it into the database schema itself: information without judgment.",
  },
  {
    title: "Encode real ballet, competing forces and all",
    body: "Corrections aren't a checklist. Opening the shoulders can pop the ribs forward, so the system encodes them as simultaneous, opposing rules instead of \"fix shoulders, then ribs.\" Details came straight from a teacher: the head sits 5–10° above horizontal, where a naive model would assume parallel to the floor. These are what separate a tool that works from one a teacher would endorse.",
  },
  {
    title: "A dark stage, a warm voice",
    body: "The interface is the studio after hours: near-black surfaces, hairline borders, mono data. Then aurora gradients and a Cormorant italic for everything human: your name, your level, the word practise. Precision is a form of care; the UI says both halves of that sentence.",
  },
];

const RLV_OWN = [
  { h: "Product design", p: "The full app (home, upload flow, analysis view, progress) plus the design language: stage black, aurora, the bilingual correction card." },
  { h: "Correction engine", p: "Per-exercise analysers with phase detection, visibility gating, N-of-M logic, hysteresis and EMA smoothing. Plié fully built with 9 triggers." },
  { h: "ballet_database.json", p: "The single source of truth: 16 exercises, 47 corrections, every threshold and every EN/PT cue, shared by engine, app and coursework." },
  { h: "Front-end build", p: "The React prototype embedded above: timeline scrubbing, skeleton diagrams per correction, score ring, session history." },
  { h: "Backend & infra", p: "Flask upload/analysis API, MediaPipe pipeline, Supabase (auth + Postgres) with Teacher/Student roles, video in R2/S3 object storage." },
  { h: "Research & testing", p: "Studio observation, six personas, the user-testing protocol. 83% task success, 4.4/5 usability, and six dancers who'd use it again." },
];

function RlvScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function RlvCase({ spec, onAsk }) {
  useEffectRlv(() => {
    document.body.classList.add("releve-mode");
    /* header items invert while dark bands pass underneath — on this page
       every band is dark, but the mechanism matches the other case pages */
    const onScroll = () => {
      const y = 46;
      let invert = false;
      for (const s of document.querySelectorAll(".rl-hero, .rl-sec")) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) { invert = true; break; }
      }
      document.body.classList.toggle("releve-head-invert", invert);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("releve-mode", "releve-head-invert");
    };
  }, []);

  return (
    <div className="rlvx">
      <style>{__RLV_STYLE}</style>

      {/* rail */}
      <nav className="rl-rail" aria-label="sections">
        <button onClick={() => RlvScrollTo("rl-top")}>overview</button>
        <button onClick={() => RlvScrollTo("rl-screens")}>screens</button>
        <button onClick={() => RlvScrollTo("rl-process")}>process</button>
        <button onClick={() => RlvScrollTo("rl-decisions")}>decisions</button>
      </nav>

      {/* ── hero — black stage, aurora, the deck's slogan as ghost type ── */}
      <header className="rl-hero" id="rl-top">
        <div className="rl-aurora" aria-hidden="true"></div>
        <div className="rl-ghost" aria-hidden="true">
          {[0, 1].map((half) => (
            <span key={half} style={{ paddingRight: "0.6em" }}>They say dancers are graceful.&nbsp;✦&nbsp;</span>
          ))}
        </div>
        <div className="rl-wrap">
          <button className="rl-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="rl-eyebrow">elisava capstone · (r)elevē · 2026</div>
          <h1 className="rl-h1">Close the gap between <em>feeling</em> and <em>reality.</em></h1>
          <p className="rl-hero-sub">
            Ballet lives in millimetres, but its feedback hasn't changed in a century: a
            teacher's eye, a mirror, a voice across the room, gone by tomorrow. (r)elevē
            reads 33 body landmarks from a video, measures them against the RAD syllabus,
            and returns corrections a teacher would endorse. Timestamped, replayable,
            in English and Portuguese.
          </p>
          <button className="rl-cta" onClick={() => RlvScrollTo("rl-proto")} aria-label="open the live prototype">
            Open the live prototype <span className="arr">↓</span>
          </button>
          <div className="rl-hero-meta">
            <span className="rl-hero-chip"><b>role</b>designer + engineer · solo</span>
            <span className="rl-hero-chip"><b>company</b>elisava</span>
            <span className="rl-hero-chip"><b>platforms</b>web app · mobile-first</span>
            <span className="rl-hero-chip"><b>timeline</b>capstone · 2026</span>
          </div>
        </div>
      </header>

      {/* ── 01 · the screens — the product on stage, live build included ── */}
      <section className="rl-sec app" id="rl-screens">
        <div className="rl-wrap">
          <span className="rl-chip">the screens · 01</span><span className="rl-count">live build + artifacts</span>
          <h2 className="rl-h2">The product, <em>on stage.</em></h2>
          <p className="rl-lede">
            Everything below is the real thing: the shipped deck and the working prototype,
            <strong> running live in demo mode</strong>. Pick an exercise, upload any video,
            and walk the same analysis flow the dancers tested.
          </p>
        </div>

        <div className="rl-wide">
          {/* the composed product shot — frameless, the slide already stages the device */}
          <figure style={{ margin: 0 }}>
            <div className="rl-shot bare"><img src="releve-1.jpg" alt="(r)elevē demo slide: the app's home screen with technique score 48/100, exam countdown and session history, staged over an aurora gradient" loading="lazy" /></div>
            <figcaption className="rl-cap">demo · composed shot · home screen, score ring, session history</figcaption>
          </figure>

          {/* ← the centerpiece: the app itself, in its own shell */}
          <figure className="rl-proto" id="rl-proto" style={{ margin: 0 }}>
            <span className="rl-proto-kicker">live prototype · demo mode, click through it</span>
            <div className="rl-phone">
              <iframe src="releve-proto.html" title="(r)elevē live prototype · ballet correction app" loading="lazy"></iframe>
            </div>
            <figcaption className="rl-cap">prototype · live build · upload → analysis → timestamped corrections</figcaption>
          </figure>

        </div>
      </section>

      {/* ── 02 · process ── */}
      <section className="rl-sec stage" id="rl-process">
        <div className="rl-wrap">
          <span className="rl-chip">the process · 02</span>
          <h2 className="rl-h2">Twenty years at the barre, <em>one capstone.</em></h2>
          <p className="rl-lede">
            I danced for two decades before I designed this. The process ran research →
            personas → build → test, but the domain knowledge, what a correction sounds
            like when it lands, was the real method.
          </p>
          <div className="rl-process">
            {RLV_PHASES.map((f, i) => (
              <div className="rl-phase" key={i}>
                <div className="k">{f.k}</div>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · decisions + 04 · ownership ── */}
      <section className="rl-sec app" id="rl-decisions">
        <div className="rl-wrap">
          <span className="rl-chip">the decisions · 03</span>
          <h2 className="rl-h2">Objective where it measures, <em>human</em> where it speaks.</h2>
          <div className="rl-decisions">
            {RLV_DECISIONS.map((d, i) => (
              <div className="rl-decision" key={i}>
                <div className="rl-dec-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="rl-dec-title">{d.title}</div>
                  <p className="rl-dec-p">{d.body}</p>
                </div>
              </div>
            ))}
          </div>

          <span className="rl-chip">ownership · 04</span>
          <h2 className="rl-h2" style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}>What I owned.</h2>
          <div className="rl-own">
            {RLV_OWN.map((f, i) => (
              <div className="rl-own-item" key={i}>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
          <p className="rl-collab" style={{ marginBottom: 72 }}>
            A solo capstone: design, engine, data and front-end were mine. Calibration
            leaned on a RAD teacher (the 5–10° head rule is hers), ELISAVA advisors framed
            the research, and six dancers lent their demi-pliés to the testing sessions.
          </p>

          <NextProjectFooter currentId="releve" onAsk={onAsk} />
        </div>
      </section>
    </div>
  );
}

if (typeof LAYOUTS !== "undefined") LAYOUTS["releve-case"] = RlvCase;

Object.assign(window, { RlvCase });
