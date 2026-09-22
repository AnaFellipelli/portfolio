/* ════════════════════════════════════════════════════════════
   app.jsx — reveal choreography, A→B morph, controls
   ════════════════════════════════════════════════════════════ */

const { useState: uS, useEffect: uE, useRef: uR } = React;
/* framer-motion is gone: every animation on this site is CSS. */

const EASE = [0.22, 1, 0.36, 1];

/* ---------- tweakable controls (work-page folder layout) ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "folderSize": 0.9,
  "colGap": 42,
  "rowGap": 32,
  "stagger": false
}/*EDITMODE-END*/;

/* ---------- hash routing — makes every page linkable + back-button friendly ---------- */
const ROUTE_TO_Q = {
  "/work": "show me your work",
  "/about": "who are you",
  "/contact": "are you open to work",
  "/manyfest": "tell me about manyfest",
  "/weave": "open the full weave case",
  "/releve": "tell me about releve",
  "/espm": "tell me about espm",
  "/canal": "tell me about canal",
  "/baw": "tell me about baw",
  "/bmtax": "tell me about bmtax",
};
const LAYOUT_TO_ROUTE = {
  "gallery": "/work",
  "about": "/about",
  "contact": "/contact",
  "manyfest-case": "/manyfest",
  "case-study": "/weave",
  "releve-case": "/releve",
  "canal-case": "/canal",
  "baw-case": "/baw",
  "espm-case": "/espm",
  "bmtax-case": "/bmtax",
};
function specToRoute(spec) {
  if (!spec) return "";
  if (LAYOUT_TO_ROUTE[spec.layout]) return LAYOUT_TO_ROUTE[spec.layout];
  if (spec._question) return "/q/" + encodeURIComponent(spec._question);
  return "";
}
function routeToQuestion(hash) {
  const route = (hash || "").replace(/^#/, "");
  if (!route || route === "/") return null;
  if (ROUTE_TO_Q[route]) return ROUTE_TO_Q[route];
  if (route.startsWith("/q/")) {
    try { return decodeURIComponent(route.slice(3)); } catch (e) { return null; }
  }
  return null;
}

/* reveal stage timings (ms → stage) */
const STAGE_TIMES = [
  [600, 1],   // dot
  [1000, 2],  // line
  [1500, 3],  // portal box
  [2100, 4],  // input controls
  [2600, 5],  // hero text
  [3400, 6],  // cycling placeholder
  [4000, 7],  // chrome + orbs
  [4500, 8],  // ready
];

function SparkIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 L13.6 9.2 L20 11 L13.6 12.8 L12 19 L10.4 12.8 L4 11 L10.4 9.2 Z"
        fill="currentColor" opacity="0.9" />
      <circle cx="18.5" cy="5.5" r="1.4" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function SendArrow() {
  return (
    <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" aria-hidden="true">
      <path d="M5 12 H18 M13 7 L18 12 L13 17" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- shared AI input (the morphing element) ---------- */
function AiInput({ variant, value, onChange, onSubmit, placeholder, autoFocus, showCursor }) {
  const ref = uR(null);
  uE(() => { if (autoFocus && ref.current) ref.current.focus(); }, [autoFocus]);
  const Comp = "form";
  return (
    <Comp
      className={variant + "-input"}
      style={{ display: "flex" }}
      onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}
    >
      <div className="ai-input-shell">
        <SparkIcon />
        <input
          ref={ref}
          value={value}
          placeholder={placeholder}
          aria-label="ask ana anything"
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="send-btn" type="submit" disabled={!value.trim()} aria-label="send">
          <SendArrow />
        </button>
      </div>
    </Comp>
  );
}

/* ---------- the dot → line → portal seed (plain CSS, no framer) ---------- */
function Seed({ stage }) {
  const [w, setW] = uS(Math.min(480, (typeof window !== "undefined" ? window.innerWidth : 480) * 0.86));
  uE(() => {
    const f = () => setW(Math.min(480, window.innerWidth * 0.86));
    window.addEventListener("resize", f); return () => window.removeEventListener("resize", f);
  }, []);

  if (stage < 1) return null;

  let shape;
  if (stage >= 3) {
    shape = { width: w, height: 60, borderRadius: 999, backgroundColor: "#ffffff",
      borderColor: "rgba(13,13,13,0.20)",
      boxShadow: "0 18px 50px -28px rgba(107,78,255,0.55)" };
  } else if (stage >= 2) {
    shape = { width: w, height: 1, borderRadius: 999, backgroundColor: "#6B4EFF",
      borderColor: "transparent",
      boxShadow: "0 0 12px 2px rgba(107,78,255,0.4)" };
  } else {
    shape = { width: 4, height: 4, borderRadius: 999, backgroundColor: "#6B4EFF",
      borderColor: "transparent",
      boxShadow: "0 0 18px 4px rgba(107,78,255,0.45)" };
  }
  return <div className="seed-el" style={shape} />;
}

/* ---------- composed page ---------- */
function ComposedPage({ spec, onAsk }) {
  const [introDone, setIntroDone] = uS(false);
  uE(() => { setIntroDone(false); }, [spec]);
  const Body = LAYOUTS[spec.layout] || OffTopic;

  if (spec.layout === "off-topic") {
    return (
      <div className="canvas page-enter">
        <Body spec={spec} onAsk={onAsk} />
      </div>
    );
  }

  const isAbout = spec.layout === "about";
  const isCase = spec.layout === "case-study" || spec.layout === "single-project" || (spec.layout && spec.layout.endsWith("-case"));
  const isContact = spec.layout === "contact";
  /* the real AI answer when the backend sent one, otherwise the flavor intro.
     case pages stay quiet -- diving into the case IS the answer, and a text
     block up top fights the hero. about and contact render the answer INSIDE
     their own layouts (lead / flyer headline). one answer on screen, ever. */
  /* the full gallery always keeps its curated opener (same copy as data.jsx's gallery entry) —
     the AI answer only speaks on other pages */
  const GALLERY_SAY = "every case page wears its project's skin. dive into each universe, and i'll tell you the messy parts if you ask.";
  const say = spec.layout === "gallery" ? GALLERY_SAY : (spec.answer || spec.intro);
  const showSay = !isAbout && !isContact && !isCase && say;

  /* curated work answers (best/worst/themed): two columns — the AI's answer
     pinned left, folders right. the full gallery ("show me your work") keeps
     its original big layout. */
  const isWork = spec.layout === "themed-list" || spec.layout === "quality-showcase";
  if (isWork && showSay) {
    return (
      <div className="canvas canvas-wide page-enter">
        <DoodleLayer doodles={spec.doodles} active={introDone} />
        <div className="work-split">
          <aside className="work-say">
            <div className="ai-says"><span className="dotmark"></span>ana says:</div>
            <div className="ai-intro">
              <span className="ai-ghost" aria-hidden="true">{say}</span>
              <span className="ai-live"><Typewriter text={say} speed={25} onDone={() => setIntroDone(true)} /></span>
            </div>
          </aside>
          <div className="work-body">
            <Body spec={spec} onAsk={onAsk} />
          </div>
        </div>
      </div>
    );
  }

  /* every main page (work, about, contact) closes on the same footer */
const isGallery = spec.layout === "gallery" || isAbout || isContact;
  return (
    <React.Fragment>
      <div className="canvas page-enter">
        <DoodleLayer doodles={spec.doodles} active={introDone} />
        {spec.layout === "gallery" && (
          <div className="page-head" style={{ marginBottom: 40 }}>
            <h1 className="page-title med" dangerouslySetInnerHTML={{ __html: emph(spec.title) }} />
          </div>
        )}
        {showSay && (
          <React.Fragment>
            <div className="ai-says"><span className="dotmark"></span>ana says:</div>
            <div className="ai-intro">
              <span className="ai-ghost" aria-hidden="true">{say}</span>
              <span className="ai-live"><Typewriter text={say} speed={25} onDone={() => setIntroDone(true)} /></span>
            </div>
          </React.Fragment>
        )}
        <Body spec={spec} onAsk={onAsk} />
      </div>
      {isGallery && !spec._embedded && typeof SiteFooter !== "undefined" && (
        <div className="hero-footer"><SiteFooter onAsk={onAsk} /></div>
      )}
    </React.Fragment>
  );
}

/* ---------- app ---------- */
/* ── work nav: hovering "work" drops the project list, each with its own folder
   swatch, so you can jump between cases without going back to the gallery.
   the folder colors come from PROJECT_FOLDER_LOOK (folders.jsx), so a project's
   chip here matches the folder it has on the work page. ── */
const WORK_NAV_IDS = ["manychat-ds", "baw", "bmtax", "canal", "weave", "espm", "releve"];

function MiniFolder({ id }) {
  const look = (typeof PROJECT_FOLDER_LOOK !== "undefined" && PROJECT_FOLDER_LOOK[id]) || {};
  const pal = look.palette || {};
  return (
    <span className="wn-folder" aria-hidden="true">
      <span className="wn-folder-tab" style={{ background: pal.edge || "#cfcbe6" }}></span>
      <span className="wn-folder-body" style={{ background: pal.body || "#dedaf0" }}></span>
      <span className="wn-folder-front" style={{ background: pal.front || "#cfcbe6" }}></span>
    </span>
  );
}

function WorkNavMenu({ submit, spec, mode }) {
  const [open, setOpen] = uS(false);
  const closeTimer = uR(null);

  const show = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  /* a small grace period so crossing the gap between label and panel doesn't close it */
  const hide = () => { closeTimer.current = setTimeout(() => setOpen(false), 140); };
  uE(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const onGallery = mode === "browse" && spec && spec.layout === "gallery";
  const currentId = spec && Array.isArray(spec.items) && spec.items.length === 1 ? spec.items[0] : null;

  return (
    <div className="wn" onMouseEnter={show} onMouseLeave={hide}>
      <button
        className={"nav-link" + (onGallery ? " active" : "")}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => { setOpen(false); submit("show me your work"); }}
        onFocus={show}
      >
        work
      </button>

      <div className={"wn-panel" + (open ? " open" : "")} role="menu" aria-label="projects">
        {WORK_NAV_IDS.map((id) => {
          const p = (typeof PROJECTS !== "undefined" && PROJECTS[id]) || {};
          const name = (p.name || id).replace(/\.$/, "");
          return (
            <button
              key={id}
              role="menuitem"
              className={"wn-item" + (currentId === id ? " current" : "")}
              onClick={() => { setOpen(false); submit("tell me about " + (id === "manychat-ds" ? "manyfest" : id)); }}
            >
              <MiniFolder id={id} />
              <span className="wn-name">{name}</span>
              {p.year ? <span className="wn-year">{p.year}</span> : null}
            </button>
          );
        })}
        <button role="menuitem" className="wn-item wn-all"
          onClick={() => { setOpen(false); submit("show me your work"); }}>
          <span className="wn-name">all work</span>
          <span className="wn-year">→</span>
        </button>
      </div>
    </div>
  );
}

/* body.is-scrolled: the contact page's header scrim keys off this, so the blur only
   shows once the page has actually moved. cheap passive listener, no state churn. */
(function () {
  if (typeof window === "undefined" || window.__scrollFlagWired) return;
  window.__scrollFlagWired = true;
  const sync = () => document.body.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", sync, { passive: true });
  sync();
})();

function App() {
  const [mode, setMode] = uS("hero");          // hero | loading | browse
  const [stage, setStage] = uS(0);
  const [inputValue, setInputValue] = uS("");
  const [spec, setSpec] = uS(null);
  const [phIdx, setPhIdx] = uS(0);
  const [menuOpen, setMenuOpen] = uS(false);
  const timers = uR([]);
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const reqId = uR(0);
  const activeController = uR(null);
  const expectedHash = uR(null); // hash we set ourselves — ignore its hashchange echo
  const workSpecRef = uR(null); // the gallery rendered below the hero
  if (!workSpecRef.current && typeof mockCompose === "function") {
    workSpecRef.current = mockCompose("show me your work");
  }
  /* the about section left the home scroll — a footer closes the page instead */

  /* push tweak values to CSS vars the folder layout reads */
  uE(() => {
    const r = document.documentElement.style;
    r.setProperty("--fld-scale", String(tw.folderSize));
    r.setProperty("--fld-col-gap", tw.colGap + "px");
    r.setProperty("--fld-row-gap", tw.rowGap + "px");
    r.setProperty("--fld-stagger", tw.stagger ? "46px" : "0px");
  }, [tw]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const startReveal = () => {
    clearTimers();
    setStage(0);
    STAGE_TIMES.forEach(([ms, s]) => {
      timers.current.push(setTimeout(() => setStage(s), ms));
    });
  };

  /* on load: deep link straight to the requested page, otherwise run the reveal */
  uE(() => {
    const q = routeToQuestion(window.location.hash);
    if (q) { setStage(8); submit(q); return clearTimers; }
    startReveal();
    return clearTimers;
  }, []);

  /* back/forward: navigate to whatever the hash now says */
  uE(() => {
    const onHash = () => {
      const h = window.location.hash;
      if (expectedHash.current !== null && h === expectedHash.current) { expectedHash.current = null; return; }
      const q = routeToQuestion(h);
      if (q) submit(q);
      else reset();
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* orbs live outside react root — toggle them imperatively */
  uE(() => {
    const orbs = document.querySelectorAll("[data-orb]");
    orbs.forEach((o) => o.classList.toggle("lit", stage >= 7 || mode !== "hero"));
  }, [stage, mode]);

  /* scroll-driven hero → work: the hero scrubs out as you scroll, the input
     glides up and docks into the header, and the gallery lives right below
     in the same scroll. no jump — fully reversible. */
  uE(() => {
    if (mode !== "hero") return;
    let running = true, pDisp = -1;
    let coreEl = null, flyEl = null, slotDoc = null, endGeom = null;
    const lerp = (a, b, t) => a + (b - a) * t;

    /* measure once (and on resize) — no layout reads inside the frame loop */
    const measure = () => {
      coreEl = document.querySelector(".hero-core");
      flyEl = document.querySelector(".hero-fly");
      const slot = document.querySelector(".hero-input-slot");
      if (slot) {
        const r = slot.getBoundingClientRect();
        slotDoc = { top: r.top + window.scrollY, left: r.left, width: r.width };
      }
      const vw = window.innerWidth;
      const endW = Math.min(340, vw * 0.52);
      const links = document.querySelector(".nav-right .nav-links");
      endGeom = { w: endW, top: 26, left: (links ? links.getBoundingClientRect().left : vw - 38) - 26 - endW };
    };

    /* continuous pursuit loop: displayed progress eases toward scroll progress,
       so choppy wheel steps render as one fluid motion. transform-only writes. */
    const frame = () => {
      if (!running) return;
      const vh = window.innerHeight;
      const pT = Math.min(1, window.scrollY / (vh * 0.55));
      pDisp = pDisp < 0 ? pT : pDisp + (pT - pDisp) * 0.18;
      if (Math.abs(pT - pDisp) < 0.001) pDisp = pT;
      const p = pDisp;
      const e = p * p * (3 - 2 * p);

      if (coreEl) {
        coreEl.style.opacity = String(1 - p);
        coreEl.style.transform = "translate3d(0," + (-p * 70) + "px,0) scale(" + (1 - p * 0.04) + ")";
      }
      if (flyEl && slotDoc && endGeom) {
        /* clamp so the input never flies past its header destination */
        const startTop = Math.max(endGeom.top, slotDoc.top - window.scrollY);
        flyEl.style.transform = "translate3d(" + lerp(slotDoc.left, endGeom.left, e) + "px," + lerp(startTop, endGeom.top, e) + "px,0)";
        flyEl.style.setProperty("--fly-w", lerp(slotDoc.width, endGeom.w, e) + "px");
        flyEl.style.setProperty("--fly-h", lerp(60, 40, e) + "px");
        flyEl.style.setProperty("--fly-fs", lerp(16, 13, e) + "px");
        flyEl.style.setProperty("--fly-pl", lerp(20, 14, e) + "px");
        flyEl.style.setProperty("--fly-pr", lerp(8, 6, e) + "px");
        flyEl.style.setProperty("--fly-btn", lerp(42, 30, e) + "px");
        flyEl.style.setProperty("--fly-ico", lerp(18, 15, e) + "px");
        flyEl.classList.add("placed");
      }

      /* keep the URL honest without firing hashchange */
      const aboutEl = document.getElementById("about-preview");
      const aboutTop = aboutEl ? aboutEl.offsetTop : Infinity;
      const want = window.scrollY > aboutTop - vh * 0.5 ? "#/about"
        : (window.scrollY > vh * 0.6 ? "#/work" : "");
      const cur = window.location.hash;
      const scrollHashes = ["", "#/work", "#/about"];
      if (want !== cur && scrollHashes.includes(cur) ) {
        history.replaceState("", document.title, window.location.pathname + window.location.search + want);
      }
      requestAnimationFrame(frame);
    };
    /* scrolling is the browser's. no wheel interception, no snap animation,
       no programmatic scrollTo — the rAF loop above only *reads* scrollY and
       writes transforms, so trackpad, mouse wheel, touch momentum, keyboard
       and scrollbar drag all behave exactly as the platform intends. */
    const onResize = () => measure();
    window.addEventListener("resize", onResize, { passive: true });
    measure();
    requestAnimationFrame(frame);
    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
    };
  }, [mode, stage]);

  /* cycling placeholder */
  uE(() => {
    if (mode !== "hero" || stage < 6 || inputValue) return;
    const id = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDER_CYCLE.length), 3000);
    return () => clearInterval(id);
  }, [mode, stage, inputValue]);

  /* ── how long we're willing to wait on the model before giving the visitor
     the local answer instead. measured sep 2026: a cold / rate-limited
     /api/chat took 38.6s, and repeat calls never came back at all, which is
     what "projects take forever to load" actually was. nothing on this site
     is allowed to block on it again. */
  const CHAT_TIMEOUT_MS = 7000;
  /* a background answer that lands later than this is thrown away: swapping the
     copy under someone who's already reading is worse than not upgrading it. */
  const UPGRADE_WINDOW_MS = 2500;

  /* the local keyword mock in data.jsx already holds every real page, byte for
     byte, so any question it recognises can render with zero network. only a
     genuinely new question needs the model. */
  const localSpec = (q) => {
    if (typeof mockCompose !== "function") return null;
    const s = mockCompose(q);
    if (!s || !s._matched || /no match/.test(s._matched)) return null;
    return s;
  };

  /* asks the real (Claude-backed) endpoint for a PageSpec, falling back to the
     local keyword mock if there's no backend configured, the call fails, or it
     simply takes too long. `signal` still means "a newer question took over". */
  const fetchSpec = async (q, signal) => {
    const bail = new AbortController();
    const relay = () => bail.abort();
    if (signal) signal.addEventListener("abort", relay);
    const timer = setTimeout(() => bail.abort(), CHAT_TIMEOUT_MS);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: bail.signal,
      });
      if (!res.ok) throw new Error("chat api error " + res.status);
      const spec = await res.json();
      if (!spec || !spec.layout) throw new Error("bad spec");
      return { ...spec, _question: q };
    } catch (e) {
      /* only a real supersede propagates; our own timeout falls back quietly */
      if (signal && signal.aborted) {
        const abort = new Error("superseded");
        abort.name = "AbortError";
        throw abort;
      }
      return mockCompose(q);
    } finally {
      clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", relay);
    }
  };

  const submit = async (q) => {
    if (!q || !q.trim()) return;
    setInputValue(q);
    const fromHero = mode === "hero";
    setMode("loading");
    setSpec(null);
    window.scrollTo(0, 0);

    if (activeController.current) activeController.current.abort();
    const controller = new AbortController();
    activeController.current = controller;
    const myReq = ++reqId.current;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    /* a folder dive already played its own transition — skip the staged
       loading beat entirely and let the case page land the moment it's ready */
    const diving = typeof window !== "undefined" && window.__anaDive;
    if (diving) window.__anaDive = false;
    const minDelay = diving ? 0 : (fromHero ? 800 : 560);

    /* keep the URL shareable */
    const syncRoute = (spec) => {
      const route = specToRoute(spec);
      const target = route ? "#" + route : "";
      if (target && window.location.hash !== target) {
        expectedHash.current = target;
        window.location.hash = target;
      }
    };

    /* ── FAST PATH ───────────────────────────────────────────────────────
       every project page, the gallery, about and contact are already here in
       data.jsx. opening one used to POST /api/chat and wait for the model to
       hand back a page the browser could have drawn immediately. now it draws
       immediately, and the model only gets to refine the wording afterwards
       (in the visitor's language), if it's quick enough to matter. */
    const local = localSpec(q);
    if (local) {
      /* start the model now so a fast answer is already in flight, but attach
         the handler only AFTER the page is on screen — the model often beats
         the loading beat, and at that point spec is still null, so swapping
         then would land on nothing and be overwritten a moment later. */
      const pending = fetchSpec(q, controller.signal).catch(() => null);

      await sleep(minDelay); // her staged loading beat, unchanged
      if (reqId.current !== myReq) return;
      setSpec(local);
      setMode("browse");
      syncRoute(local);

      const landed = Date.now();
      pending.then((better) => {
        if (reqId.current !== myReq) return;
        if (Date.now() - landed > UPGRADE_WINDOW_MS) return; // too late, don't yank the copy
        if (!better || better.layout !== local.layout) return;
        if (!better.answer || better.answer === local.answer) return;
        setSpec((cur) => (cur && cur.layout === local.layout ? { ...cur, answer: better.answer } : cur));
      });
      return;
    }

    /* ── free-text question: nothing local matches, so the model is the answer.
       fetchSpec caps itself at CHAT_TIMEOUT_MS and falls back to the mock. */
    let next;
    try {
      [next] = await Promise.all([fetchSpec(q, controller.signal), sleep(minDelay)]);
    } catch (e) {
      return; // aborted (reset or a newer question came in) — do nothing
    }
    if (reqId.current !== myReq) return; // a newer request already took over

    setSpec(next);
    setMode("browse");
    syncRoute(next);
  };

  const reset = () => {
    clearTimers();
    reqId.current++;
    if (activeController.current) activeController.current.abort();
    setSpec(null);
    setInputValue("");
    setPhIdx(0);
    setMode("hero");
    window.scrollTo(0, 0);
    /* clear the hash without firing hashchange or jumping scroll */
    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    startReveal();
  };

  const Wrap = React.Fragment;
  const heroPlaceholder = stage >= 6
    ? PLACEHOLDER_CYCLE[phIdx]
    : (stage >= 4 ? "ask me anything…" : "");

  return (
    <Wrap>
      {/* top chrome */}
      <div className="topbar">
        <div className="logo" style={{ opacity: stage >= 7 || mode !== "hero" ? 1 : 0, transition: "opacity .6s ease" }}
          onClick={reset}>ana<span style={{ fontStyle: "normal" }}>.</span></div>

        <div className="nav-right">
          {mode !== "hero" && (
            <div className="nav-pill-host">
              <AiInput
                variant="nav"
                value={inputValue}
                onChange={setInputValue}
                onSubmit={submit}
                placeholder="ask another…"
              />
            </div>
          )}
          <div className="nav-links" style={{ opacity: stage >= 7 || mode !== "hero" ? 1 : 0, transition: "opacity .6s ease", display: "flex", gap: 26 }}>
            <WorkNavMenu submit={submit} spec={spec} mode={mode} />
            <button className={"nav-link" + (mode === "browse" && spec && spec.layout === "about" ? " active" : "")} onClick={() => submit("who are you")}>about</button>
            <button className={"nav-link" + (mode === "browse" && spec && spec.layout === "contact" ? " active" : "")} onClick={() => submit("are you open to work")}>contact</button>
          </div>
          <button
            className={"nav-burger" + (menuOpen ? " open" : "")}
            aria-label="menu"
            aria-expanded={menuOpen}
            style={{ opacity: stage >= 7 || mode !== "hero" ? 1 : 0, transition: "opacity .6s ease" }}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* mobile nav overlay — tap anywhere to dismiss */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <button className="mm-link" onClick={() => { setMenuOpen(false); submit("show me your work"); }}>work</button>
          <button className="mm-link" onClick={() => { setMenuOpen(false); submit("who are you"); }}>about</button>
          <button className="mm-link" onClick={() => { setMenuOpen(false); submit("are you open to work"); }}>contact</button>
        </div>
      )}

      {/* main stage */}
      {mode === "hero" && (
        <React.Fragment>
          <div className="hero-stage">
            <StickerLayer shown={stage >= 6} />
            <div className="hero-core">
              <div className={"hero-text" + (stage >= 5 ? " shown" : "")}>
                <div className="hero-eyebrow">ai product designer</div>
                <h1 className="hero-title">hi, i'm&nbsp;<em>ana</em>&nbsp;</h1>
                <p className="hero-sub">ask me anything.</p>
              </div>

              {stage < 4 ? (
                <div className="seed-wrap"><Seed stage={stage} /></div>
              ) : (
                <div className="hero-input-slot" aria-hidden="true"></div>
              )}

              <button
                className={"scroll-hint" + (stage >= 6 ? " shown" : "")}
                onClick={() => {
                  const el = document.getElementById("work-preview");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                tabIndex={stage >= 6 ? 0 : -1}
              >
                scroll to see the work <span className="chev">↓</span>
              </button>
            </div>

            {/* the actual input — fixed, scroll-scrubbed between slot and header */}
            {stage >= 4 && (
              <div className="hero-fly">
                <div className="hero-input-fade">
                  <AiInput
                    variant="hero"
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={submit}
                    placeholder={heroPlaceholder}
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>

          {/* the work gallery lives below the hero in the same scroll */}
          <div className="hero-work" id="work-preview">
            {workSpecRef.current && <ComposedPage spec={workSpecRef.current} onAsk={submit} />}
          </div>

          {/* the gallery's ComposedPage appends the footer — the scroll ends there */}
        </React.Fragment>
      )}

      {mode === "loading" && (
        <div className="canvas"><div className="loader"><div className="pulse-dots"><span></span><span></span><span></span></div></div></div>
      )}

      {mode === "browse" && spec && (
        <ComposedPage spec={spec} onAsk={submit} />
      )}

      {/* skip is the only floating control we ship — reset lives on the logo */}
      {mode === "hero" && stage < 8 && (
        <button className="ctl ctl-skip" onClick={() => { clearTimers(); setStage(8); }}>skip reveal →</button>
      )}
    </Wrap>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
