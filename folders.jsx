/* ════════════════════════════════════════════════════════════
   folders.jsx — the "work" page as physical project folders.
   Each project = a paper folder with items peeking out the top.
   Hover → items fan up (staggered, springy). Click → items rise
   further + a type chip tags each one.  Overrides LAYOUTS.gallery.
   ════════════════════════════════════════════════════════════ */

const { useState: useStateF } = React;

/* per-project folder colour families (muted, low-chroma paper tones) */
const FOLDER_PALETTES = {
  sage:     { body: "#CCD7BE", front: "#BECCAB", edge: "#A9BA92", ink: "#46503a" },
  sky:      { body: "#C7CFEA", front: "#B6C0E2", edge: "#9FACD6", ink: "#3b4470" },
  rose:     { body: "#E7CBC4", front: "#DEBBB3", edge: "#CFA79D", ink: "#6e4a42" },
  sand:     { body: "#E9DAB6", front: "#DFCBA1", edge: "#CFB783", ink: "#6b5a30" },
  lavender: { body: "#D9CFE7", front: "#CCC0DF", edge: "#B9AAD2", ink: "#534470" },
  teal:     { body: "#C2D9D2", front: "#B1CCC4", edge: "#99BAB0", ink: "#365650" },
  clay:     { body: "#E2C7B4", front: "#D9B7A0", edge: "#CAA388", ink: "#6b4733" },
  plum:     { body: "#D9C4D3", front: "#CEB4C6", edge: "#BC9FB2", ink: "#5a3f53" },
};

/* per-project folder look — each folder wears a muted paper version of its
   case page's identity, and `hero` is the EXACT hero background the dive
   lands on (sampled from each case's stylesheet), so the color transition
   ends seamlessly on the case page. no two folders share a hue. */
const PROJECT_FOLDER_LOOK = {
  "manychat-ds": { hero: "#8040cf", /* mnf --brand */
    palette: { body: "#D8C4EE", front: "#CBB2E6", edge: "#B698D6", ink: "#4d2f70" } },
  "weave":       { hero: "#1a1f25", /* wv2 --db-350 · autodesk blue tint */
    palette: { body: "#BFD5E4", front: "#ADC8DB", edge: "#93B4CB", ink: "#274257" } },
  "releve":      { hero: "#000000", /* rl --stage · aurora indigo tint */
    palette: { body: "#C5C8EC", front: "#B3B7E3", edge: "#9BA0D4", ink: "#363c74" } },
  "espm":        { hero: "#1f1f1f", /* es --floor · magenta tint */
    palette: { body: "#EBC3D4", front: "#E2B0C7", edge: "#D398B2", ink: "#6d3350" } },
  "canal":       { hero: "#000000", /* cn --ink · studio gray tint */
    palette: { body: "#C9D2D7", front: "#B9C5CB", edge: "#A3B2BA", ink: "#3d4a52" } },
  "baw":         { hero: "#0d0d0d", /* bw --ink · buy-green tint */
    palette: { body: "#BFE3CB", front: "#ABD9BB", edge: "#8FC7A3", ink: "#2f5741" } },
};

/* fan layout per slot index — left edge, rotation, depth, vertical jitter */
const SLOT = [
  { left: "3%",  rot: -8, dz: 2, dy: 12, ty1: -26, ty2: -86 },
  { left: "27%", rot: 5,  dz: 4, dy: 0,  ty1: -34, ty2: -104 },
  { left: "50%", rot: -3, dz: 3, dy: 7,  ty1: -28, ty2: -92 },
  { left: "66%", rot: 10, dz: 5, dy: 3,  ty1: -32, ty2: -98 },
  { left: "40%", rot: 2,  dz: 1, dy: 18, ty1: -22, ty2: -78 },
  { left: "14%", rot: -5, dz: 6, dy: 34, ty1: -30, ty2: -110 },
];

const KIND_SIZE = {
  screen: { w: 84,  h: 162 },
  shot:   { w: 130, h: 150 },
  device: { w: 90,  h: 176 },
  logo:   { w: 86,  h: 138 },
  note:   { w: 112, h: 132 },
  photostrip: { w: 60, h: 184 },
  photo:  { w: 92, h: 118 },
  sticker: { w: 78, h: 78 },
};

function ManychatMark() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" aria-hidden="true">
      <path d="M18.9571 5.0037H18.8204C14.7785 5.0037 12.8139 11.0509 12.8139 11.0509V6.41073H2.1875V19.1643H6.43438V10.6613H8.7V19.1643H13.257C13.257 19.1643 15.5984 9.07149 17.7902 9.82669C19.2673 10.3806 15.1017 19.1551 15.1017 19.1551H21.1193C21.1193 19.1551 21.9539 13.4402 21.9668 11.4626C22.1515 8.10391 21.6216 5 18.9534 5" fill="currentColor"></path>
    </svg>
  );
}

/* the artefact that peeks out of a folder */
function FolderItem({ item }) {
  const { kind } = item;

  if (kind === "photostrip") {
    return (
      <div className="fi fi-photo strip">
        <img src={item.src} alt={item.caption || ""} loading="lazy" />
      </div>
    );
  }

  if (kind === "photo") {
    return (
      <div className="fi fi-polaroid">
        <span className="fi-pol-pic"><img src={item.src} alt={item.caption || ""} loading="lazy" /></span>
      </div>
    );
  }

  if (kind === "sticker") {
    return (
      <div className="fi fi-sticker">
        <span className="fi-sticker-mark"><ManychatMark /></span>
      </div>
    );
  }

  if (kind === "note") {
    return (
      <div className="fi fi-note">
        <span className="fi-note-text">{item.caption}</span>
      </div>
    );
  }

  if (kind === "logo") {
    return (
      <div className="fi fi-logo">
        {item.mark
          ? <span className="fi-logo-mark"><ManychatMark /></span>
          : <span className="fi-logo-mono">{item.caption}</span>}
      </div>
    );
  }

  if (kind === "device") {
    return (
      <div className="fi fi-device">
        <span className="fi-notch"></span>
        {item.src
          ? <img className="fi-img" src={item.src} alt={item.caption || ""} loading="lazy" />
          : <span className="fi-screen"></span>}
        <span className="fi-cap">{item.caption}</span>
      </div>
    );
  }

  if (kind === "screen") {
    return (
      <div className="fi fi-screen-paper">
        <span className="fi-bar"></span>
        {item.src
          ? <img className="fi-img" src={item.src} alt={item.caption || ""} loading="lazy" />
          : <span className="fi-fill"></span>}
        <span className="fi-cap">{item.caption}</span>
      </div>
    );
  }

  /* shot — landscape ui capture (real image when the project ships one) */
  return (
    <div className="fi fi-shot">
      <span className="fi-bar wide"></span>
      {item.src
        ? <img className="fi-img" src={item.src} alt={item.caption || ""} loading="lazy" />
        : <span className="fi-fill"></span>}
      <span className="fi-cap">{item.caption}</span>
    </div>
  );
}

function FolderCard({ id, onAsk }) {
  const p = PROJECTS[id];
  const [open, setOpen] = useStateF(false);
  const [diving, setDiving] = useStateF(false);
  if (!p) return null;
  const isCase = !!p.casePreview;

  /* click → dive: the pocket opens toward you and the camera plunges in
     before the case page takes over. reduced-motion skips straight there.
     the veil is created on <body>, OUTSIDE react — the gallery (and any
     veil rendered inside it) unmounts during the loading stage, so a
     react-owned veil would flash the loader. this one survives the swap
     and only fades once the destination announces itself. */
  const dive = (q) => {
    if (!onAsk) return;
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { onAsk(q); return; }
    setDiving(true);

    const veil = document.createElement("div");
    veil.className = "dive-veil";
    veil.style.background = heroColor;
    document.body.appendChild(veil);

    let done = false;
    const obs = new MutationObserver(() => {
      /* every case page adds a body.<id>-mode class on mount */
      if (/(^|\s)\S+-mode(\s|$)/.test(document.body.className)) dismiss(40);
    });
    const safety = setTimeout(() => dismiss(0), 6000); /* api hiccup — never trap the user */
    const dismiss = (delay) => {
      if (done) return; done = true;
      clearTimeout(safety);
      obs.disconnect();
      setTimeout(() => {
        /* deterministic fade-out: pin the current state inline, then transition */
        veil.style.animation = "none";
        veil.style.opacity = "1";
        veil.style.transition = "opacity .28s ease";
        requestAnimationFrame(() => { veil.style.opacity = "0"; });
        setTimeout(() => veil.remove(), 380);
      }, delay);
    };

    setTimeout(() => {
      obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
      window.__anaDive = true; /* tells the app to skip its staged loading delay */
      onAsk(q);
    }, 380);
  };

  const look = PROJECT_FOLDER_LOOK[id];
  const pal = (look && look.palette) || FOLDER_PALETTES[p.palette] || FOLDER_PALETTES.sage;
  const heroColor = (look && look.hero) || pal.edge;
  const items = p.items || [];

  const style = {
    "--f-body": pal.body,
    "--f-front": pal.front,
    "--f-edge": pal.edge,
    "--f-ink": pal.ink,
  };

  const tabName = p.name.replace(/\.$/, "");
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  return (
    <div className="folder-cell">
      <div
        className={"folder" + (open || diving ? " open" : "") + (diving ? " diving" : "")}
        style={style}
        onClick={() => {
          if (diving) return;
          if (isCase) { dive("open the full weave case"); return; }
          if (canHover) { dive("tell me about " + tabName); return; }
          if (!open) { setOpen(true); return; }
          dive("tell me about " + tabName);
        }}
        onMouseLeave={() => { if (!diving) setOpen(false); }}
      >
        <div className="folder-stage">
          {/* back wall + tab */}
          <div className="f-tab"><span>{tabName}</span></div>
          <div className="f-back"></div>

          {/* peeking artefacts */}
          <div className="f-items">
            {items.map((it, i) => {
              const slot = SLOT[i] || SLOT[SLOT.length - 1];
              const sz = KIND_SIZE[it.kind] || KIND_SIZE.shot;
              const iStyle = {
                left: slot.left,
                width: sz.w,
                height: sz.h,
                zIndex: slot.dz,
                "--rot": slot.rot + "deg",
                "--dy": (it.dy != null ? it.dy : slot.dy) + "px",
                "--ty1": slot.ty1 + "px",
                "--ty2": slot.ty2 + "px",
                transitionDelay: (i * 60) + "ms",
              };
              return (
                <div className="f-item" key={i} style={iStyle}>
                  <FolderItem item={it} />
                  <span className="f-chip">{it.label}</span>
                </div>
              );
            })}
          </div>

          {/* front pocket — crops the artefacts */}
          <div className="f-front">
            <span className="f-front-lip"></span>
          </div>

          {p.stamp && (
            <div className="f-stamp" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2.4l2.74 6.0 6.56.62-4.95 4.36 1.46 6.42L12 16.9l-5.81 3.3 1.46-6.42L2.7 9.42l6.56-.62z" fill="currentColor" />
              </svg>
            </div>
          )}
          {p.logoSticker && (
            <div className="f-logo-sticker" aria-hidden="true">
              <ManychatMark />
            </div>
          )}

          {/* the folder's interior morphs to the exact case hero color as it opens */}
          {diving && <div className="f-dive-fill" style={{ background: heroColor }} aria-hidden="true" />}
        </div>
      </div>

      <div className="folder-label">
        <div className="fl-top">
          <h3 className="fl-name">{p.displayName || tabName}</h3>
        </div>
        <div className="fl-meta">{(p.displayName ? tabName : p.company)} · {p.year}</div>
        <div className="fl-tags">
          {(p.tags || [p.tag]).map((t, i) => (
            <span className="fl-tag" key={"t" + i}>{t}</span>
          ))}
          {(p.platforms || []).map((pf, i) => (
            <span className="fl-tag" key={"p" + i}>{pf}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* the work page */
function FolderGallery({ spec, onAsk }) {
  return (
    <div>
      <div className="page-head">
        <h1 className="page-title med" dangerouslySetInnerHTML={{ __html: emph(spec.title) }} />
        <p className="page-sub">{spec.subtitle}</p>
      </div>
      <p className="folder-hint">hover to peek · click to open a folder</p>
      <div className="folder-grid">
        {spec.items.map((id) => (
          <FolderCard key={id} id={id} onAsk={onAsk} />
        ))}
      </div>
    </div>
  );
}

/* take over the "work" page */
if (typeof LAYOUTS !== "undefined") LAYOUTS.gallery = FolderGallery;

/* homepage navigation shortcut — the "work" pile image */
function FolderStack({ onAsk, shown }) {
  return (
    <button
      type="button"
      className={"folder-stack" + (shown ? " shown" : "")}
      onClick={() => onAsk && onAsk("show me your work")}
      aria-label="see selected work"
    >
      <img className="fs-img" src="work-pile.png" alt="selected work" />
      <span className="fs-label">selected work →</span>
    </button>
  );
}

Object.assign(window, { FolderCard, FolderItem, FolderGallery, FolderStack });
