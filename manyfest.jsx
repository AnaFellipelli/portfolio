/* ════════════════════════════════════════════════════════════
   manyfest.jsx — Manychat Design System case study.
   Immersive landing-page treatment mirroring manyfest.netlify.app:
   yellow grid hero, left rail, numbered section chips, colored
   pillar cards — but single-page: pillars open as an accordion
   instead of navigating to subpages. Components render LIVE from
   the file's own variables (no screenshots).
   Registers LAYOUTS["manyfest-case"].
   ════════════════════════════════════════════════════════════ */

const { useState: useStateMnf, useEffect: useEffectMnf } = React;

const __MNF_STYLE = `
  /* free the page from the constrained canvas — full-bleed sections */
  body.mnf-mode .canvas { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  /* a transformed ancestor would hijack the rail's position:fixed */
  body.mnf-mode .page-enter { animation: none !important; }

  /* header protection: pure backdrop blur (no bar), and the logo + nav
     invert against whatever passes underneath via blend mode */
  body.mnf-mode .topbar::before {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    z-index: 0; /* keep the blur BEHIND the menu items */
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
    -webkit-mask-image: linear-gradient(#000 60%, transparent);
    mask-image: linear-gradient(#000 60%, transparent);
  }
  /* lift the actual header items above the blur layer */
  body.mnf-mode .topbar > * { position: relative; z-index: 1; }
  /* items adapt to the band currently under the header (scroll-driven) */
  body.mnf-mode .topbar .logo { color: var(--ink); transition: color .3s ease; }
  body.mnf-mode .nav-link { color: rgba(15,15,14,0.6); transition: color .3s ease; }
  body.mnf-mode .nav-link:hover, body.mnf-mode .nav-link.active { color: #0f0f0e; }
  body.mnf-mode.mnf-head-invert .topbar .logo { color: #fff; }
  body.mnf-mode.mnf-head-invert .nav-link { color: rgba(255,255,255,0.72); }
  body.mnf-mode.mnf-head-invert .nav-link:hover,
  body.mnf-mode.mnf-head-invert .nav-link.active { color: #fff; }
  body.mnf-mode .atmosphere, body.mnf-mode .grain { display: none; }
  body.mnf-mode { background: #f4f4f4; /* color/surface/canvas */ }

  /* every color below is a manyfest token — no invented values */
  .mnf { --brand: #8040cf;          /* color/action/brand */
    --cream: #f4f4f4;               /* color/surface/canvas */
    --ink: #0f0f0e;                 /* color/action/primary · text-icon/primary */
    --card-color: #8040cf;          /* action/brand */
    --card-type: #3232b8;           /* status/info */
    --card-found: #eae8e2;          /* action/secondary */
    --card-voice: #bf2810;          /* action/destructive */
    font-family: var(--sans); color: var(--ink); }

  .mnf-grid-bg {
    background-image:
      linear-gradient(rgba(13,13,13,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,13,13,0.07) 1px, transparent 1px);
    background-size: 164px 164px;
  }

  /* content column — leaves room for the fixed rail */
  .mnf-wrap { max-width: 1280px; margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 72px) 0 clamp(24px, 15vw, 240px); }
  @media (max-width: 1100px){ .mnf-wrap { padding-left: clamp(24px, 5vw, 72px); } }

  /* ── left rail ── */
  .mnf-rail { position: fixed; left: 36px; top: 50%; transform: translateY(-50%);
    z-index: 30; display: flex; flex-direction: column; gap: 20px;
    mix-blend-mode: difference; /* readable on yellow, cream, and ink alike */ }
  @media (max-width: 1100px){ .mnf-rail { display: none; } }
  .mnf-rail button { display: flex; align-items: center; gap: 12px; background: none;
    border: none; padding: 0; cursor: pointer;
    font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.18em;
    text-transform: uppercase; color: #fff; opacity: .8; transition: opacity .2s ease; }
  .mnf-rail button:hover { opacity: 1; }
  .mnf-rail button::before { content: ""; width: 22px; height: 1.5px; background: #fff;
    transition: width .25s var(--ease-out); }
  .mnf-rail button:hover::before { width: 40px; }

  /* ── hero ── */
  .mnf-hero { position: relative; background: var(--brand); /* color/action/brand */
    color: #fff; overflow: hidden; padding: 150px 0 96px; }
  .mnf-hero.mnf-grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px);
    background-size: 164px 164px; /* the shorthand above was resetting this */
  }
  .mnf-hero .mnf-eyebrow, .mnf-hero .mnf-h1, .mnf-hero .mnf-hero-sub { color: #fff; }
  .mnf-hero .mnf-back { color: #fff; background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.45); }
  .mnf-hero .mnf-back:hover { background: rgba(255,255,255,0.25); }
  .mnf-hero .mnf-hero-chip { border-color: rgba(255,255,255,0.5); color: #fff; }
  .mnf-hero .mnf-cta { background: var(--ink); color: #fff; }
  .mnf-hero .mnf-cta:hover { background: #242422; /* action/primary-hover */ }
  .mnf-hero .mnf-wrap { position: relative; }
  .mnf-back { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--ink); background: rgba(255,255,255,0.5);
    border: 1px solid rgba(13,13,13,0.2); border-radius: 999px; padding: 9px 16px;
    cursor: pointer; margin-bottom: 44px; transition: background .2s ease; }
  .mnf-back:hover { background: rgba(255,255,255,0.85); }
  .mnf-eyebrow { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--ink); margin-bottom: 30px; }
  .mnf-h1 { font-family: var(--display); font-weight: 900; letter-spacing: -0.03em;
    font-size: clamp(52px, 9.5vw, 148px); line-height: 0.92; color: var(--ink);
    margin: 0 0 42px; max-width: 12ch; }
  .mnf-hero-sub { font-size: clamp(17px, 1.8vw, 22px); line-height: 1.55; color: var(--ink);
    max-width: 52ch; margin: 0 0 44px; }
  .mnf-cta { font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: #fff; background: var(--ink); border: none;
    border-radius: 999px; padding: 20px 34px; cursor: pointer;
    transition: transform .2s var(--ease-out), background .2s ease; }
  .mnf-cta:hover { transform: translateY(-2px); background: #2a2a26; }
  .mnf-hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; }
  .mnf-hero-chip { font-family: var(--mono); font-size: 10.5px; border-radius: 999px;
    padding: 7px 14px; border: 1px solid rgba(13,13,13,0.35); color: var(--ink); }
  .mnf-hero-chip b { font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    font-size: 9px; margin-right: 6px; }

  /* reaction pills */
  .mnf-react { position: absolute; background: #fff; border: 1px solid rgba(13,13,13,0.25);
    border-radius: 999px; padding: 11px 20px; font-family: var(--sans); font-weight: 600;
    font-size: 15px; color: var(--ink); white-space: nowrap; pointer-events: none;
    box-shadow: 0 10px 24px -14px rgba(13,13,13,0.4);
    animation: mnfFloat var(--fd, 5s) ease-in-out infinite; }
  @keyframes mnfFloat { 0%,100%{ transform: translateY(0) rotate(var(--r,0deg)); }
    50%{ transform: translateY(-9px) rotate(var(--r,0deg)); } }
  @media (max-width: 900px){ .mnf-react { display: none; } }

  /* ── section scaffolding ── */
  .mnf-sec { padding: 96px 0 110px; }
  .mnf-sec.cream { background: var(--cream); }
  .mnf-sec.dark { background: var(--ink); color: #f4f0e6; }
  .mnf-chip { display: inline-block; font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase; color: inherit;
    border: 1px solid currentColor; border-radius: 6px; padding: 8px 14px; margin-bottom: 30px; opacity: .85; }
  .mnf-h2 { font-family: var(--display); font-weight: 900; letter-spacing: -0.03em;
    font-size: clamp(44px, 7.5vw, 110px); line-height: 0.94; margin: 0 0 28px; max-width: 14ch; }
  .mnf-sec-sub { font-size: clamp(16px, 1.6vw, 20px); line-height: 1.6; max-width: 54ch;
    margin: 0 0 54px; opacity: .85; }

  /* ── pillars accordion ── */
  .mnf-pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  @media (max-width: 760px){ .mnf-pillars { grid-template-columns: 1fr; } }
  .mnf-pillar { border: none; border-radius: 18px; padding: 30px 30px 26px; text-align: left;
    cursor: pointer; min-height: 210px; display: flex; flex-direction: column;
    transition: transform .3s var(--ease-out), box-shadow .3s ease; position: relative; }
  .mnf-pillar:hover { transform: translateY(-4px); box-shadow: 0 24px 44px -26px rgba(13,13,13,0.45); }
  .mnf-pillar h3 { font-family: var(--display); font-weight: 900; letter-spacing: -0.02em;
    font-size: clamp(26px, 3vw, 38px); margin: 0 0 12px; line-height: 1.02; }
  .mnf-pillar p { font-size: 15px; line-height: 1.55; margin: 0; opacity: .92; }
  .mnf-pillar .open-cta { margin-top: auto; padding-top: 22px; font-family: var(--mono);
    font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; }
  .mnf-pillar.is-open .open-cta .arr { display: inline-block; transform: rotate(90deg); }
  .mnf-pillar .arr { transition: transform .3s var(--ease-out); display: inline-block; }
  .mnf-pillar.p-color { background: var(--card-color); color: #fff; }
  .mnf-pillar.p-type { background: var(--card-type); color: #fff; }
  .mnf-pillar.p-found { background: var(--card-found); color: var(--ink); }
  .mnf-pillar.p-voice { background: var(--card-voice); color: #fff; }

  .mnf-panel { grid-column: 1 / -1; overflow: hidden;
    max-height: 0; opacity: 0; transition: max-height .55s var(--ease-out), opacity .4s ease; }
  .mnf-panel.open { max-height: 1400px; opacity: 1; }
  .mnf-panel-inner { border: 1.5px solid var(--ink); border-radius: 18px;
    padding: clamp(24px, 3.5vw, 44px); background: #fffdf6; margin-top: 2px; }
  .mnf-panel-inner.on-dark { background: #171713; border-color: #f4f0e6; color: #f4f0e6; }

  /* panel: color — the full palette */
  .mnf-pal-h { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; opacity: .55; margin: 28px 0 14px; padding-top: 22px;
    border-top: 1px solid rgba(13,13,13,0.1); }
  .mnf-pal-h:first-child { margin-top: 0; padding-top: 0; border-top: none; }
  .mnf-sw-row { display: flex; flex-wrap: wrap; gap: 12px; }
  .mnf-sw { width: 116px; }
  .mnf-sw .c { height: 44px; border-radius: 8px; border: 1px solid rgba(13,13,13,0.12); }
  .mnf-sw .n { font-family: var(--mono); font-size: 9px; margin-top: 7px; opacity: .8; }
  .mnf-sw .x { font-family: var(--mono); font-size: 8.5px; opacity: .5; margin-top: 2px; }
  .mnf-status-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  @media (max-width: 860px){ .mnf-status-grid { grid-template-columns: repeat(2, 1fr); } }
  .mnf-status .pair { display: flex; height: 44px; border-radius: 8px; overflow: hidden;
    border: 1px solid rgba(13,13,13,0.12); }
  .mnf-status .pair span { flex: 1; }
  .mnf-toks { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  @media (max-width: 720px){ .mnf-toks { grid-template-columns: repeat(2, 1fr); } }
  .mnf-tok-name { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: .7; margin-bottom: 10px; }
  .mnf-ramp { display: flex; border-radius: 10px; overflow: hidden; height: 46px;
    border: 1px solid rgba(13,13,13,0.1); }
  .mnf-ramp span { flex: 1; }
  .mnf-tok-hex { font-family: var(--mono); font-size: 9px; opacity: .65; margin-top: 8px; }
  .mnf-focus-line { margin-top: 22px; display: flex; align-items: center; gap: 12px;
    font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.08em; opacity: .8; }
  .mnf-focus-dot { width: 26px; height: 26px; border-radius: 8px; background: #fffdf6;
    outline: 2px solid #5555e8; outline-offset: 2px; }

  /* panel: typography */
  .mnf-type-display { font-family: var(--display); font-weight: 900; letter-spacing: -0.03em;
    font-size: clamp(34px, 5vw, 64px); line-height: 0.95; margin: 0 0 6px; }
  .mnf-type-cap { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: .6; margin-bottom: 26px; }
  .mnf-type-row { display: grid; grid-template-columns: 120px 1fr; gap: 20px; align-items: baseline;
    padding: 13px 0; border-top: 1px solid rgba(13,13,13,0.12); }
  .mnf-type-row .k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: .6; }

  /* panel: foundations */
  .mnf-found-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
  @media (max-width: 760px){ .mnf-found-grid { grid-template-columns: 1fr; } }
  .mnf-found-k { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: .7; margin-bottom: 14px; }
  .mnf-tt-row { display: flex; align-items: flex-end; gap: 14px; }
  .mnf-tt { background: var(--card-found); border: 1px solid rgba(13,13,13,0.2);
    border-radius: 10px; display: grid; place-items: end center;
    font-family: var(--mono); font-size: 9px; padding-bottom: 4px; }
  .mnf-sp-row { display: flex; align-items: flex-end; gap: 10px; }
  .mnf-sp { background: var(--card-type); border-radius: 3px; width: 18px; position: relative; }
  .mnf-sp i { position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
    font-family: var(--mono); font-style: normal; font-size: 8.5px; opacity: .65; padding-top: 5px; }
  .mnf-radius-demo { display: flex; gap: 14px; align-items: center; }
  .mnf-radius-pill { height: 44px; padding: 0 22px; border-radius: 9999px; background: var(--ink);
    color: #fff; display: inline-flex; align-items: center; font-family: var(--mono); font-size: 10px; }

  /* panel: voice — three principle cards from the brand site */
  .mnf-voice-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  @media (max-width: 760px){ .mnf-voice-grid { grid-template-columns: 1fr; } }
  .mnf-voice-card { border-radius: 16px; padding: 26px 24px; min-height: 190px; }
  .mnf-voice-card h4 { font-family: var(--display); font-weight: 900; letter-spacing: -0.015em;
    font-size: clamp(21px, 2.2vw, 27px); line-height: 1.05; margin: 0 0 14px; }
  .mnf-voice-card p { font-size: 14.5px; line-height: 1.6; margin: 0; opacity: .95; }
  .mnf-voice-card.vo { background: var(--card-type); color: #fff; }  /* status/info */
  .mnf-voice-card.vp { background: var(--brand); color: #fff; }      /* action/brand */
  .mnf-voice-card.vk { background: var(--ink); color: #fff; }        /* action/primary */

  /* ── components (dark band, live render) ── */
  .mnf-live-note { font-size: 15px; line-height: 1.65; margin: 0 0 40px; max-width: 62ch; opacity: .9; }
  .mnf-live-note strong { color: #b48ade; /* brand, lightened for dark bg */ }
  .mnf-live-note .tok { font-family: var(--mono); font-size: 10.5px; color: #b48ade;
    background: rgba(128,64,207,0.16); border-radius: 5px; padding: 2px 6px; white-space: nowrap; }
  .mnf-matrix-card { background: var(--cream); color: var(--ink); border-radius: 18px; overflow: hidden; }
  .mnf-matrix { display: grid; grid-template-columns: 92px repeat(4, auto) 1fr; gap: 16px 18px;
    align-items: center; justify-items: start; padding: 30px 28px 12px; }
  .mnf-mx-h { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.14em;
    text-transform: uppercase; opacity: .55; }
  .mnf-mx-row { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: .7; }
  .mnf-mx-na { font-family: var(--mono); font-size: 10px; opacity: .35; }
  @media (max-width: 860px){
    .mnf-matrix { grid-template-columns: 72px repeat(2, auto); }
    .mnf-matrix .col-3, .mnf-matrix .col-4 { display: none; }
  }
  .mnf-states { display: flex; flex-wrap: wrap; gap: 14px 18px; align-items: center;
    padding: 10px 28px 30px; }
  .mnf-live-foot { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.06em;
    opacity: .6; padding: 16px 28px; border-top: 1px solid rgba(13,13,13,0.15); line-height: 1.7; }

  /* the button — manyfest tokens, not portfolio tokens */
  .mnf-btn { font-family: var(--display); /* rooftop substituted */ font-weight: 700;
    font-size: 14px; line-height: 20px; height: 42px; padding: 0 16px;
    border-radius: 9999px; border: 1px solid transparent; cursor: pointer; white-space: nowrap;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    align-self: center; line-height: 1; /* optical center — flex handles the leading */
    transition: background .15s ease-out, color .15s ease-out,
      border-color .15s ease-out, opacity .2s ease-out, transform .1s ease-out; }
  .mnf-btn:active:not([aria-disabled]) { transform: scale(0.96); }
  .mnf-btn:focus-visible { outline: 2px solid #5555e8; outline-offset: 2px; }
  .mnf-btn[aria-disabled] { opacity: 0.4; cursor: default; }
  .mnf-btn.solid-primary { background: #0f0f0e; color: #fff; }
  .mnf-btn.solid-primary:hover:not([aria-disabled]) { background: #242422; }
  .mnf-btn.solid-primary:active:not([aria-disabled]) { background: #3c3c38; }
  .mnf-btn.solid-brand { background: #8040cf; color: #fff; }
  .mnf-btn.solid-brand:hover:not([aria-disabled]) { background: #6b30b8; }
  .mnf-btn.solid-brand:active:not([aria-disabled]) { background: #5520a0; }
  .mnf-btn.solid-secondary { background: #eae8e2; color: #0f0f0e; border-color: rgba(13,13,13,0.08); }
  .mnf-btn.solid-secondary:hover:not([aria-disabled]) { background: #dcdad4; }
  .mnf-btn.solid-secondary:active:not([aria-disabled]) { background: #b8b7af; }
  .mnf-btn.solid-destructive { background: #bf2810; color: #fff; }
  .mnf-btn.solid-destructive:hover:not([aria-disabled]) { background: #951c08; }
  .mnf-btn.solid-destructive:active:not([aria-disabled]) { background: #6b1004; }
  .mnf-btn.outline-primary { background: transparent; color: #0f0f0e; border-color: #0f0f0e; }
  .mnf-btn.outline-primary:hover { background: rgba(15,15,14,0.05); }
  .mnf-btn.outline-brand { background: transparent; color: #8040cf; border-color: #8040cf; }
  .mnf-btn.outline-brand:hover { background: rgba(128,64,207,0.07); }
  .mnf-btn.ghost-primary { background: transparent; color: #0f0f0e; }
  .mnf-btn.ghost-primary:hover { background: rgba(15,15,14,0.05); }
  .mnf-btn.ghost-brand { background: transparent; color: #8040cf; }
  .mnf-btn.ghost-brand:hover { background: rgba(128,64,207,0.07); }
  .mnf-btn.sz-sm { height: 32px; font-size: 12px; line-height: 16px; padding: 0 12px; }
  .mnf-btn.sz-lg { height: 48px; font-size: 16px; line-height: 24px; padding: 0 24px; }
  .mnf-spin { width: 16px; height: 16px; border-radius: 50%; flex: none;
    border: 2px solid currentColor; border-top-color: transparent;
    animation: mnfSpin .8s linear infinite; }
  @keyframes mnfSpin { to { transform: rotate(360deg); } }

  /* ── color + typography sections (mirroring /color and /typography) ── */
  .mnf-chip.sm { font-size: 10px; padding: 6px 11px; margin-bottom: 18px; }
  .mnf-count { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
    background: var(--ink); color: #fff; border-radius: 999px; padding: 7px 14px; margin-left: 14px;
    display: inline-block; vertical-align: baseline; margin-bottom: 30px; }
  .mnf-h3 { font-family: var(--display); font-weight: 900; letter-spacing: -0.025em;
    font-size: clamp(34px, 4.8vw, 68px); line-height: 0.98; margin: 0 0 18px; }
  .mnf-sub-p { font-size: 16px; line-height: 1.62; opacity: .8; max-width: 54ch; margin: 0 0 44px; }
  .mnf-sub-head { display: flex; align-items: center; margin: 74px 0 18px; }
  .mnf-sub-head .mnf-chip.sm { margin-bottom: 0; } /* keep chip + count pill on one baseline */

  /* primitives + semantic live under accordions — headers stay, styles expand */
  .mnf-acc { overflow: hidden; max-height: 0; opacity: 0;
    transition: max-height .6s var(--ease-out), opacity .4s ease; }
  .mnf-acc.open { max-height: 4200px; opacity: 1; }
  .mnf-acc-btn { font-family: var(--mono); font-size: 11px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase; color: #fff; background: var(--ink);
    border: none; border-radius: 999px; padding: 15px 26px; cursor: pointer;
    margin: 0 0 30px; display: inline-flex; align-items: center; gap: 10px;
    transition: transform .2s var(--ease-out), background .2s ease; }
  .mnf-acc-btn:hover { transform: translateY(-2px); background: #242422; }
  .mnf-acc-btn .arr { transition: transform .3s var(--ease-out); display: inline-block; }
  .mnf-acc-btn[aria-expanded="true"] .arr { transform: rotate(90deg); }

  .mnf-fam { margin-bottom: 36px; }
  .mnf-fam-h { display: flex; align-items: baseline; gap: 14px; margin-bottom: 12px; }
  .mnf-fam-h b { font-family: var(--display); font-weight: 900; font-size: 24px; letter-spacing: -0.01em; }
  .mnf-fam-h span { font-family: var(--mono); font-size: 10px; opacity: .55; }
  .mnf-fam-row { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; }
  @media (max-width: 900px){ .mnf-fam-row { grid-template-columns: repeat(5, 1fr); } }
  .mnf-prim { border-radius: 10px; min-height: 76px; padding: 9px 9px 8px;
    display: flex; flex-direction: column; justify-content: space-between;
    border: 1px solid rgba(13,13,13,0.08); }
  .mnf-prim b { font-size: 12.5px; font-weight: 700; }
  .mnf-prim i { font-family: var(--mono); font-size: 7.5px; font-style: normal; opacity: .85; }

  .mnf-sem-cols { display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 14px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    opacity: .6; padding: 12px 0; border-bottom: 1.5px solid rgba(13,13,13,0.25); }
  .mnf-sem-group { display: flex; align-items: baseline; gap: 12px; margin: 38px 0 4px; }
  .mnf-sem-group b { font-family: var(--display); font-weight: 900; font-size: 23px; }
  .mnf-sem-group span { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: .5; }
  .mnf-sem-row { display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid rgba(13,13,13,0.1); align-items: center; }
  @media (max-width: 800px){ .mnf-sem-cols { display: none; }
    .mnf-sem-row { grid-template-columns: 1fr; gap: 8px; } }
  .mnf-sem-row .t b { font-family: var(--mono); font-size: 11px; }
  .mnf-sem-row .t p { font-size: 12.5px; line-height: 1.5; opacity: .65; margin: 3px 0 0; }
  .mnf-sem-chip { display: inline-flex; align-items: center; gap: 10px; border-radius: 999px;
    padding: 8px 14px 8px 8px; border: 1px solid rgba(13,13,13,0.12); background: #fff; }
  .mnf-sem-chip.dk { background: #0f0f0e; color: #fafafa; border-color: transparent; }
  .mnf-sem-chip .dot { width: 24px; height: 24px; border-radius: 8px;
    border: 1px solid rgba(13,13,13,0.15); flex: none; }
  .mnf-sem-chip b { font-family: var(--mono); font-size: 10px; }
  .mnf-sem-chip i { font-family: var(--mono); font-size: 8.5px; opacity: .6; font-style: normal; }
  .mnf-map-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }

  /* divider ticker: color → typography */
  .mnf-divider { background: var(--ink); color: #fafafa; overflow: hidden; padding: 16px 0; }
  .mnf-divider-track { display: flex; white-space: nowrap; width: max-content;
    animation: mnfTicker 30s linear infinite; }
  .mnf-divider-item { font-family: var(--mono); font-size: 11px; letter-spacing: 0.24em;
    text-transform: uppercase; opacity: .85; padding-right: 8px; }
  @keyframes mnfTicker { to { transform: translateX(-50%); } }

  /* type voices — compact two-up: chip → specimen → one line each */
  .mnf-voices { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 5vw, 80px);
    align-items: stretch; }
  @media (max-width: 760px){ .mnf-voices { grid-template-columns: 1fr; gap: 40px; } }
  .mnf-voice-block { display: flex; flex-direction: column; } /* columns align row-for-row */
  .mnf-voice-block .spec { font-family: "Manychat Gravity", "Archivo Black", var(--display);
    font-weight: 900; letter-spacing: -0.02em; line-height: 0.98;
    font-size: clamp(30px, 3.2vw, 52px); margin: 0 0 12px; white-space: nowrap; overflow: hidden; }
  .mnf-voice-block .spec.spec-rt { /* rooftop set in rooftop, its own voice */
    font-family: "Rooftop", var(--sans); font-weight: 700; letter-spacing: -0.01em; }
  .mnf-voice-block .desc { font-size: 14px; line-height: 1.6; opacity: .72;
    margin: 0 0 18px; max-width: 40ch; }
  .mnf-voice-meta { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: .6; line-height: 1.8; margin: 0;
    margin-top: auto; /* hairline + meta bottom-align across both columns */
    border-top: 1px solid rgba(13,13,13,0.15); padding-top: 12px; }
  .mnf-scale-row { display: grid; grid-template-columns: 150px 1fr auto; gap: 24px;
    align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(13,13,13,0.12); }
  @media (max-width: 700px){ .mnf-scale-row { grid-template-columns: 90px 1fr auto; gap: 12px; } }
  .mnf-scale-row .k { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: .6; }
  .mnf-scale-row .v { overflow: hidden; white-space: nowrap; }
  .mnf-scale-row .m { font-family: var(--mono); font-size: 10px; opacity: .6; white-space: nowrap; }

  /* ── story / stats / decisions ── */
  .mnf-stats { display: grid; grid-template-columns: repeat(4, 1fr);
    border: 1.5px solid var(--ink); border-radius: 16px; overflow: hidden;
    margin: 0 0 64px; background: #fffdf6; }
  .mnf-stat { padding: 26px 22px; border-right: 1.5px solid var(--ink); }
  .mnf-stat:last-child { border-right: none; }
  .mnf-stat .n { font-family: var(--display); font-weight: 900; letter-spacing: -0.025em;
    font-size: clamp(28px, 3.5vw, 46px); line-height: 1; }
  .mnf-stat .n .acc { color: var(--card-type); }
  .mnf-tbd { font-family: var(--mono); font-size: 13px; font-weight: 700; letter-spacing: 0.08em;
    background: var(--cream); border: 1px solid rgba(13,13,13,0.25); border-radius: 6px;
    padding: 4px 10px; opacity: .7; vertical-align: middle; }
  .mnf-stat .l { font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
    text-transform: uppercase; opacity: .65; margin-top: 10px; line-height: 1.5; }
  @media (max-width: 680px){ .mnf-stats { grid-template-columns: repeat(2, 1fr); }
    .mnf-stat:nth-child(2) { border-right: none; }
    .mnf-stat:nth-child(1), .mnf-stat:nth-child(2) { border-bottom: 1.5px solid var(--ink); } }

  .mnf-context { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-bottom: 72px; }
  .mnf-context p { font-size: 16px; line-height: 1.68; margin: 0; opacity: .85; }
  @media (max-width: 720px){ .mnf-context { grid-template-columns: 1fr; gap: 22px; } }

  .mnf-decisions { display: flex; flex-direction: column; }
  .mnf-decision { display: grid; grid-template-columns: 90px 1fr; gap: 0 32px;
    padding: 34px 0; border-top: 1.5px solid rgba(13,13,13,0.25); }
  .mnf-decision:last-child { border-bottom: 1.5px solid rgba(13,13,13,0.25); }
  .mnf-dec-num { font-family: var(--display); font-weight: 900; letter-spacing: -0.04em;
    font-size: clamp(40px, 5vw, 68px); line-height: 1; color: rgba(13,13,13,0.18);
    user-select: none; padding-top: 4px; }
  .mnf-dec-title { font-family: var(--display); font-weight: 800; font-size: clamp(18px, 2.1vw, 23px);
    margin: 0 0 12px; line-height: 1.2; letter-spacing: -0.01em; }
  .mnf-dec-p { font-size: 15px; line-height: 1.68; margin: 0; opacity: .8; }
  @media (max-width: 560px){ .mnf-decision { grid-template-columns: 48px 1fr; gap: 0 20px; } }

  /* ── ownership + agents ── */
  .mnf-own { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 24px; margin-bottom: 40px; }
  @media (max-width: 860px){ .mnf-own { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 560px){ .mnf-own { grid-template-columns: 1fr; } }
  .mnf-own-item { border-top: 2.5px solid #b48ade; padding-top: 16px; }
  .mnf-own-item h4 { font-family: var(--display); font-weight: 800; font-size: 16px; margin: 0 0 8px; }
  .mnf-own-item p { font-size: 14px; line-height: 1.6; margin: 0; opacity: .75; }
  .mnf-collab { font-family: var(--mono); font-size: 11.5px; opacity: .6;
    margin: 0 0 64px; line-height: 1.7; max-width: 88ch; }

  .mnf-agents { border: 1.5px solid #f4f0e6; border-radius: 16px; overflow: hidden; }
  .mnf-ag-head { border-bottom: 1.5px solid #f4f0e6; padding: 14px 22px;
    display: flex; align-items: center; gap: 10px; }
  .mnf-ag-head-label { font-family: var(--mono); font-size: 10px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase; }
  .mnf-ag-count { font-family: var(--mono); font-size: 10px; border: 1px solid #f4f0e6;
    padding: 2px 8px; border-radius: 999px; }
  .mnf-ag-group { display: grid; grid-template-columns: 210px 1fr; border-top: 1px solid rgba(244,240,230,0.3); }
  .mnf-ag-group:first-of-type { border-top: none; }
  .mnf-ag-grouplabel { font-family: var(--mono); font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; padding: 16px 22px; opacity: .65;
    border-right: 1px solid rgba(244,240,230,0.3); }
  .mnf-ag-items { padding: 14px 22px; display: flex; flex-wrap: wrap; gap: 7px; align-items: center; }
  .mnf-ag-chip { font-family: var(--mono); font-size: 11px; color: #b48ade;
    background: rgba(128,64,207,0.14); border: 1px solid rgba(128,64,207,0.45);
    padding: 4px 10px; border-radius: 6px; }
  @media (max-width: 640px){ .mnf-ag-group { grid-template-columns: 1fr; }
    .mnf-ag-grouplabel { border-right: none; border-bottom: 1px solid rgba(244,240,230,0.3); } }

  /* ── accessibility ── */
  .mnf-axx { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 34px; }
  @media (max-width: 900px){ .mnf-axx { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px){ .mnf-axx { grid-template-columns: 1fr; } }
  .mnf-ax { background: #fff; /* color/surface/default */ border: 1.5px solid var(--ink);
    border-radius: 16px; padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 10px; }
  .mnf-ax .tag { font-family: var(--mono); font-size: 9px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--brand); }
  .mnf-ax h4 { font-family: var(--display); font-weight: 800; font-size: 17.5px;
    letter-spacing: -0.01em; margin: 0; line-height: 1.15; }
  .mnf-ax p { font-size: 13.5px; line-height: 1.58; margin: 0; opacity: .75; }
  .mnf-ax .demo { margin-top: auto; padding-top: 14px; display: flex; align-items: center; gap: 12px; }
  .mnf-ax kbd { font-family: var(--mono); font-size: 10px; border: 1px solid rgba(13,13,13,0.35);
    border-bottom-width: 2.5px; border-radius: 6px; padding: 3px 8px; background: var(--cream); }
  .mnf-btn.ring-on { outline: 2px solid #5555e8; outline-offset: 2px; cursor: default; }
  .mnf-cx { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .mnf-cx .pair { display: inline-flex; align-items: center; gap: 9px;
    border: 1px solid rgba(13,13,13,0.15); border-radius: 9px; padding: 6px 10px 6px 6px; }
  .mnf-cx .sw { width: 30px; height: 30px; border-radius: 7px; border: 1px solid;
    display: grid; place-items: center; font-weight: 700; font-size: 12px; flex: none; }
  .mnf-cx .lbl { font-family: var(--mono); font-size: 9px; opacity: .7; }
  .mnf-cx .grade { font-family: var(--mono); font-size: 9px; font-weight: 700;
    border-radius: 5px; padding: 3px 7px; }
  .mnf-cx .grade.aaa { background: #dcf7ee; color: #005943; }  /* status/success pair */
  .mnf-cx .grade.aa { background: #fffde5; color: #6e5300; }   /* status/warning pair */
  .mnf-cx .grade.fail { background: #fff0ec; color: #951c08; } /* status/error pair */
  .mnf-grid-demo { position: relative; width: 74px; height: 52px; border-radius: 8px;
    border: 1px solid rgba(13,13,13,0.2); background-color: #fff;
    background-image: linear-gradient(rgba(13,13,13,0.22) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,13,13,0.22) 1px, transparent 1px); }
  .mnf-grid-demo i { position: absolute; bottom: 3px; right: 6px; font-style: normal;
    font-family: var(--mono); font-size: 8.5px; opacity: .6; }
  .mnf-bp-row { display: flex; flex-direction: column; gap: 8px; }
  .mnf-bp { display: flex; align-items: center; gap: 12px; }
  .mnf-bp .bar { height: 14px; border-radius: 4px; background: var(--card-type); opacity: .85; }
  .mnf-bp .lbl { font-family: var(--mono); font-size: 9px; opacity: .7; white-space: nowrap; }
  .mnf-elev-card { width: 190px; background: #fff; border-radius: 16px; padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12); /* shadow/shadow-sm — verbatim */
    font-family: var(--mono); font-size: 9.5px; line-height: 1.6; }
  .mnf-hit { position: relative; width: 44px; height: 44px; border: 1.5px dashed var(--brand);
    border-radius: 10px; display: grid; place-items: center; }
  .mnf-hit span { width: 32px; height: 32px; background: var(--ink); border-radius: 9999px;
    display: grid; place-items: center; color: #fff; font-family: var(--mono); font-size: 8px; }
  .mnf-axx-foot { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.04em;
    opacity: .6; line-height: 1.8; margin: 0 0 8px; }
  .mnf-axx-foot b { color: var(--brand); font-weight: 700; }

  /* ── results / outcome ── */
  .mnf-results-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
  @media (max-width: 760px){ .mnf-results-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px){ .mnf-results-grid { grid-template-columns: 1fr; } }
  .mnf-result-ph { border: 1.5px dashed rgba(13,13,13,0.35); border-radius: 14px; padding: 22px 20px;
    display: flex; flex-direction: column; gap: 10px; background: #fffdf6; }
  .mnf-result-ph .rn { font-family: var(--display); font-weight: 900; letter-spacing: -0.02em;
    font-size: clamp(26px, 3.5vw, 40px); line-height: 1; opacity: .55; }
  .mnf-result-ph .rl { font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
    text-transform: uppercase; opacity: .6; line-height: 1.5; }
  .mnf-results-live { display: flex; flex-direction: column; gap: 10px; margin-bottom: 64px; }
  .mnf-result-live { font-size: 15px; line-height: 1.6; opacity: .85;
    display: flex; gap: 10px; align-items: flex-start; }
  .mnf-result-live::before { content: "✓"; color: #2dcd92; flex: none;
    font-family: var(--mono); font-size: 12px; margin-top: 2px; }

  /* dark-band overrides for results + the portfolio's next-project footer */
  .mnf-sec.dark .mnf-result-ph { color: var(--ink); }
  .mnf-sec.dark .mnf-result-live { color: #fafafa; }
  .mnf-sec.dark .pf-label { color: rgba(250,250,250,0.55); }
  .mnf-sec.dark .pf-next-link { color: #fafafa; }
  .mnf-sec.dark .pf-next-link:hover { color: #b48ade; }
  .mnf-sec.dark .pf-pill { background: transparent; color: #fafafa;
    border-color: rgba(250,250,250,0.35); }
  .mnf-sec.dark .pf-pill:hover { color: #b48ade; border-color: #b48ade; }

  .mnf-outcome { background: var(--brand); /* color/action/brand */ color: #fff;
    border-radius: 18px; padding: clamp(30px, 4.5vw, 60px); margin-bottom: 26px; }
  .mnf-outcome .k { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase; margin-bottom: 20px; }
  .mnf-outcome p { font-family: var(--display); font-weight: 800; letter-spacing: -0.015em;
    font-size: clamp(19px, 2.6vw, 30px); line-height: 1.32; margin: 0; max-width: 42ch; }

  .mnf-flag { font-family: var(--mono); font-size: 11px; line-height: 1.5; opacity: .55;
    margin: 0 0 48px; }
  .mnf-flag b { font-weight: 700; }
`;

const MNF_DECISIONS = [
  {
    title: "Calibrate everything against one component before scaling",
    body: "Button is the reference component. The entire machinery, from agent tooling and standards to the CI pipeline, Code Connect, and release gates, is built and validated against Button first. Only when Button ships cleanly on all three platforms does the same pipeline run on every subsequent component. This turned 'build a design system' into 'build a repeatable manufacturing process, then feed it components.'"
  },
  {
    title: "Guidelines are the product",
    body: "Every component gets a written spec before engineering touches it: variants, token usage, do and don't, accessibility, edge cases. That spec is what unblocks engineering, and it's what the agents read. When AI-generated code needs heavy editing, the fix usually lives in the guideline rather than the code. High edit distance tells us the spec was ambiguous, so we go back and fix the source."
  },
  {
    title: "A versioning model built for three platforms moving at different speeds",
    body: "Same major.minor across @manyfest/web, ManyfestKit, and manyfest-android, with independent patch versions per platform. Web can be at 0.1.3 while iOS is at 0.1.1, but the milestone tag only fires when all three pass the release gate. Teams get autonomy on fixes without ever drifting apart on capability."
  },
  {
    title: "Cross-platform first, platform-specific second",
    body: "Component sequencing follows a strict order: shared cross-platform components first, then iOS-specific patterns (BottomSheet, ChatInputArea, ResultCarousel), then web-specific ones (Tables, Modal, Toggle). This forces the shared token and API contract to harden before platform divergence is allowed to exist."
  },
  {
    title: "AI generates, humans decide, no exceptions",
    body: "The v1.0 target is an AI generation pipeline live on all three platforms with one hard rule: no auto-merge, ever. Every generated component and every AI-built Figma screen passes designer or engineer review. We measure the quality bar instead of assuming it: the eval baseline targets AI edit distance below 20% on simple components, tracked weekly by a metrics agent."
  },
];

const MNF_OWN = [
  { h: "Token architecture", p: "Primitives and semantic layers, light and dark, on all three platforms." },
  { h: "The full Figma library", p: "Foundations (typography, spacing, color, glass, opacity), P0/P1 components, icon set, brand manual." },
  { h: "Component guidelines", p: "Written before each component ships, structured for both human and agent consumption." },
  { h: "Cross-platform strategy", p: "Component sequencing and design decisions that keep three codebases coherent." },
  { h: "Versioning and milestone model", p: "The synchronized release model that keeps three moving platforms from drifting apart on capability." },
  { h: "Code Connect review", p: "Verifying Dev Mode output per variant, aligning naming between Figma and code after each release." },
  { h: "AI skills and experiments", p: "A component review skill for developer-readiness, a token usage reviewer, and hundreds of experiments across generation, review, and tooling." },
];

const MNF_AGENTS = [
  { label: "P0 · component pipeline", items: ["component-scaffolder", "component-author", "ds-rules-checker", "code-connect-author", "registry-syncer"] },
  { label: "P1 · quality gates", items: ["adr-author", "pr-reviewer", "cross-platform-consistency-checker", "breaking-change-detector", "token-syncer"] },
  { label: "P2 · release", items: ["version-bumper", "changelog-generator", "release-notes-author", "migration-guide-author"] },
  { label: "P3 · observability", items: ["metrics-collector"] },
];

const MNF_RESULTS_PH = [
  { n: "TBD", l: "launch status of the 2 AI-native products built on the system" },
  { n: "TBD", l: "time-to-component before vs. after agent pipeline" },
  { n: "<20%", l: "target AI edit distance on simple components" },
  { n: "TBD", l: "components shipped per milestone" },
  { n: "TBD", l: "CI violations caught by ds-rules-checker" },
];

const MNF_RESULTS_LIVE = [
  "Token and icon sync from Figma to code running on all three platforms.",
  "Design consistently ahead of engineering: every shipped component had a library-ready Figma spec and written guideline before implementation started.",
  "The system's operating model (guidelines-first, edit distance as a spec-quality signal, registry as source of truth) is now how the broader team works with AI.",
];

/* ── the full token set, harvested from the file's variables ── */
const MNF_STATUS_COLORS = [
  ["neutral", "#242422", "#eae8e2"],
  ["success", "#005943", "#dcf7ee"],
  ["warning", "#6e5300", "#fffde5"],
  ["error", "#951c08", "#fff0ec"],
  ["info", "#3232b8", "#eeeeff"],
];
const MNF_BORDER_COLORS = [
  ["subtle", "#dcdad4"], ["default", "#b8b7af"], ["focus", "#5555e8"],
  ["success", "#2dcd92"], ["warning", "#c9a800"], ["error", "#ff8070"], ["info", "#7878ef"],
];
const MNF_TEXT_ICON = [
  ["primary", "#0f0f0e"], ["secondary", "#707068"], ["disabled", "#909088"], ["inverted", "#ffffff"],
];
const MNF_SURFACES = [
  ["default", "#ffffff"], ["muted", "#fafafa"], ["canvas", "#f4f4f4"],
];
const MNF_TYPE_SCALE = [
  ["body/md", 16, 24], ["body/sm", 14, 20], ["body/xs", 12, 16],
];

/* ── color primitives — 66 tokens across seven families (from /color) ── */
const MNF_PRIM_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const MNF_PRIMS = [
  ["neutral", ["F4F4F4", "EAE8E2", "DCDAD4", "B8B7AF", "909088", "707068", "545450", "3C3C38", "242422", "0F0F0E"]],
  ["blue", ["EEEEFF", "D5D5FB", "ABABF6", "7878EF", "5555E8", "3D3DD0", "3232B8", "28289A", "1F1F77", "15155A"]],
  ["green", ["DCF7EE", "B5EFDA", "74DEB6", "2DCD92", "1A9F70", "007257", "005943", "00402F", "002518", "001209"]],
  ["yellow", ["FFFDE5", "FFF8A0", "FFF100", "EDCF00", "C9A800", "A07E00", "6E5300", "573E00", "362500", "1E1400"]],
  ["red", ["FFF0EC", "FFD4CC", "FFB0A0", "FF8070", "E85040", "E83A20", "BF2810", "951C08", "681004", "420800"]],
  ["pink", ["FFE6FE", "FECDFC", "FB9DF8", "F76EF3", "EF30E9", "D11AC9", "A60FA0", "7B0976", "51054D", "280225"]],
  ["violet", ["F3EEFF", "E1D0FC", "C4A4F8", "AA78F0", "9452E0", "8040CF", "6B30B8", "5520A0", "401588", "2A0A66"]],
];

/* ── semantic roles — light + dark captured for surface; the rest mapped light-mode ── */
const MNF_SEM_SURFACE = [
  ["color/surface/canvas", "Page floor: the outermost background the entire UI sits on.", "#F4F4F4", "neutral/50", "#0F0F0E", "neutral/900"],
  ["color/surface/default", "Standard surface for cards, list rows, and content panels.", "#FFFFFF", "neutral/0", "#242422", "neutral/800"],
  ["color/surface/muted", "Recessed surface for chip backgrounds, inputs, and search bars.", "#F4F4F4", "neutral/50", "#0F0F0E", "neutral/900"],
];
const MNF_SEM_GROUPS = [
  ["text-icon", [["primary", "#0F0F0E", "neutral/900"], ["secondary", "#707068", "neutral/500"], ["disabled", "#909088", "neutral/400"], ["inverted", "#FFFFFF", "neutral/0"]]],
  ["border", [["subtle", "#DCDAD4", "neutral/200"], ["default", "#B8B7AF", "neutral/300"], ["focus", "#5555E8", "blue/400"], ["success", "#2DCD92", "green/300"], ["warning", "#C9A800", "yellow/400"], ["error", "#FF8070", "red/300"], ["info", "#7878EF", "blue/300"]]],
  ["action", [["primary", "#0F0F0E", "neutral/900"], ["primary-hover", "#242422", "neutral/800"], ["primary-active", "#3C3C38", "neutral/700"], ["brand", "#8040CF", "violet/500"], ["brand-hover", "#6B30B8", "violet/600"], ["brand-active", "#5520A0", "violet/700"], ["secondary", "#EAE8E2", "neutral/100"], ["secondary-hover", "#DCDAD4", "neutral/200"], ["secondary-active", "#B8B7AF", "neutral/300"], ["destructive", "#BF2810", "red/600"], ["destructive-hover", "#951C08", "red/700"], ["destructive-active", "#681004", "red/800"]]],
  ["status", [["neutral", "#242422", "neutral/800"], ["neutral-subtle", "#EAE8E2", "neutral/100"], ["success", "#005943", "green/600"], ["success-subtle", "#DCF7EE", "green/50"], ["warning", "#6E5300", "yellow/600"], ["warning-subtle", "#FFFDE5", "yellow/50"], ["error", "#951C08", "red/700"], ["error-subtle", "#FFF0EC", "red/50"], ["info", "#3232B8", "blue/600"], ["info-subtle", "#EEEEFF", "blue/50"]]],
];

/* ── the full type scale (from /typography) ── */
const MNF_SCALE_ROWS = [
  ["display/xxl", "Gg", "d", 128, "128 / 0.95"],
  ["display/xl", "Gg", "d", 96, "96 / 0.95"],
  ["display/lg", "Gg", "d", 64, "64 / 0.98"],
  ["heading/lg", "Heading", "d", 40, "40 / 1.05"],
  ["heading/md", "Heading", "d", 28, "28 / 1.15"],
  ["body/lg", "Body large", "s", 22, "22 / 1.45"],
  ["body/md", "Body medium", "s", 16, "16 / 1.55"],
  ["body/sm", "Body small", "s", 14, "14 / 1.5"],
  ["mono/sm", "EYEBROW", "m", 12, "12 / 1 / 0.24em"],
];

/* the pillars — reference-site cards, opened in place as an accordion */
const MNF_PILLARS = [
  { id: "color", cls: "p-color", h: "Color", p: "Primary, accent, and neutral, plus the rules that hold them together." },
  { id: "type", cls: "p-type", h: "Typography", p: "Manychat Gravity for display. Rooftop for body. Two voices in type." },
  { id: "found", cls: "p-found", h: "Foundations", p: "Radius, spacing, grid, borders: the token layer beneath every surface." },
  { id: "voice", cls: "p-voice", h: "Voice & Tone", p: "How Manychat sounds: confident, useful, and never corporate." },
];

/* WCAG contrast, computed live from the tokens — badges are measured, not claimed */
function mnfLum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function mnfRatio(a, b) {
  const [hi, lo] = [mnfLum(a), mnfLum(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}
const MNF_CONTRAST_PAIRS = [
  ["text/primary on surface/default", "#0f0f0e", "#ffffff"],
  ["text/primary on surface/canvas", "#0f0f0e", "#f4f4f4"],
  ["inverted on action/primary", "#ffffff", "#0f0f0e"],
  ["inverted on action/brand", "#ffffff", "#8040cf"],
  ["text/secondary on surface/default", "#707068", "#ffffff"],
];

function MnfScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function MnfstCase({ spec, onAsk }) {
  const [open, setOpen] = useStateMnf(null);
  const [colOpen, setColOpen] = useStateMnf({ prims: false, sem: false });

  useEffectMnf(() => {
    document.body.classList.add("mnf-mode");
    /* header items invert while a purple/dark band passes underneath */
    const onScroll = () => {
      const y = 46; // vertical middle of the header
      let invert = false;
      for (const s of document.querySelectorAll(".mnf-hero, .mnf-sec")) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) {
          invert = s.classList.contains("dark") || s.classList.contains("mnf-hero");
          break;
        }
      }
      document.body.classList.toggle("mnf-head-invert", invert);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("mnf-mode", "mnf-head-invert");
    };
  }, []);

  const toggle = (id) => setOpen((cur) => (cur === id ? null : id));

  const panels = {
    color: (
      <div className="mnf-panel-inner">
        <div className="mnf-pal-h">color/action · default · hover · active</div>
        <div className="mnf-toks">
          {[
            ["color/action/primary", ["#0f0f0e", "#242422", "#3c3c38"], "0F0F0E · 242422 · 3C3C38"],
            ["color/action/brand", ["#8040cf", "#6b30b8", "#5520a0"], "8040CF · 6B30B8 · 5520A0"],
            ["color/action/secondary", ["#eae8e2", "#dcdad4", "#b8b7af"], "EAE8E2 · DCDAD4 · B8B7AF"],
            ["color/action/destructive", ["#bf2810", "#951c08", "#6b1004"], "BF2810 · 951C08 · 6B1004"],
          ].map(([name, ramp, hex]) => (
            <div key={name}>
              <div className="mnf-tok-name">{name}</div>
              <div className="mnf-ramp">{ramp.map((c) => <span key={c} style={{ background: c }}></span>)}</div>
              <div className="mnf-tok-hex">{hex}</div>
            </div>
          ))}
        </div>

        <div className="mnf-pal-h">color/status · solid · subtle</div>
        <div className="mnf-status-grid">
          {MNF_STATUS_COLORS.map(([name, solid, subtle]) => (
            <div className="mnf-status" key={name}>
              <div className="pair"><span style={{ background: solid }}></span><span style={{ background: subtle }}></span></div>
              <div className="mnf-sw"><div className="n">{name}</div><div className="x">{solid.toUpperCase()} · {subtle.toUpperCase()}</div></div>
            </div>
          ))}
        </div>

        <div className="mnf-pal-h">color/border</div>
        <div className="mnf-sw-row">
          {MNF_BORDER_COLORS.map(([name, hex]) => (
            <div className="mnf-sw" key={name}>
              <div className="c" style={{ background: hex }}></div>
              <div className="n">{name}</div><div className="x">{hex.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="mnf-pal-h">color/text-icon</div>
        <div className="mnf-sw-row">
          {MNF_TEXT_ICON.map(([name, hex]) => (
            <div className="mnf-sw" key={name}>
              <div className="c" style={{ background: hex }}></div>
              <div className="n">{name}</div><div className="x">{hex.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="mnf-pal-h">color/surface</div>
        <div className="mnf-sw-row">
          {MNF_SURFACES.map(([name, hex]) => (
            <div className="mnf-sw" key={name}>
              <div className="c" style={{ background: hex }}></div>
              <div className="n">{name}</div><div className="x">{hex.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="mnf-focus-line">
          <span className="mnf-focus-dot" aria-hidden="true"></span>
          color/border/focus #5555E8 · border-width/focus 2px + 2px gap · on every interactive component
        </div>
      </div>
    ),
    type: (
      <div className="mnf-panel-inner">
        <div className="mnf-pal-h">display · manychat gravity (substituted here with archivo)</div>
        <p className="mnf-type-display">One system. Every surface.</p>
        <div className="mnf-type-cap">used for heroes, section titles, and stats. interface copy stays in rooftop</div>

        <div className="mnf-pal-h">text · rooftop · weights 400 / 700 · the full body scale</div>
        {MNF_TYPE_SCALE.map(([name, size, lh]) => (
          <div className="mnf-type-row" key={name}>
            <span className="k">{name} · {size}/{lh}</span>
            <span style={{ fontSize: size, lineHeight: lh + "px" }}>
              Rooftop carries every interface sentence. <strong>And its bold makes the point.</strong>
            </span>
          </div>
        ))}
        <div className="mnf-type-row">
          <span className="k">tokens</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.8, opacity: .7 }}>
            typography/font-family/display · typography/font-family/text · typography/size/body-xs·sm·md ·
            typography/line-height/xs·sm·md · typography/weight/regular·bold · composed as body/[size]/[weight]
          </span>
        </div>
      </div>
    ),
    found: (
      <div className="mnf-panel-inner">
        <p style={{ margin: "0 0 6px", fontSize: 15, lineHeight: 1.6, opacity: .8, maxWidth: "58ch" }}>
          The token layer underneath every surface: radius, spacing, grid, border,
          opacity, icons, breakpoints, and elevation. <strong>Eight primitives, used with intent.</strong>
        </p>

        <div className="mnf-pal-h">01 · radius: xs/r1 4 · md 12 · lg/component-lg 16 · pill/r-full 9999</div>
        <div className="mnf-radius-demo">
          {[["xs", 4], ["md", 12], ["lg", 16]].map(([n, r]) => (
            <span key={n} style={{ width: 52, height: 52, borderRadius: r, background: "#0f0f0e",
              color: "#fff", display: "grid", placeItems: "center",
              fontFamily: "var(--mono)", fontSize: 9 }}>{n}</span>
          ))}
          <span className="mnf-radius-pill">pill · every interactive silhouette</span>
        </div>

        <div className="mnf-pal-h">02 · spacing: xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32</div>
        <div className="mnf-sp-row" style={{ paddingBottom: 18 }}>
          {[4, 8, 12, 16, 24, 32].map((s) => (
            <span className="mnf-sp" key={s} style={{ height: s * 2.4 }}><i>{s}</i></span>
          ))}
        </div>

        <div className="mnf-pal-h">03 · grid: 64 / 96 / 128 densities, solid + gradient styles</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[64, 96, 128].map((d) => (
            <span className="mnf-grid-demo" key={d} style={{ backgroundSize: (d / 4) + "px " + (d / 4) + "px" }}><i>{d}</i></span>
          ))}
        </div>

        <div className="mnf-pal-h">04 · border-width: default 1 · focus 2 · strong 2</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 260 }}>
          <span style={{ height: 1, background: "#0f0f0e" }}></span>
          <span style={{ height: 2, background: "#5555e8" }}></span>
          <span style={{ height: 2, background: "#0f0f0e" }}></span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, opacity: .6 }}>strong aliases 2px: outlines that must hold on variable backgrounds</span>
        </div>

        <div className="mnf-pal-h">05 · opacity: disabled 40 · scrim 60 · full 100</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[40, 60, 100].map((o) => (
            <span key={o} style={{ width: 52, height: 34, borderRadius: 8, background: "#0f0f0e",
              opacity: o / 100, color: "#fff", display: "grid", placeItems: "center",
              fontFamily: "var(--mono)", fontSize: 9 }}>{o}</span>
          ))}
        </div>

        <div className="mnf-pal-h">06 · icons: sm 16 · md 20 · touch targets 32 / 42 / 48, 44pt hit minimum</div>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-end", flexWrap: "wrap" }}>
          <span style={{ width: 16, height: 16, border: "1.5px solid #0f0f0e", borderRadius: 4 }}></span>
          <span style={{ width: 20, height: 20, border: "1.5px solid #0f0f0e", borderRadius: 5 }}></span>
          <span className="mnf-tt" style={{ width: 32, height: 32 }}>32</span>
          <span className="mnf-tt" style={{ width: 42, height: 42 }}>42</span>
          <span className="mnf-tt" style={{ width: 48, height: 48 }}>48</span>
        </div>

        <div className="mnf-pal-h">07 · breakpoints: one responsive variable, five tiers</div>
        <div className="mnf-bp-row">
          {[["mobile", 360, "compact phones · iPhone SE / small android"],
            ["tablet-compact", 768, "iPad mini portrait · first adaptive shift"],
            ["tablet-regular", 1024, "iPad Air/Pro · two-panel + persistent nav"],
            ["desktop-sm", 1280, "13″ laptops · max-width columns begin"],
            ["desktop-lg", 1440, "large desktop · content capped at max width"]].map(([n, w, d]) => (
            <span className="mnf-bp" key={n}>
              <span className="bar" style={{ width: w / 9 }}></span>
              <span className="lbl"><b>{n}</b> {w} · {d}</span>
            </span>
          ))}
        </div>

        <div className="mnf-pal-h">08 · elevation: one shadow in the whole system</div>
        <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
          <span className="mnf-elev-card">shadow/shadow-sm<br />0 2px 8px rgba(0,0,0,.12)</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, opacity: .65, maxWidth: 320, lineHeight: 1.7 }}>
            floating elements only: FAB, bottom sheet, modal. never on cards, bubbles, or inputs:
            if inline content needs depth, the real fix is spacing or color separation.
          </span>
        </div>
      </div>
    ),
    voice: (
      <div className="mnf-panel-inner">
        <div className="mnf-voice-grid">
          <div className="mnf-voice-card vo"><h4>Confident, not corporate.</h4><p>We say what we mean. No buzzwords, no hedging, just clear claims and clear next steps.</p></div>
          <div className="mnf-voice-card vp"><h4>Useful first.</h4><p>Every sentence earns its place. If it doesn't help the reader move forward, it goes.</p></div>
          <div className="mnf-voice-card vk"><h4>Warm, but sharp.</h4><p>We have a sense of humor. We're also serious about the work. Both can be true.</p></div>
        </div>
      </div>
    ),
  };

  return (
    <div className="mnf">
      <style>{__MNF_STYLE}</style>

      {/* rail */}
      <nav className="mnf-rail" aria-label="sections">
        <button onClick={() => MnfScrollTo("mnf-top")}>overview</button>
        <button onClick={() => MnfScrollTo("mnf-story")}>the story</button>
        <button onClick={() => MnfScrollTo("mnf-pillars")}>pillars</button>
        <button onClick={() => MnfScrollTo("mnf-color")}>color</button>
        <button onClick={() => MnfScrollTo("mnf-type")}>typography</button>
        <button onClick={() => MnfScrollTo("mnf-components")}>components</button>
        <button onClick={() => MnfScrollTo("mnf-agents")}>agents</button>
        <button onClick={() => MnfScrollTo("mnf-access")}>accessibility</button>
        <button onClick={() => MnfScrollTo("mnf-results")}>results</button>
      </nav>

      {/* ── hero ── */}
      <header className="mnf-hero mnf-grid-bg" id="mnf-top">
        <div className="mnf-wrap">
          <button className="mnf-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
          <div className="mnf-eyebrow">manyfest · design system 2026</div>
          <h1 className="mnf-h1">One system. Every surface.</h1>
          <span className="mnf-react" style={{ top: "24%", right: "8%", "--r": "2deg", "--fd": "4.6s" }}>🔥 Looks fab</span>
          <span className="mnf-react" style={{ top: "56%", right: "3%", "--r": "-2deg", "--fd": "5.8s" }}>❤️ Made with love</span>
          <span className="mnf-react" style={{ bottom: "6%", right: "26%", "--r": "1deg", "--fd": "5.2s" }}>🥰 So good</span>
          <p className="mnf-hero-sub">Manyfest is the Manychat product design system: components, color, typography, and voice. Built AI-native for web, iOS, and Android, with agents in the pipeline from day one. I co-lead it.</p>
          <button className="mnf-cta" onClick={() => MnfScrollTo("mnf-pillars")}>explore the system →</button>
          <div className="mnf-hero-meta">
            <span className="mnf-hero-chip"><b>role</b>Senior Product Designer, Design Systems</span>
            <span className="mnf-hero-chip"><b>company</b>Manychat · 1.5M+ businesses</span>
            <span className="mnf-hero-chip"><b>platforms</b>Web · iOS · Android</span>
            <span className="mnf-hero-chip"><b>timeline</b>2025 to present</span>
          </div>
        </div>
      </header>

      {/* ── the story ── */}
      <section className="mnf-sec cream mnf-grid-bg" id="mnf-story">
        <div className="mnf-wrap">
          <span className="mnf-chip">the story · 01</span>
          <h2 className="mnf-h2">Built live, against two moving targets.</h2>

          <div className="mnf-context">
            <p>The real challenge: Manyfest is a system for two AI-native products that were being created live — designed and engineered at the same time as the system itself, across web, iOS, and Android. No legacy library to lean on, no settled patterns, almost no context. The system couldn't be specced once and shipped; it had to be a living, evolving process that moved in step with every product decision.</p>
            <p>And the target moved twice, because the brand was evolving too. Manychat was rebranding how it communicates while the products took shape — and the system's whole goal was to pull the products closer to that brand. Absorbing change without fracturing became the real work. On top of it, the second bet: agents in the pipeline from day one, so every guideline and token decision had to serve two audiences at once — humans and agents.</p>
          </div>

          <div className="mnf-stats">
            <div className="mnf-stat"><div className="n">2</div><div className="l">AI-native products launching on the system</div></div>
            <div className="mnf-stat"><div className="n">3</div><div className="l">platforms, one synchronized release train</div></div>
            <div className="mnf-stat"><div className="n"><span className="mnf-tbd">TBD</span></div><div className="l">components: atoms, AI molecules, platform patterns</div></div>
            <div className="mnf-stat"><div className="n"><span className="acc">14</span></div><div className="l">AI agents in the component pipeline</div></div>
          </div>

          <div className="mnf-decisions">
            {MNF_DECISIONS.map((d, i) => (
              <div className="mnf-decision" key={i}>
                <div className="mnf-dec-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="mnf-dec-title">{d.title}</div>
                  <p className="mnf-dec-p">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── pillars (accordion) ── */}
      <section className="mnf-sec cream mnf-grid-bg" id="mnf-pillars">
        <div className="mnf-wrap">
          <span className="mnf-chip">the pillars · 02</span>
          <h2 className="mnf-h2">The foundations of us.</h2>
          <p className="mnf-sec-sub">Four pillars hold the system together. Open one and everything expands right here, no page-hopping.</p>
          <div className="mnf-pillars">
            {MNF_PILLARS.map((pl, i) => {
              const isScroll = pl.id === "color" || pl.id === "type";
              return (
                <React.Fragment key={pl.id}>
                  <button
                    className={"mnf-pillar " + pl.cls + (open === pl.id ? " is-open" : "")}
                    onClick={() => (isScroll ? MnfScrollTo(pl.id === "color" ? "mnf-color" : "mnf-type") : toggle(pl.id))}
                    aria-expanded={isScroll ? undefined : open === pl.id}
                  >
                    <h3>{pl.h}</h3>
                    <p>{pl.p}</p>
                    <span className="open-cta">{isScroll ? "open" : open === pl.id ? "close" : "open"} <span className="arr">→</span></span>
                  </button>
                  {/* panel spans full width after each row of two */}
                  {(i % 2 === 1 || i === MNF_PILLARS.length - 1) && (
                    <React.Fragment>
                      {[MNF_PILLARS[i - (i % 2)], MNF_PILLARS[i - (i % 2) + 1]].filter(Boolean).filter((rowPl) => panels[rowPl.id]).map((rowPl) => (
                        <div key={rowPl.id + "-panel"} className={"mnf-panel" + (open === rowPl.id ? " open" : "")} aria-hidden={open !== rowPl.id}>
                          {panels[rowPl.id]}
                        </div>
                      ))}
                    </React.Fragment>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── color — the full palette, mirroring /color ── */}
      <section className="mnf-sec cream mnf-grid-bg" id="mnf-color">
        <div className="mnf-wrap">
          <span className="mnf-chip">color · 03</span>
          <h2 className="mnf-h2">Color is dynamic. It creates tension. But also agreement.</h2>
          <p className="mnf-sec-sub">Eight roles, two layers. Primitives hold the raw values; semantic tokens give them a job, so every surface feels unmistakably us, loud where it counts, calm where it has to.</p>

          <div className="mnf-sub-head"><span className="mnf-chip sm">primitives · color</span><span className="mnf-count">66 tokens</span></div>
          <h3 className="mnf-h3">Color Primitives.</h3>
          <p className="mnf-sub-p">The raw values: 66 tokens across seven families. Every semantic role maps back to one of these.</p>
          <button className="mnf-acc-btn" onClick={() => setColOpen((s) => ({ ...s, prims: !s.prims }))} aria-expanded={colOpen.prims}>
            {colOpen.prims ? "close the tokens" : "open the 66 tokens"} <span className="arr">→</span>
          </button>
          <div className={"mnf-acc" + (colOpen.prims ? " open" : "")} aria-hidden={!colOpen.prims}>
          {MNF_PRIMS.map(([fam, steps]) => (
            <div className="mnf-fam" key={fam}>
              <div className="mnf-fam-h"><b>{fam}</b><span>color/{fam}/{"{50–900}"}</span></div>
              <div className="mnf-fam-row">
                {steps.map((hex, i) => (
                  <span className="mnf-prim" key={hex} style={{ background: "#" + hex, color: i < 5 ? "#0f0f0e" : "#fff" }}>
                    <b>{MNF_PRIM_STEPS[i]}</b><i>#{hex}</i>
                  </span>
                ))}
              </div>
            </div>
          ))}

          </div>

          <div className="mnf-sub-head"><span className="mnf-chip sm">semantic · color</span><span className="mnf-count">37 × 2 modes</span></div>
          <h3 className="mnf-h3">Color Semantic.</h3>
          <p className="mnf-sub-p">37 tokens × 2 modes. Primitives map to roles, and roles are how surfaces communicate state, action, and tone consistently across every product.</p>
          <button className="mnf-acc-btn" onClick={() => setColOpen((s) => ({ ...s, sem: !s.sem }))} aria-expanded={colOpen.sem}>
            {colOpen.sem ? "close the roles" : "open the roles"} <span className="arr">→</span>
          </button>
          <div className={"mnf-acc" + (colOpen.sem ? " open" : "")} aria-hidden={!colOpen.sem}>
          <div className="mnf-sem-cols"><span>token</span><span>☀ light mode</span><span>☾ dark mode</span></div>
          <div className="mnf-sem-group"><b>surface</b><span>the floor everything sits on</span></div>
          {MNF_SEM_SURFACE.map(([token, desc, light, lightMap, dark, darkMap]) => (
            <div className="mnf-sem-row" key={token}>
              <div className="t"><b>{token}</b><p>{desc}</p></div>
              <span className="mnf-sem-chip"><span className="dot" style={{ background: light }}></span><b>{light}</b><i>→ {lightMap}</i></span>
              <span className="mnf-sem-chip dk"><span className="dot" style={{ background: dark }}></span><b>{dark}</b><i>→ {darkMap}</i></span>
            </div>
          ))}
          {MNF_SEM_GROUPS.map(([group, rows]) => (
            <div key={group}>
              <div className="mnf-sem-group"><b>{group}</b><span>{rows.length} roles · light mode, each mapped to its primitive</span></div>
              <div className="mnf-map-wrap">
                {rows.map(([name, hex, map]) => (
                  <span className="mnf-sem-chip" key={name}>
                    <span className="dot" style={{ background: hex }}></span>
                    <b>{group}/{name}</b><i>{hex} → {map}</i>
                  </span>
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ── divider: color → typography ── */}
      <div className="mnf-divider" aria-hidden="true">
        <div className="mnf-divider-track">
          {[0, 1].map((half) => (
            <span key={half}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="mnf-divider-item">color → typography · manyfest ds · </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── typography — mirroring /typography ── */}
      <section className="mnf-sec cream mnf-grid-bg mnf-type-sec" id="mnf-type">
        <div className="mnf-wrap">
          <span className="mnf-chip">typography · 04</span>
          <h2 className="mnf-h2">Typography.</h2>
          <p className="mnf-sec-sub">Two voices in type: Manychat Gravity for display, Rooftop for body. Built so every headline lands and every paragraph reads.</p>
        </div>
        <div className="mnf-wrap">
          <div className="mnf-voices">
            <div className="mnf-voice-block">
              <span className="mnf-chip sm">display</span>
              <p className="spec">Manychat Gravity</p>
              <p className="desc">Loud, compact, unmistakable. One weight, used big.</p>
              <p className="mnf-voice-meta">gravity · 900 · −0.02em · hero, headlines, stickers, posters</p>
            </div>
            <div className="mnf-voice-block">
              <span className="mnf-chip sm">body</span>
              <p className="spec spec-rt">Rooftop.</p>
              <p className="desc">Quiet, legible, made for reading. Lives in paragraphs, UI, and captions.</p>
              <p className="mnf-voice-meta">rooftop · 400 / 700 · 0 tracking · paragraphs, ui, captions</p>
            </div>
          </div>

          <p style={{ fontFamily: "var(--mono)", fontSize: 9.5, opacity: .55, marginTop: 20 }}>
            gravity and rooftop render as archivo / dm sans here unless the fonts are installed, same sizes, weights, and tracking.
          </p>
        </div>
      </section>

      {/* ── components — live render on dark ── */}
      <section className="mnf-sec dark" id="mnf-components">
        <div className="mnf-wrap">
          <span className="mnf-chip">components · 05</span>
          <h2 className="mnf-h2">Button. Rendered live.</h2>
          <p className="mnf-live-note">
            <strong>Not a screenshot.</strong> This matrix is live HTML built from the variables
            in the Manyfest Figma file. Hover it, press it, tab through it.
            {" "}<span className="tok">color/action/*</span>{" "}
            <span className="tok">radius/component/pill</span>{" "}
            <span className="tok">touch-target/sm·md·lg</span>{" "}
            <span className="tok">border-width/focus</span>
          </p>

          <div className="mnf-matrix-card">
            <div className="mnf-matrix">
              <span className="mnf-mx-h"></span>
              <span className="mnf-mx-h">primary</span>
              <span className="mnf-mx-h">brand</span>
              <span className="mnf-mx-h col-3">secondary</span>
              <span className="mnf-mx-h col-4">destructive</span>
              <span></span>

              <span className="mnf-mx-row">solid</span>
              <button className="mnf-btn solid-primary" type="button">Button</button>
              <button className="mnf-btn solid-brand" type="button">Button</button>
              <button className="mnf-btn solid-secondary col-3" type="button">Button</button>
              <button className="mnf-btn solid-destructive col-4" type="button">Button</button>
              <span></span>

              <span className="mnf-mx-row">outline</span>
              <button className="mnf-btn outline-primary" type="button">Button</button>
              <button className="mnf-btn outline-brand" type="button">Button</button>
              <span className="mnf-mx-na col-3">not in matrix</span>
              <span className="mnf-mx-na col-4">not in matrix</span>
              <span></span>

              <span className="mnf-mx-row">ghost</span>
              <button className="mnf-btn ghost-primary" type="button">Button</button>
              <button className="mnf-btn ghost-brand" type="button">Button</button>
              <span className="mnf-mx-na col-3">not in matrix</span>
              <span className="mnf-mx-na col-4">not in matrix</span>
              <span></span>
            </div>

            <div className="mnf-states">
              <span className="mnf-mx-row">sizes + states</span>
              <button className="mnf-btn solid-primary sz-sm" type="button">Button</button>
              <button className="mnf-btn solid-primary" type="button">Button</button>
              <button className="mnf-btn solid-primary sz-lg" type="button">Button</button>
              <button className="mnf-btn solid-primary" type="button" aria-disabled="true" tabIndex={0}>Button</button>
              <button className="mnf-btn solid-brand" type="button" aria-disabled="true" aria-busy="true" tabIndex={0}>
                <span className="mnf-spin" aria-hidden="true"></span>Button
              </button>
            </div>

            <div className="mnf-live-foot">
              default → hover → active, straight from the file · focus ring 2px #5555E8 + 2px gap ·
              press = scale 0.96 @ 100ms · loading keeps its label · disabled stays focusable ·
              144 variants in the full set · typeface substituted (rooftop → archivo)
            </div>
          </div>
        </div>
      </section>

      {/* ── ownership + agents ── */}
      <section className="mnf-sec dark" id="mnf-agents">
        <div className="mnf-wrap">
          <span className="mnf-chip">the pipeline · 06</span>
          <h2 className="mnf-h2">What I own.</h2>
          <div className="mnf-own">
            {MNF_OWN.map((f, i) => (
              <div className="mnf-own-item" key={i}>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
          <p className="mnf-collab">
            Engineering counterparts own the agent infrastructure, Storybook MCP, eval suite, and platform-specific implementation. The division is deliberate: design defines the contract, engineering automates against it. Built in close collaboration with Thành Đỗ Long on the pipeline and Valeryia Karzhova on the library.
          </p>

          <div className="mnf-agents">
            <div className="mnf-ag-head">
              <span className="mnf-ag-head-label">14 agents, prioritized like the components they serve</span>
              <span className="mnf-ag-count">14</span>
            </div>
            {MNF_AGENTS.map((g) => (
              <div className="mnf-ag-group" key={g.label}>
                <div className="mnf-ag-grouplabel">{g.label}</div>
                <div className="mnf-ag-items">
                  {g.items.map((ag) => <span className="mnf-ag-chip" key={ag}>{ag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── accessibility — every rule below is lifted from the component specs ── */}
      <section className="mnf-sec cream mnf-grid-bg" id="mnf-access">
        <div className="mnf-wrap">
          <span className="mnf-chip">accessibility · 07</span>
          <h2 className="mnf-h2">Written into every spec.</h2>
          <p className="mnf-sec-sub">None of this is aspirational: each rule is written into the component specs, codified in ADRs, and checked by an agent in the pipeline. Try them, tab through this page.</p>

          <div className="mnf-axx">
            <div className="mnf-ax">
              <span className="tag">adr-0014 · every interactive component</span>
              <h4>Disabled is still focusable.</h4>
              <p>aria-disabled + tabIndex=0 instead of HTML disabled. Keyboard and screen-reader users can find a disabled control and hear why it's off. It doesn't just vanish from the tab order.</p>
              <div className="demo"><button className="mnf-btn solid-primary" type="button" aria-disabled="true" tabIndex={0}>Button</button><span style={{ fontFamily: "var(--mono)", fontSize: 9.5, opacity: .6 }}>← tab onto it</span></div>
            </div>
            <div className="mnf-ax">
              <span className="tag">adr-0006 · focus pattern</span>
              <h4>One ring, everywhere, instantly.</h4>
              <p>2px ring + 2px gap in color/border/focus: an outer halo layer rather than a thickened border, identical on Button, Radio, Checkbox, and Chip. And it appears instantly, because focus is the one state that never animates.</p>
              <div className="demo">
                <span className="mnf-btn outline-primary ring-on" aria-hidden="true">Focused</span>
                <button className="mnf-btn outline-primary" type="button">Tab to me</button>
              </div>
            </div>
            <div className="mnf-ax">
              <span className="tag">iconbutton · compile-time</span>
              <h4>No label, no build.</h4>
              <p>Icon-only components require aria-label or aria-labelledby as a discriminated union, enforced at compile time instead of a runtime console warning someone ignores.</p>
              <div className="demo"><kbd>aria-label</kbd><span style={{ fontFamily: "var(--mono)", fontSize: 10, opacity: .5 }}>| </span><kbd>aria-labelledby</kbd></div>
            </div>
            <div className="mnf-ax">
              <span className="tag">touch targets</span>
              <h4>44pt, no matter the visual.</h4>
              <p>Small controls keep their compact look but extend an invisible hit area to 44×44. When a chip stays compact, the parent row owns the 44pt. The responsibility is written into the spec.</p>
              <div className="demo"><span className="mnf-hit"><span>32</span></span><span style={{ fontFamily: "var(--mono)", fontSize: 9.5, opacity: .6 }}>32 visual · 44 hit</span></div>
            </div>
            <div className="mnf-ax">
              <span className="tag">tabs · keyboard</span>
              <h4>Roving tabindex.</h4>
              <p>One tab stop per group; arrow keys move between items, Enter or Space activates. Selection is announced via aria-selected and marked with a 2px underline, so color is never doing the job alone.</p>
              <div className="demo"><kbd>←</kbd><kbd>→</kbd><kbd>Enter</kbd></div>
            </div>
            <div className="mnf-ax">
              <span className="tag">motion + loading</span>
              <h4>Motion asks permission.</h4>
              <p>prefers-reduced-motion skips the selection slides and fades. Loading states announce with aria-busy, keep their label next to the spinner, and stay focusable while they work.</p>
              <div className="demo"><button className="mnf-btn solid-brand" type="button" aria-disabled="true" aria-busy="true" tabIndex={0}><span className="mnf-spin" aria-hidden="true"></span>Button</button></div>
            </div>
            <div className="mnf-ax" style={{ gridColumn: "1 / -1" }}>
              <span className="tag">contrast · checked in the token pipeline</span>
              <h4>Every contrast ratio is measured live.</h4>
              <p>Every text-on-surface pair is checked against WCAG when tokens change. Primary text clears AAA on every surface; nothing ships below AA. These ratios are computed live from the tokens on this page rather than typed in.</p>
              <div className="mnf-cx">
                {MNF_CONTRAST_PAIRS.map(([label, fg, bg]) => {
                  const r = mnfRatio(fg, bg);
                  const grade = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : "FAIL";
                  return (
                    <span className="pair" key={label}>
                      <span className="sw" style={{ background: bg, color: fg, borderColor: "rgba(13,13,13,0.15)" }}>Aa</span>
                      <span className="lbl">{label}</span>
                      <span className={"grade " + grade.toLowerCase()}>{r.toFixed(1)}:1 {grade}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mnf-axx-foot">
            skeletons are aria-hidden inside an aria-busy container · disabled fades via opacity/disabled (40%) on the wrapper, control and label together ·
            an <b>accessibility-check agent</b> reviews every component before release · rules codified as ADRs, so agents inherit them too.
          </p>
        </div>
      </section>

      {/* ── results + outcome ── */}
      <section className="mnf-sec dark" id="mnf-results">
        <div className="mnf-wrap">
          <span className="mnf-chip">results · 08</span>
          <h2 className="mnf-h2">The numbers keep us honest.</h2>
          <div className="mnf-results-grid">
            {MNF_RESULTS_PH.map((r, i) => (
              <div className="mnf-result-ph" key={i}>
                <div className="rn">{r.n}</div>
                <div className="rl">{r.l}</div>
              </div>
            ))}
          </div>
          <div className="mnf-results-live">
            {MNF_RESULTS_LIVE.map((r, i) => (
              <div className="mnf-result-live" key={i}>{r}</div>
            ))}
          </div>

          <div className="mnf-context" style={{ marginBottom: 56 }}>
            <p>The eval baseline is still a target; the results are coming in. Edit distance below 20% is where we drew the bar; the weekly metrics agent will tell us whether the guidelines are actually good or just thorough. And the synchronized release train has a cost we accepted knowingly: the slowest platform sets the milestone pace. Ask me about it.</p>
          </div>

          <div className="mnf-outcome">
            <div className="k">why this matters beyond manychat</div>
            <p>Most teams treat AI tooling as something that consumes a design system. Manyfest treats the design system as something that trains and constrains AI. Agents hallucinate; the system is the guardrail. We just built it first.</p>
          </div>

          <p className="mnf-flag"><b>note</b> · metric figures marked TBD are pending public clearance from Manychat.</p>

          <NextProjectFooter currentId="manychat-ds" onAsk={onAsk} />
        </div>
      </section>
    </div>
  );
}

if (typeof LAYOUTS !== "undefined") LAYOUTS["manyfest-case"] = MnfstCase;

Object.assign(window, { MnfstCase });
