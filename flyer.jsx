/* ════════════════════════════════════════════════════════════
   flyer.jsx — "contact" page. Two columns on flat lavender:
   left = the "ana says" answer; right = the torn paper sheet
   (vector3 background) with two interactive tabs (email, linkedin)
   laid over the gaps. Hover pulls a tab + reveals the contact;
   click copies, flashes "copied!", then the tab tears away and a
   loose strip drops into the pile. Two static strips ("obrigada",
   "see ya") + a "made with care" doodle are decorative only.

   Self-contained: all styles are injected below under .fl2 with
   fresh class names so no external CSS can tilt or flip anything.
   Overrides LAYOUTS.contact.
   ════════════════════════════════════════════════════════════ */

const { useState: useStateFly, useEffect: useEffectFly, useRef: useRefFly } = React;

const FLYER_CSS = `
/* free the contact page from the constrained .canvas wrapper */
body.contact-mode .canvas{max-width:none !important;width:auto !important;
  margin:0 !important;padding:24px 3vw 40px !important;overflow:visible !important}
body.contact-mode .page-enter{overflow:visible !important}
.fl2{width:100%;margin:24px auto 0;display:flex;gap:3vw;align-items:center;justify-content:center;padding:0 3vw;
  font-family:'Archivo',system-ui,sans-serif;color:#23202e}
.fl2 *{box-sizing:border-box}
.fl-left{flex:0 1 400px;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:0}
.fl-status{display:inline-flex;align-items:center;gap:8px;font-family:'Space Mono',monospace;
  font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B4EFF;
  border:1px solid rgba(107,78,255,.28);border-radius:999px;padding:6px 14px;
  background:rgba(107,78,255,.06);margin-bottom:28px;width:fit-content}
.fl-status-dot{width:7px;height:7px;border-radius:50%;background:#6B4EFF;flex:none;
  animation:flpulse 2s ease-in-out infinite}
@keyframes flpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
.fl-answer{font-family:'Playfair Display',serif;font-style:italic;font-weight:600;
  font-size:clamp(30px,4vw,48px);line-height:1.2;color:#201d2b;max-width:13ch;margin:0 0 24px}
.fl-caret{display:inline-block;width:8px;height:.78em;background:#6B4EFF;vertical-align:-2px;
  margin-left:4px;border-radius:1px;animation:flblink 1s steps(1) infinite}
@keyframes flblink{50%{opacity:0}}
.fl-context{font-size:15px;color:#6b6880;margin:0 0 36px;max-width:28ch;line-height:1.6}
.fl-roles{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.fl-role{display:flex;align-items:center;gap:10px;font-family:'Space Mono',monospace;
  font-size:11px;letter-spacing:.08em;color:#4a4560}
.fl-role::before{content:'';display:block;width:18px;height:1px;background:#6B4EFF;flex:none}

.fl-right{flex:0 0 auto;display:flex;justify-content:center;align-items:flex-start;min-width:0;overflow:visible}
.fl-stage{position:relative;width:min(400px,38vw);aspect-ratio:2/3;transform:none;overflow:visible}
.fl-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;
  transform:none !important;rotate:0deg !important;filter:drop-shadow(0 20px 40px rgba(60,40,90,.22));
  border-radius:4px}

/* interactive tabs — CSS-built paper strips hanging off the sheet's tear line */
.fl-tab{position:absolute;margin:0;padding:0;border:0;background:none;cursor:pointer;outline:none;
  z-index:4;-webkit-tap-highlight-color:transparent}
.fl-tab:hover,.fl-tab:focus-visible{z-index:6}
.fl-strip{position:absolute;inset:0;transform-origin:top center;
  transition:transform .35s cubic-bezier(.34,1.3,.5,1), filter .35s}
.fl-paper{position:absolute;inset:0;
  background:linear-gradient(180deg,#fcfbfe 0%,#f4f2f9 55%,#edebf4 100%);
  filter:url(#paper-tear-2) drop-shadow(0 10px 14px rgba(60,40,90,.24))}
.fl-decor .fl-paper{filter:url(#paper-tear-1) drop-shadow(0 8px 12px rgba(60,40,90,.2))}
.fl-hand{position:absolute;left:50%;bottom:40%;transform:translateX(-50%) rotate(-90deg);
  font-family:'Caveat',cursive;font-weight:700;font-size:clamp(16px,2.1vw,23px);
  white-space:nowrap;pointer-events:none;z-index:2}
.fl-icon{position:absolute;left:50%;bottom:6%;transform:translateX(-50%);width:46%;z-index:2}
.fl-icon svg{display:block;width:100%;height:auto;border-radius:22%;
  box-shadow:0 2px 5px rgba(60,40,90,.25)}

/* decorative strips + handwriting on the sheet's own torn stubs */
.fl-decor{position:absolute;pointer-events:none;z-index:2}
.fl-shand{position:absolute;font-family:'Caveat',cursive;font-weight:600;color:#6b6880;
  font-size:clamp(14px,1.8vw,19px);pointer-events:none;white-space:nowrap;z-index:3}

/* hover: subtle pull down */
.fl-tab:not(.pulled):not(.tearing):hover .fl-strip,
.fl-tab:not(.pulled):not(.tearing):focus-visible .fl-strip{
  transform:translateY(10px) rotate(0.8deg);
  filter:drop-shadow(0 10px 14px rgba(60,40,90,.22))
}

/* ── TEAR ANIMATION ─────────────────────────────────────────
   Stretch → resistance → snap → fall.
   Less rotation for landscape strips (they're wide, not tall). */
@keyframes fl-tear {
  0%   { transform: translateY(10px)  rotate(0.8deg);  opacity: 1; }
  18%  { transform: translateY(22px)  rotate(1.5deg);  opacity: 1; }  /* pull */
  30%  { transform: translateY(14px)  rotate(0.2deg);  opacity: 1; }  /* resistance */
  50%  { transform: translateY(30px)  rotate(2.5deg);  opacity: 1; }  /* more pull */
  58%  { transform: translateY(24px)  rotate(-0.4deg); opacity: 1; }  /* snap prep */
  66%  { transform: translateY(50px)  rotate(5deg);    opacity: 1; }  /* SNAP */
  82%  { transform: translateY(130px) rotate(12deg);   opacity: 0.6; }
  100% { transform: translateY(240px) rotate(18deg);   opacity: 0; }
}

.fl-tab.tearing .fl-strip {
  animation: fl-tear 0.72s cubic-bezier(.4,0,.7,1) forwards;
}

/* pulled = terminal hidden state after animation completes */
.fl-tab.pulled .fl-strip {
  opacity: 0 !important;
  transform: translateY(240px) rotate(18deg) !important;
  transition: none;
}
.fl-reveal{position:absolute;left:50%;top:104%;transform:translateX(-50%);white-space:nowrap;z-index:5;
  text-align:center;font-family:'Space Mono',monospace;font-size:10.5px;color:#9a96b5;
  opacity:0;transition:opacity .3s;pointer-events:none}
.fl-reveal b{display:block;font-family:'Archivo',sans-serif;font-weight:600;font-size:12px;color:#201d2b;margin-bottom:3px}
.fl-tab:not(.pulled):not(.tearing):hover .fl-reveal,
.fl-tab:not(.pulled):not(.tearing):focus-visible .fl-reveal{opacity:1}
.fl-copied{position:absolute;left:50%;top:-30px;z-index:5;transform:translateX(-50%) rotate(-7deg);
  font-family:'Caveat',cursive;font-weight:700;font-size:30px;color:#6B4EFF;opacity:0;
  transition:opacity .25s;pointer-events:none}
.fl-tab.copied .fl-copied{opacity:1}

/* static decorative strips */
.fl-sstrip{position:absolute;pointer-events:none}
.fl-sstrip span{position:absolute;left:50%;bottom:18%;transform:translateX(-50%) rotate(-90deg);
  transform-origin:center;white-space:nowrap;font-family:'Space Mono',monospace;
  font-size:12px;letter-spacing:.04em;color:#9a96b5}

/* handwritten doodle */
.fl-doodle{position:absolute;font-family:'Caveat',cursive;font-weight:700;font-size:clamp(15px,2vw,19px);
  color:#6B4EFF;transform:rotate(-5deg);pointer-events:none;white-space:nowrap}

/* polaroid pinned to the sheet's top-right corner */
.fl-pola{position:absolute;right:-8%;top:2%;width:30%;z-index:5;background:#fff;padding:5% 5% 8%;
  border-radius:2px;box-shadow:0 14px 26px -10px rgba(60,40,90,.42);transform:rotate(5deg)}
.fl-pola .fl-ph{width:100%;aspect-ratio:1/1.05;border-radius:1px;overflow:hidden;
  background:linear-gradient(135deg,#cdc7e6,#b4abd6)}
.fl-pola .fl-ph img{width:100%;height:100%;object-fit:cover;display:block}
.fl-pola .fl-cap{font-family:'Caveat',cursive;font-weight:700;font-size:clamp(12px,1.3vw,15px);
  text-align:center;padding-top:6%;color:#201d2b;white-space:nowrap}
.fl-tape{position:absolute;top:-9px;left:50%;transform:translateX(-50%) rotate(-4deg);
  width:52%;height:17px;background:rgba(107,78,255,.22);border:.5px solid rgba(107,78,255,.25)}

/* loose strips pile */
.fl-loose{position:absolute;width:9%;z-index:5;filter:drop-shadow(0 7px 11px rgba(60,40,90,.2));
  opacity:0;animation:fldrop .5s ease forwards}
.fl-pola .fl-ph img{transform:none !important;rotate:0deg !important}
.fl-loose-1{right:3%;bottom:2%;--rot:-12deg}
.fl-loose-2{right:21%;bottom:13%;--rot:9deg}
@keyframes fldrop{from{opacity:0;transform:rotate(var(--rot)) translateY(-16px)}
  to{opacity:1;transform:rotate(var(--rot)) translateY(0)}}

@media(max-width:840px){
  .fl2{flex-direction:column;gap:28px;margin-top:30px}
  .fl-left{flex:0 0 auto;width:100%}
  .fl-stage{width:min(340px,76vw);max-width:none}
}
`;

function ContactFlyer() {
  const [pulled, setPulled] = useStateFly({});
  const [tearing, setTearing] = useStateFly({});
  const [copied, setCopied] = useStateFly(null);
  const timers = useRefFly({});

  useEffectFly(() => {
    document.body.classList.add("contact-mode");
    return () => {
      document.body.classList.remove("contact-mode");
      Object.values(timers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  /* landscape strip tabs
     Stage aspect = 1979/3075 → 1px width ≈ 1.554px height
     For 3.9:1 image at width W%: height% = W * (1/3.9) / 1.554 * 100...
     Simplified: height% = W% * 0.643 / 3.9 → at W=36: h≈5.9% */
  /* Portrait stage ~400×600px. Match decorative strips (left 8–38%) in scale.
     Width 11% ≈ 44px; height 38% ≈ 228px (fills with object-fit:cover).
     Placed right of decorative strips at left 44% and 57%. */
  /* strips hang off the sheet's tear line (~50.5% down the stage).
     the two blank stubs baked into the bg get handwriting overlays;
     these two are real, pullable paper strips built in CSS. */
  const tabs = [
  { id: "linkedin", label: "linkedin", value: "linkedin.com/in/ana-fellipelli", left: 62, top: 50.5, width: 11, height: 42, ink: "#0a66c2",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#0a66c2" />
        <path fill="#fff" d="M7.6 9.6H5.3V18h2.3V9.6zM6.4 8.5a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7zM12.1 13.6c0-1 .5-1.7 1.5-1.7s1.4.7 1.4 1.7V18h2.3v-4.7c0-2.2-1.2-3.3-2.9-3.3-1.3 0-2 .7-2.3 1.3V9.6H9.8V18h2.3v-4.4z" />
      </svg>
    ) },
  { id: "email", label: "email", value: "anacristinafellipelli@gmail.com", left: 74.5, top: 50.5, width: 11, height: 46, ink: "#6B4EFF",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#6B4EFF" />
        <rect x="5.4" y="7.4" width="13.2" height="9.2" rx="1.6" stroke="#fff" strokeWidth="1.6" fill="none" />
        <path d="M6 8.6 12 12.6 18 8.6" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) }];


  const pull = (id, value) => {
    if (pulled[id] || tearing[id]) return;

    // Copy to clipboard immediately
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(() => {});
      }
    } catch (e) {}

    // Start tear animation + copied flash at the same time
    setTearing((t) => ({ ...t, [id]: true }));
    setCopied(id);

    // Clear any stale timers
    ["_pull", "_copied"].forEach((k) => {
      if (timers.current[id + k]) clearTimeout(timers.current[id + k]);
    });

    // After tear animation completes (~720ms), set terminal pulled state
    timers.current[id + "_pull"] = setTimeout(() => {
      setPulled((p) => ({ ...p, [id]: true }));
    }, 720);

    // Show "copied!" for 1200ms, then fade
    timers.current[id + "_copied"] = setTimeout(() => {
      setCopied((c) => c === id ? null : c);
    }, 1200);
  };

  return (
    <div className="fl2">
      <style>{FLYER_CSS}</style>

      <div className="fl-left">
        <div className="fl-status">
          <span className="fl-status-dot" aria-hidden="true"></span>
          available · são paulo
        </div>
        <p className="fl-answer">
          always open to the right thing.
          <span className="fl-caret" aria-hidden="true"></span>
        </p>
        <p className="fl-context">staff or principal product design. ai-first companies preferred.</p>
        <ul className="fl-roles">
          <li className="fl-role">product design · design systems</li>
          <li className="fl-role">senior · staff · principal</li>
          <li className="fl-role">remote or são paulo</li>
        </ul>
      </div>

      <div className="fl-right">
        <div className="fl-stage">
          <img className="fl-bg" src="contact-bg-vector3.png"
          alt="torn paper note that reads: pull a tab, let's talk, hover a tab then click to copy" />

          {/* handwriting on the sheet's own torn stubs */}
          <span className="fl-shand" style={{ left: "27%", top: "64%", transform: "translate(-50%,-50%) rotate(-90deg)" }}>obrigada !</span>
          <span className="fl-shand" style={{ left: "42%", top: "65%", transform: "translate(-50%,-50%) rotate(-90deg)" }}>made w/ care</span>

          {/* extra decorative strip */}
          <span className="fl-decor" style={{ left: "51.5%", top: "50.5%", width: "9%", height: "34%" }}>
            <span className="fl-paper"></span>
            <span className="fl-hand" style={{ color: "#4a4560", fontWeight: 600 }}>see ya !</span>
          </span>

          {/* interactive tabs */}
          {tabs.map((t) => {
            const isPulled = !!pulled[t.id];
            const isTearing = !!tearing[t.id];
            const isCopied = copied === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={"fl-tab" + (isPulled ? " pulled" : "") + (isTearing ? " tearing" : "") + (isCopied ? " copied" : "")}
                style={{ left: t.left + "%", top: t.top + "%", width: t.width + "%", height: t.height + "%" }}
                aria-label={"copy " + t.label + ": " + t.value}
                disabled={isPulled || isTearing}
                onClick={() => pull(t.id, t.value)}>

                <span className="fl-strip">
                  <span className="fl-paper"></span>
                  <span className="fl-hand" style={{ color: t.ink }}>{t.label}</span>
                  <span className="fl-icon">{t.icon}</span>
                </span>
                <span className="fl-reveal">
                  <b>{t.value}</b>click to copy
                </span>
                <span className="fl-copied">copied!</span>
              </button>);

          })}

          {/* polaroid pinned to the sheet's top-right corner */}
          <div className="fl-pola" aria-hidden="true">
            <span className="fl-tape"></span>
            <span className="fl-ph"><img src="ana-photo.png" alt="" loading="lazy" style={{ width: "78px", height: "113px" }} /></span>
            <span className="fl-cap">say hi ✦</span>
          </div>

          {/* loose strips drop into the pile when pulled */}
          {pulled.email && <img className="fl-loose fl-loose-1" src="contact-loose-strip.png" alt="" aria-hidden="true" />}
          {pulled.linkedin && <img className="fl-loose fl-loose-2" src="contact-loose-strip.png" alt="" aria-hidden="true" />}
        </div>
      </div>
    </div>);

}

/* take over the contact page */
if (typeof LAYOUTS !== "undefined") LAYOUTS.contact = ContactFlyer;

Object.assign(window, { ContactFlyer });
