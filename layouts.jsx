/* ════════════════════════════════════════════════════════════
   layouts.jsx — 8 distinct composed-page layouts + shared atoms
   ════════════════════════════════════════════════════════════ */

const { useState: useStateL, useEffect: useEffectL, useRef: useRefL, useLayoutEffect: useLayoutEffectL } = React;

/* ---------- typewriter for the "ana says:" intro ---------- */
function Typewriter({ text, speed = 25, onDone }) {
  const [n, setN] = useStateL(0);
  useEffectL(() => {
    setN(0);
    if (!text) { onDone && onDone(); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) { clearInterval(id); onDone && onDone(); }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  const done = n >= (text ? text.length : 0);
  return (
    <span>
      {text ? text.slice(0, n) : ""}
      {!done && <span className="caret blink">▌</span>}
    </span>
  );
}

/* ---------- project card ---------- */
function ProjectCard({ id, onAsk }) {
  const p = PROJECTS[id];
  const [broken, setBroken] = useStateL(false);
  if (!p) return null;
  const thumbSrc = (p.items || []).find((it) => it.src);
  const showImg = thumbSrc && !broken;
  return (
    <div className="proj-card" onClick={() => onAsk && onAsk("tell me about " + p.name.replace(".", ""))}>
      <div className={"proj-thumb" + (showImg ? " has-img" : "")}>
        {showImg
          ? <img src={thumbSrc.src} alt="" loading="lazy" onError={() => setBroken(true)} />
          : <span className="glyph">{p.name[0]}</span>}
      </div>
      <h3 className="proj-name">{p.name}</h3>
      <div className="proj-meta">{p.year} · {p.role}</div>
      <p className="proj-desc">{p.desc}</p>
    </div>
  );
}

/* ---------- next-project footer (shared across every project/case page) ---------- */
const PROJECT_NAV = [
  { id: "manychat-ds", label: "manyfest.", q: "tell me about manychat" },
  { id: "weave", label: "weave.", q: "open the full weave case" },
  { id: "releve", label: "(r)elevē.", q: "tell me about releve" },
  { id: "espm", label: "espm.", q: "tell me about espm" },
  { id: "canal", label: "canal.", q: "tell me about canal" },
  { id: "baw", label: "baw.", q: "tell me about baw" },
];

function NextProjectFooter({ currentId, onAsk }) {
  const idx = PROJECT_NAV.findIndex((p) => p.id === currentId);
  if (idx === -1) return null;
  const next = PROJECT_NAV[(idx + 1) % PROJECT_NAV.length];
  const others = PROJECT_NAV.filter((p) => p.id !== currentId && p.id !== next.id);
  return (
    <div className="proj-footer">
      <span className="pf-label">next project</span>
      <button className="pf-next-link" onClick={() => onAsk && onAsk(next.q)}>
        {next.label}<span className="arr">→</span>
      </button>
      <div className="pf-all">
        <span className="pf-label">or jump to</span>
        <div className="pf-pills">
          {others.map((p) => (
            <button className="pf-pill" key={p.id} onClick={() => onAsk && onAsk(p.q)}>{p.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- justified image grid: the Flickr/Google-Photos technique.
   Greedily packs images into rows at a target height, then solves each
   row's own height so its images' natural widths sum to exactly fill the
   container — every row is justified independently, so this holds up
   whether a project has 2 images or 6, not just a single row. ---------- */
function JustifiedRow({ items, targetH = 300, minH = 160, maxH = 480, gap = 16, className = "" }) {
  const ref = useRefL(null);
  const [width, setWidth] = useStateL(0);

  useLayoutEffectL(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!items || !items.length) return null;
  const w = width || 900;

  const rows = [];
  let current = [];
  let widthAtTarget = 0;
  items.forEach((it) => {
    const ratio = it.w && it.h ? it.w / it.h : 1.5;
    const thisWidth = ratio * targetH;
    if (current.length > 0 && widthAtTarget + gap + thisWidth > w) {
      rows.push(current);
      current = [];
      widthAtTarget = 0;
    }
    if (current.length > 0) widthAtTarget += gap;
    widthAtTarget += thisWidth;
    current.push({ it, ratio });
  });
  if (current.length) rows.push(current);

  return (
    <div className={className} ref={ref}>
      {rows.map((row, ri) => {
        const sumRatios = row.reduce((a, r) => a + r.ratio, 0);
        const gapTotal = gap * (row.length - 1);
        const isLastRow = ri === rows.length - 1;
        let h = (w - gapTotal) / sumRatios;
        // a lone image (last row, or one that didn't quite fit next to its neighbor)
        // should never get stretched to fill the whole row by itself
        if ((isLastRow || row.length === 1) && h > targetH) h = targetH;
        h = Math.max(minH, Math.min(maxH, h));
        return (
          <div key={ri} style={{ display: "flex", gap, marginBottom: ri < rows.length - 1 ? gap : 0 }}>
            {row.map(({ it, ratio }, i) => {
              const isPhone = ratio < 0.59;
              const img = (
                <img src={it.src} alt={it.caption || ""} loading="lazy" style={{ height: "100%", width: "auto", display: "block" }} />
              );
              return (
                <div className="shot has-img" key={i} style={{ height: h }}>
                  {isPhone ? <div className="phone-frame">{img}</div> : img}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- 1. single-project ---------- */
function SingleProject({ spec, onAsk }) {
  const id = spec.items[0];
  const p = PROJECTS[id] || {};
  const shots = (p.items || []).filter((it) => it.src);
  const [main, ...rest] = shots;
  const gridClass = shots.length === 0 ? "" : shots.length === 1 ? "solo" : shots.length === 2 ? "duo" : "many";
  const prose = [
    ["problem",  (p.case && p.case.problem)  || ""],
    ["solution", (p.case && p.case.solution) || ""],
    ["outcome",  (p.case && p.case.outcome)  || ""],
  ].filter(([, b]) => b);
  return (
    <div>
      <button className="back-btn sp-back" onClick={() => onAsk && onAsk("show me your work")}>← back to work</button>
      <span className="sp-eyebrow">{p.year}{p.role ? " · " + p.role : ""}</span>
      <h1 className="sp-title" dangerouslySetInnerHTML={{ __html: emph(spec.title) }} />
      {spec.subtitle && <p className="sp-lead">{spec.subtitle}</p>}
      {p.liveUrl && (
        <a className="live-link" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
          <span className="dot" /><span className="dot" /><span className="dot" />
          <span className="live-link-tag">live site</span>
          <span className="live-link-url">{p.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
          <span className="live-link-arr">↗</span>
        </a>
      )}
      {shots.length > 0 && (
        <div className={"sp-imgrid " + gridClass}>
          {main && <div className={"shot img-main" + (main.src ? " has-img" : "")}>{main.src && <img src={main.src} alt={main.caption || ""} loading="lazy" />}</div>}
          {rest.slice(0, 3).map((it, i) => (
            <div className={"shot" + (it.src ? " has-img" : "")} key={i}>{it.src && <img src={it.src} alt={it.caption || ""} loading="lazy" />}</div>
          ))}
        </div>
      )}
      {prose.length > 0 && (
        <div className="sp-editorial-prose">
          {prose.map(([label, body]) => (
            <div className="sp-ep-row" key={label}>
              <div className="sp-ep-label">{label}</div>
              <p className="sp-ep-body">{body}</p>
            </div>
          ))}
        </div>
      )}
      <NextProjectFooter currentId={id} onAsk={onAsk} />
    </div>
  );
}

/* ---------- 2. gallery ---------- */
function Gallery({ spec, onAsk }) {
  return (
    <div>
      <div className="page-head">
        <h1 className="page-title med" dangerouslySetInnerHTML={{ __html: emph(spec.title) }} />
        <p className="page-sub">{spec.subtitle}</p>
      </div>
      <div className="grid grid-3" style={{ marginTop: 36 }}>
        {spec.items.map((id) => <ProjectCard key={id} id={id} onAsk={onAsk} />)}
      </div>
    </div>
  );
}

/* ---------- 3. quality-showcase ---------- */
function QualityShowcase({ spec, onAsk }) {
  return (
    <div>
      <h1 className="page-title huge" dangerouslySetInnerHTML={{ __html: emphItalic(spec.title) }} />
      <p className="page-sub">{spec.subtitle}</p>
      <div className="qs-evidence-label">the evidence</div>
      <div className="grid grid-2">
        {spec.items.map((id) => <ProjectCard key={id} id={id} onAsk={onAsk} />)}
      </div>
      <div className="qs-foot">what shaped this → two design systems, a thousand tokens, and an allergy to one-off components.</div>
    </div>
  );
}

/* ---------- 4. themed-list ---------- */
function ThemedList({ spec, onAsk }) {
  /* the physical folders (folders.jsx) are the site's signature — use them
     here too when they're loaded, with each project's description below */
  const useFolders = typeof FolderCard !== "undefined";
  return (
    <div>
      <p className="page-sub mono" style={{ marginTop: 0, marginBottom: 18 }}>{spec.subtitle}</p>
      <div className="page-head">
        <h1 className="page-title med" dangerouslySetInnerHTML={{ __html: emph(spec.title) }} />
      </div>
      <div className={useFolders ? "folder-grid" : "grid grid-3"} style={{ marginTop: 32 }}>
        {spec.items.map((id) => useFolders
          ? <FolderCard key={id} id={id} onAsk={onAsk} showDesc />
          : <ProjectCard key={id} id={id} onAsk={onAsk} />)}
      </div>
    </div>
  );
}

/* ---------- 5. honest-list ---------- */
function HonestList({ spec, onAsk }) {
  return (
    <div>
      <div className="page-head">
        <h1 className="page-title med" dangerouslySetInnerHTML={{ __html: emph(spec.title) }} />
        <p className="page-sub">{spec.subtitle}</p>
      </div>
      <div className="honest">
        {spec.items.map((it, i) => {
          const p = PROJECTS[it.project];
          return (
            <div className="honest-row" key={i} onClick={() => onAsk && onAsk("tell me about " + (p ? p.name.replace(".", "") : ""))}>
              <span className="thing">{it.text}</span>
              <span className="to">→ {p ? p.name : it.project}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 6. about ---------- */
function About({ spec }) {
  const badgeRef = React.useRef(null);
  /* embedded on the home scroll — don't retint the whole page */
  const embedded = !!(spec && spec._embedded);

  React.useEffect(() => {
    if (!embedded) document.body.classList.add("about-mode");
    const root = badgeRef.current;
    const v = root && root.querySelector("video");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanupVid = () => {};
    if (v && !reduce) {
      const play = () => { try { v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} };
      const stop = () => { try { v.pause(); v.currentTime = 0; } catch (e) {} };
      if (window.matchMedia("(hover: hover)").matches) {
        v.addEventListener("mouseenter", play);
        v.addEventListener("mouseleave", stop);
        cleanupVid = () => { v.removeEventListener("mouseenter", play); v.removeEventListener("mouseleave", stop); };
      } else {
        v.addEventListener("click", play);
        cleanupVid = () => v.removeEventListener("click", play);
      }
      /* play once on entry as a cue, then settle back to the poster */
      const cue = () => { try { v.pause(); v.currentTime = 0; } catch (e) {} };
      const introTimer = setTimeout(() => {
        play();
        v.addEventListener("ended", cue, { once: true });
      }, 500);
      const prevCleanup = cleanupVid;
      cleanupVid = () => { clearTimeout(introTimer); v.removeEventListener("ended", cue); prevCleanup(); };
    }
    return () => { if (!embedded) document.body.classList.remove("about-mode"); cleanupVid(); };
  }, []);

  const experience = [
    {
      role: "senior product designer", org: "manychat", date: "september 2025 to current",
      bullets: [
        "co-lead manychat's ai agentic design system, Manyfest, built from the ground up across desktop, ios, and android, supporting more than 1.5 million people worldwide.",
        "define the foundations: typography, color, spacing, and design tokens, so the product feels like one coherent thing on every platform.",
        "partner with product and ai teams to build adaptive, agentic ux patterns and context aware components, so the interface responds to intent instead of fixed flows.",
        "build ai agents for developer handoff, component readiness review, and accessibility checks, to speed up and standardize the design to development pipeline.",
        "steward documentation, governance, and adoption so the system scales responsibly without fragmenting.",
      ],
      impact: "one token architecture across desktop, ios, and android for a product serving 1.5m+ businesses · 14 ai agents in the component pipeline, from scaffolding to release notes · guidelines-first model: every component specced for humans and agents before it ships.",
    },
    {
      role: "product designer", org: "globant · autodesk, weave", date: "march 2022 to 2025",
      bullets: [
        "contributed to weave, autodesk's cross platform design system, the foundation behind flagship products like autocad, fusion, revit, and maya, used by thousands of designers and engineers worldwide.",
        "led the evolution of core components, tokens, and guidelines across three densities (compact, comfortable, spacious) and three themes (light, dark gray, high contrast dark blue).",
        "played a key role in the may 2025 release of 14 new components, expanding weave's reach and improving implementation efficiency.",
        "partnered with engineering and design leadership to align weave with autodesk's vision for unified ux and scalable design ops.",
      ],
      impact: "scaled across autocad, fusion, and revit · token and component logic for 3 densities by 3 themes · 14 core components in the may 2025 release · standardized documentation and qa.",
    },
    {
      role: "ux designer jr", org: "ericsson", date: "july 2021 to march 2022",
      bullets: [
        "designed and prototyped interfaces for ericsson's enterprise and telecom work, supporting clients like claro flex and são martinho.",
        "led user research and validation with qualitative methods and moderated a/b tests, finding friction points and lifting task efficiency across key journeys.",
        "used design thinking to turn complex business and engineering problems, including 5g industrial solutions for são martinho, into scalable, accessible tools.",
        "worked closely with engineering, product, and business to align strategy with execution.",
      ],
      sub: [
        {
          role: "user experience intern", date: "november 2020 to july 2021 · hybrid",
          bullets: [
            "supported ux research and interface design for ericsson's internal and client platforms, in explorations that later fed the company's design system direction.",
            "ran usability testing, accessibility reviews, and interface documentation to smooth the design to engineering handoff.",
            "conducted and analyzed 20+ usability sessions, and helped set early documentation and accessibility standards.",
          ],
        },
      ],
    },
  ];

  const education = [
    { org: "elisava, barcelona", date: "2025 to 2026", detail: "master in human interaction and artificial intelligence" },
    { org: "mit xpro", date: "2023", detail: "designing ai products and services" },
    { org: "parsons, new school of new york", date: "2020", detail: "intro to ux: user research" },
    { org: "escola superior de propaganda e marketing (espm), brazil", date: "2018 to 2021", detail: "bachelor in visual design, emphasis in marketing" },
    { org: "colégio visconde de porto seguro", date: "2015 to 2017", detail: "technical course: foreign trade" },
  ];

  const languages = [
    { k: "portuguese", v: "native" },
    { k: "english", v: "fluent" },
    { k: "spanish", v: "fluent" },
  ];

  return (
    <div className="about-page">
      <div className="about-grid" style={{ margin: "50px 0px 0px" }}>
        <div className="about-badge" ref={badgeRef}>
          <video className="badge-video" id="badge" muted playsInline preload="auto" poster="poster.jpg">
            <source src="badge-loop.mp4" type="video/mp4" />
          </video>
          <span className="badge-hint"></span>
        </div>
        <div className="about-answer">
          <div className="ana-says">
            <span className="ana-av" aria-hidden="true"></span>
            <span className="ana-says-label">ana says:</span>
          </div>
          <p className="about-lead">{(spec && spec.answer) || "born in são paulo, started in ballet, ended up designing with ai. five years in, still learning."}</p>
          <ul className="about-values">
            <li>systems thinker</li>
            <li>ai-native</li>
            <li>brazilian warmth</li>
            <li>portuguese</li>
            <li>english</li>
            <li>spanish</li>
          </ul>
          <div className="about-now">
            <div className="k">currently focused on</div>
            <div className="v">teaching design systems to work with ai instead of around it.</div>
          </div>
        </div>
      </div>

      <section className="about-section">
        <div className="as-label">about</div>
        <div className="as-content">
          <p className="as-para">i started in ballet. that's where i first learned structure, discipline, and how much the tiny details matter. it slowly turned into a love for design, technology, and building things that hold up when they grow.</p>
          <p className="as-para">i'm a product designer who works end to end, from the messy problem to the shipped thing. lately a lot of that is figuring out where ai actually belongs in a product: agentic flows, interfaces that respond to intent instead of fixed paths, and ai i build to take the tedious work off my own plate. i also build design systems, because good products need a foundation that scales, but i always keep the system in service of the product.</p>
        </div>
      </section>

      <section className="about-section">
        <div className="as-label">experience</div>
        <div className="as-content">
          {experience.map((x, i) => (
            <div className="xp" key={i}>
              <div className="xp-head">
                <h3 className="xp-role">{x.role} <span className="xp-org">{x.org}</span></h3>
                <span className="xp-date">{x.date}</span>
              </div>
              <ul className="xp-bullets">
                {x.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
              {x.impact && <p className="xp-impact"><span>impact</span>{x.impact}</p>}
              {x.sub && x.sub.map((s, k) => (
                <div className="xp-sub" key={"s" + k}>
                  <div className="xp-head">
                    <h4 className="xp-subrole">{s.role}{s.org ? <span className="xp-org"> {s.org}</span> : null}</h4>
                    <span className="xp-date">{s.date}</span>
                  </div>
                  <ul className="xp-bullets">
                    {s.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="as-label">education</div>
        <div className="as-content">
          {education.map((e, i) => (
            <div className="edu" key={i}>
              <div className="xp-head">
                <h3 className="xp-role">{e.org}</h3>
                <span className="xp-date">{e.date}</span>
              </div>
              <p className="edu-detail">{e.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="as-label">languages</div>
        <div className="as-content">
          <div className="lang-row">
            {languages.map((l, i) => (
              <div className="lang" key={i}>
                <span className="lang-k">{l.k}</span>
                <span className="lang-v">{l.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="as-label">outside work</div>
        <div className="as-content">
          <p className="as-para outside">outside work i still dance, chase new places, and spend a lot of time with family and friends.</p>
        </div>
      </section>
    </div>
  );
}

/* ---------- 7. contact ---------- */
function Contact({ spec }) {
  const blocks = [
    { k: "email", v: "ana@fellipelli.co", href: "mailto:ana@fellipelli.co" },
    { k: "phone", v: "+55 11 ····", href: "#" },
    { k: "linkedin", v: "/in/anafellipelli", href: "#" },
  ];
  return (
    <div>
      <div className="page-head">
        <h1 className="page-title big" dangerouslySetInnerHTML={{ __html: emph(spec.title) }} />
        <p className="page-sub">{spec.subtitle}</p>
      </div>
      <div className="contact-grid">
        {blocks.map((b) => (
          <a className="contact-block" href={b.href} key={b.k} onClick={(e) => b.href === "#" && e.preventDefault()}>
            <div className="k">{b.k}</div>
            <div className="v">{b.v}</div>
            <div className="arr">↗</div>
          </a>
        ))}
      </div>
      <div className="obrigada">obrigada!</div>
    </div>
  );
}

/* ---------- 8. off-topic ---------- */
const OFFTOPIC_SUGGESTIONS = [
  "what's your best work?",
  "tell me about manyfest",
  "do you still dance?",
  "why should we hire you?",
];

function OffTopic({ spec, onAsk }) {
  return (
    <div className="offtopic">
      <div className="big">{spec.big}</div>
      <div className="ot-try">
        <span className="ot-try-label">but i'm happy to answer:</span>
        <div className="ot-chips">
          {OFFTOPIC_SUGGESTIONS.map((q) => (
            <button className="ot-chip" key={q} onClick={() => onAsk && onAsk(q)}>{q}</button>
          ))}
        </div>
      </div>
      <button className="back-btn" onClick={() => onAsk && onAsk("show me your work")}>ok, back to work →</button>
    </div>
  );
}

/* ---------- site footer — contacts + about, shared by home and work ---------- */
function SiteFooter({ onAsk }) {
  return (
    <footer className="site-footer">
      <span className="sf-logo">ana.</span>
      <nav className="sf-links" aria-label="footer">
        <button className="sf-link" onClick={() => onAsk && onAsk("who are you")}>about me →</button>
        <a className="sf-link" href="mailto:anacristinafellipelli@gmail.com">email ↗</a>
        <a className="sf-link" href="https://www.linkedin.com/in/ana-fellipelli/" target="_blank" rel="noreferrer noopener">linkedin ↗</a>
        <button className="sf-link" onClick={() => onAsk && onAsk("are you open to work")}>contact →</button>
      </nav>
    </footer>
  );
}

/* ---------- spec drawer (devtools easter egg) ---------- */
function SpecDrawer({ spec }) {
  const [open, setOpen] = useStateL(false);
  const clean = { ...spec };
  delete clean._matched; delete clean._question;
  const json = JSON.stringify(clean, null, 2);
  return (
    <div className="spec-drawer">
      <button className="spec-toggle" onClick={() => setOpen(!open)}>
        show response spec {open ? "↑" : "↓"}
      </button>
      {open && (
        <div className="spec-body">
          <pre dangerouslySetInnerHTML={{ __html: colorizeJSON(json) }} />
        </div>
      )}
    </div>
  );
}

/* ---------- layout switch ---------- */
const LAYOUTS = {
  "single-project": SingleProject,
  "gallery": Gallery,
  "quality-showcase": QualityShowcase,
  "themed-list": ThemedList,
  "honest-list": HonestList,
  "about": About,
  "contact": Contact,
  "off-topic": OffTopic,
};

/* ---------- helpers ---------- */
function emph(s) {
  // wrap *word* in <em>
  return (s || "").replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
function emphItalic(s) {
  // whole title in italic em for quality-showcase
  return "<em>" + emph(s) + "</em>";
}
function colorizeJSON(json) {
  return json
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"([^"]+)":/g, '<span class="tok-key">"$1"</span><span class="tok-punc">:</span>')
    .replace(/: "([^"]*)"/g, ': <span class="tok-str">"$1"</span>')
    .replace(/([{}\[\],])/g, '<span class="tok-punc">$1</span>');
}

Object.assign(window, {
  Typewriter, ProjectCard, SpecDrawer, LAYOUTS, NextProjectFooter, PROJECT_NAV, JustifiedRow,
  SingleProject, Gallery, QualityShowcase, ThemedList, HonestList, About, Contact, OffTopic,
  SiteFooter,
});
