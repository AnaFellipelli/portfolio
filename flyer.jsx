/* ════════════════════════════════════════════════════════════
   flyer.jsx — "contact" page. Two columns on flat lavender:
   left = the "ana says" answer + roles; right = two physical
   objects with a chrome/disco finish:
     · an EMAIL ENVELOPE sealed with a mirrored disco heart —
       hover lifts it and slides the letter out; click copies.
     · a LINKEDIN BADGE on a lanyard with a chrome star (wearing
       sunglasses) — hover makes it swing; click copies.

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
.fl2{width:100%;margin:24px auto 0;display:flex;gap:4vw;align-items:center;justify-content:center;padding:0 3vw;
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
.fl-answer.long{font-family:'Archivo',system-ui,sans-serif;font-style:normal;font-weight:450;
  font-size:clamp(16px,1.5vw,20px);line-height:1.65;max-width:38ch}
.fl-caret{display:inline-block;width:8px;height:.78em;background:#6B4EFF;vertical-align:-2px;
  margin-left:4px;border-radius:1px;animation:flblink 1s steps(1) infinite}
@keyframes flblink{50%{opacity:0}}
.fl-context{font-size:15px;color:#6b6880;margin:0 0 36px;max-width:28ch;line-height:1.6}
.fl-roles{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.fl-role{display:flex;align-items:center;gap:10px;font-family:'Space Mono',monospace;
  font-size:11px;letter-spacing:.08em;color:#4a4560}
.fl-role::before{content:'';display:block;width:18px;height:1px;background:#6B4EFF;flex:none}

/* ── right: the two objects ─────────────────────────────── */
.fl-right{flex:0 0 auto;display:flex;justify-content:center;align-items:flex-start;min-width:0;overflow:visible}
.fl-objects{display:flex;gap:clamp(28px,4vw,64px);align-items:flex-start}
.fl-obj{position:relative;margin:0;padding:0;border:0;background:none;cursor:pointer;outline:none;
  -webkit-tap-highlight-color:transparent;display:flex;flex-direction:column;align-items:center}
.fl-obj:focus-visible{outline:2px solid #6B4EFF;outline-offset:8px;border-radius:12px}

/* hover reveal label under each object */
.fl-obj-label{margin-top:22px;text-align:center;font-family:'Space Mono',monospace;
  font-size:10.5px;color:#9a96b5;opacity:0;transition:opacity .3s;white-space:nowrap}
.fl-obj-label b{display:block;font-family:'Archivo',sans-serif;font-weight:600;font-size:12px;
  color:#201d2b;margin-bottom:3px}
.fl-obj:hover .fl-obj-label,.fl-obj:focus-visible .fl-obj-label{opacity:1}

/* copied! flash */
.fl-copied2{position:absolute;left:50%;top:-34px;z-index:6;transform:translateX(-50%) rotate(-7deg);
  font-family:'Caveat',cursive;font-weight:700;font-size:30px;color:#6B4EFF;opacity:0;
  transition:opacity .25s;pointer-events:none}
.fl-obj.copied .fl-copied2{opacity:1}

/* ── the envelope (email) ───────────────────────────────── */
.fl-env-wrap{position:relative;width:clamp(230px,24vw,300px);aspect-ratio:1.5;
  transition:transform .4s cubic-bezier(.34,1.3,.5,1)}
.fl-obj:hover .fl-env-wrap{transform:translateY(-8px) rotate(-1.2deg)}
.fl-env-back{position:absolute;inset:0;border-radius:10px;
  background:linear-gradient(180deg,#fcfbfe 0%,#f1eff8 60%,#e9e6f2 100%);
  box-shadow:0 22px 40px -14px rgba(60,40,90,.35)}
.fl-env-letter{position:absolute;left:7%;right:7%;top:6%;height:64%;background:#fff;border-radius:6px;
  box-shadow:0 4px 10px rgba(60,40,90,.14);display:flex;align-items:flex-start;justify-content:center;
  padding-top:7%;transition:transform .45s cubic-bezier(.34,1.3,.5,1)}
.fl-env-letter span{font-family:'Caveat',cursive;font-weight:700;font-size:clamp(17px,1.9vw,22px);color:#201d2b}
.fl-obj:hover .fl-env-letter{transform:translateY(-16%)}
/* front pocket with two diagonal folds */
.fl-env-front{position:absolute;inset:0;border-radius:10px;overflow:hidden;
  clip-path:polygon(0 34%,50% 66%,100% 34%,100% 100%,0 100%)}
.fl-env-front::before{content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,#f6f4fb 0%,#eceaf5 55%,#e2dfee 100%)}
.fl-env-front::after{content:'';position:absolute;inset:0;
  background:
    linear-gradient(118deg,transparent 49.6%,rgba(60,40,90,.10) 50%,transparent 50.5%),
    linear-gradient(-118deg,transparent 49.6%,rgba(60,40,90,.10) 50%,transparent 50.5%)}
/* flap folded over the top */
.fl-env-flap{position:absolute;left:0;right:0;top:0;height:46%;
  clip-path:polygon(0 0,100% 0,50% 100%);border-radius:10px 10px 0 0;
  background:linear-gradient(180deg,#efedf7 0%,#e6e3f1 70%,#dcd8ea 100%);
  filter:drop-shadow(0 3px 4px rgba(60,40,90,.12))}
/* the mirrored disco heart seal */
.fl-seal{position:absolute;left:50%;top:33%;width:24%;transform:translateX(-50%) rotate(-3deg);
  z-index:3;filter:drop-shadow(0 5px 9px rgba(60,40,90,.3));
  transition:transform .4s cubic-bezier(.34,1.3,.5,1)}
.fl-obj:hover .fl-seal{transform:translateX(-50%) rotate(6deg) scale(1.08)}
.fl-seal svg{display:block;width:100%;height:auto}

/* ── the badge (linkedin) ───────────────────────────────── */
.fl-bdg{display:flex;flex-direction:column;align-items:center;
  transform-origin:top center;transition:transform .4s ease}
.fl-obj:hover .fl-bdg{animation:flswing 1.6s ease-in-out infinite}
@keyframes flswing{0%,100%{transform:rotate(-2.4deg)}50%{transform:rotate(2.4deg)}}
.fl-strap{width:26px;height:clamp(64px,7vw,92px);border-radius:0 0 6px 6px;
  background:repeating-linear-gradient(180deg,#8a79e8 0 10px,#7a68dd 10px 20px);
  box-shadow:inset 0 0 4px rgba(0,0,0,.15)}
.fl-clip{width:38px;height:16px;border-radius:4px;margin-top:-2px;z-index:2;
  background:linear-gradient(135deg,#f4f5f9 0%,#b9bdcb 30%,#878da0 50%,#e8e9f0 70%,#9aa0b2 100%);
  box-shadow:0 2px 4px rgba(60,40,90,.25)}
.fl-card{width:clamp(180px,17vw,215px);background:#fff;border-radius:14px;margin-top:-3px;
  box-shadow:0 22px 40px -14px rgba(60,40,90,.38);padding:22px 18px 20px;text-align:center;
  border:1px solid rgba(60,40,90,.06)}
.fl-card-star{width:64px;margin:0 auto 12px}
.fl-card-star svg{display:block;width:100%;height:auto}
.fl-card-name{font-family:'Archivo',sans-serif;font-weight:800;font-size:17px;
  letter-spacing:-.01em;color:#201d2b;text-transform:lowercase}
.fl-card-role{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:.18em;
  text-transform:uppercase;color:#0a66c2;margin-top:5px}
.fl-card-handle{font-family:'Caveat',cursive;font-weight:700;font-size:19px;color:#4a4560;margin-top:10px}

@media(max-width:840px){
  .fl2{flex-direction:column;gap:36px;margin-top:30px}
  .fl-left{flex:0 0 auto;width:100%}
  .fl-objects{flex-direction:row;flex-wrap:wrap;justify-content:center;gap:40px}
}
`;

/* mirrored disco heart — chrome gradient + facet grid, clipped to the heart */
function DiscoHeart() {
  return (
    <svg viewBox="0 0 64 60" aria-hidden="true">
      <defs>
        <linearGradient id="fl-chrome-h" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".22" stopColor="#c7cad6" />
          <stop offset=".4" stopColor="#8b91a4" />
          <stop offset=".55" stopColor="#eceef4" />
          <stop offset=".75" stopColor="#9aa0b2" />
          <stop offset="1" stopColor="#dfe1ea" />
        </linearGradient>
        <clipPath id="fl-heart-clip">
          <path d="M32 56 C10 40 4 26 12 15.5 C18 8.5 28 9.5 32 17.5 C36 9.5 46 8.5 52 15.5 C60 26 54 40 32 56 Z" />
        </clipPath>
      </defs>
      <path d="M32 56 C10 40 4 26 12 15.5 C18 8.5 28 9.5 32 17.5 C36 9.5 46 8.5 52 15.5 C60 26 54 40 32 56 Z"
        fill="url(#fl-chrome-h)" />
      <g clipPath="url(#fl-heart-clip)" stroke="rgba(255,255,255,.6)" strokeWidth="0.9">
        {[8, 16, 24, 32, 40, 48, 56].map((x) => <line key={"v" + x} x1={x} y1="0" x2={x} y2="60" />)}
        {[10, 18, 26, 34, 42, 50].map((y) => <line key={"h" + y} x1="0" y1={y} x2="64" y2={y} />)}
      </g>
      <path d="M32 56 C10 40 4 26 12 15.5 C18 8.5 28 9.5 32 17.5 C36 9.5 46 8.5 52 15.5 C60 26 54 40 32 56 Z"
        fill="none" stroke="rgba(40,30,60,.18)" strokeWidth="1" />
    </svg>
  );
}

/* chrome star wearing sunglasses — the badge's official portrait */
function ChromeStar() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="fl-chrome-s" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".25" stopColor="#c2c6d3" />
          <stop offset=".45" stopColor="#868ca0" />
          <stop offset=".6" stopColor="#f0f1f6" />
          <stop offset=".8" stopColor="#9aa0b2" />
          <stop offset="1" stopColor="#d8dae3" />
        </linearGradient>
      </defs>
      <path d="M32 3 L39.6 22.6 L60.5 23.6 L44.2 36.9 L49.8 57.1 L32 45.6 L14.2 57.1 L19.8 36.9 L3.5 23.6 L24.4 22.6 Z"
        fill="url(#fl-chrome-s)" stroke="rgba(40,30,60,.16)" strokeWidth="1" />
      {/* sunglasses */}
      <g transform="translate(0,1)">
        <rect x="20" y="24" width="10" height="7" rx="3.2" fill="#23202e" />
        <rect x="34" y="24" width="10" height="7" rx="3.2" fill="#23202e" />
        <path d="M30 27 h4" stroke="#23202e" strokeWidth="1.8" />
        <path d="M20 26.5 h-3.5 M44 26.5 h3.5" stroke="#23202e" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M22.5 26 q1.6 -1 3.2 0" stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="none" />
        <path d="M36.5 26 q1.6 -1 3.2 0" stroke="rgba(255,255,255,.5)" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

const FL_EMAIL = "anacristinafellipelli@gmail.com";
const FL_LINKEDIN = "linkedin.com/in/ana-fellipelli";

function ContactFlyer({ spec }) {
  const [copied, setCopied] = useStateFly(null);
  const timers = useRefFly({});

  useEffectFly(() => {
    document.body.classList.add("contact-mode");
    return () => {
      document.body.classList.remove("contact-mode");
      Object.values(timers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const copy = (id, value) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(() => {});
      }
    } catch (e) {}
    setCopied(id);
    if (timers.current[id]) clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => setCopied((c) => (c === id ? null : c)), 1200);
  };

  return (
    <div className="fl2">
      <style>{FLYER_CSS}</style>

      <div className="fl-left">
        <div className="fl-status">
          <span className="fl-status-dot" aria-hidden="true"></span>
          são paulo · barcelona
        </div>
        {/* the AI's real answer takes the headline slot when there is one;
            long answers drop to a readable size instead of shouting */}
        <p className={"fl-answer" + (spec && spec.answer && spec.answer.length > 60 ? " long" : "")}>
          {(spec && spec.answer) || "always open to the right thing."}
          <span className="fl-caret" aria-hidden="true"></span>
        </p>
        <p className="fl-context">product design, design systems, and ai — tell me what you're building.</p>
        <ul className="fl-roles">
          <li className="fl-role">product design · design systems</li>
          <li className="fl-role">ai-first</li>
          <li className="fl-role">remote · são paulo · barcelona</li>
        </ul>
      </div>

      <div className="fl-right">
        <div className="fl-objects">
          {/* email envelope, sealed with a disco heart */}
          <button
            type="button"
            className={"fl-obj" + (copied === "email" ? " copied" : "")}
            onClick={() => copy("email", FL_EMAIL)}
            aria-label={"copy email: " + FL_EMAIL}
          >
            <span className="fl-copied2">copied!</span>
            <div className="fl-env-wrap">
              <div className="fl-env-back"></div>
              <div className="fl-env-letter"><span>say hi ✦</span></div>
              <div className="fl-env-front"></div>
              <div className="fl-env-flap"></div>
              <div className="fl-seal"><DiscoHeart /></div>
            </div>
            <span className="fl-obj-label"><b>email</b>{FL_EMAIL} · click to copy</span>
          </button>

          {/* linkedin badge on a lanyard */}
          <button
            type="button"
            className={"fl-obj" + (copied === "linkedin" ? " copied" : "")}
            onClick={() => copy("linkedin", FL_LINKEDIN)}
            aria-label={"copy linkedin: " + FL_LINKEDIN}
          >
            <span className="fl-copied2">copied!</span>
            <div className="fl-bdg">
              <div className="fl-strap"></div>
              <div className="fl-clip"></div>
              <div className="fl-card">
                <div className="fl-card-star"><ChromeStar /></div>
                <div className="fl-card-name">ana fellipelli</div>
                <div className="fl-card-role">linkedin</div>
                <div className="fl-card-handle">/in/ana-fellipelli</div>
              </div>
            </div>
            <span className="fl-obj-label"><b>linkedin</b>{FL_LINKEDIN} · click to copy</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* take over the "contact" page */
if (typeof LAYOUTS !== "undefined") LAYOUTS.contact = ContactFlyer;

Object.assign(window, { ContactFlyer });
