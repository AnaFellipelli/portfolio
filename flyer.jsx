/* ════════════════════════════════════════════════════════════
   flyer.jsx — "contact" page. A normal, quiet contact page in
   the portfolio's own visual language: mono labels, big Archivo
   display, Fraunces answer line, lavender background.
   Email row copies on click (and offers mailto); LinkedIn opens
   the real profile. Overrides LAYOUTS.contact.
   ════════════════════════════════════════════════════════════ */

const { useState: useStateFly, useEffect: useEffectFly, useRef: useRefFly } = React;

const FL_EMAIL = "anacristinafellipelli@gmail.com";
const FL_LINKEDIN_URL = "https://www.linkedin.com/in/ana-fellipelli/";
const FL_LINKEDIN_LABEL = "linkedin.com/in/ana-fellipelli";

const FLYER_CSS = `
.flc{max-width:880px;margin:0 auto;padding-top:8px}
.flc *{box-sizing:border-box}
.flc-status{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);
  font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);
  border:1px solid rgba(107,78,255,.28);border-radius:999px;padding:6px 14px;
  background:rgba(107,78,255,.06);margin-bottom:34px;width:fit-content}
.flc-status i{width:7px;height:7px;border-radius:50%;background:var(--accent);flex:none;
  font-style:normal;animation:flcpulse 2s ease-in-out infinite}
@keyframes flcpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}

.flc-answer{font-family:"Bodoni Moda","Playfair Display",Georgia,serif;font-style:italic;font-weight:600;
  font-size:clamp(19px,2vw,24px);line-height:1.6;color:var(--text);
  max-width:620px;margin:0 0 46px}
.flc-answer .caret{display:inline-block;width:8px;height:.78em;background:var(--accent);
  vertical-align:-2px;margin-left:4px;border-radius:1px;animation:flcblink 1s steps(1) infinite}
@keyframes flcblink{50%{opacity:0}}

.flc-title{font-family:var(--display);font-weight:800;text-transform:lowercase;
  letter-spacing:-0.045em;word-spacing:-0.06em;font-size:clamp(56px,9vw,110px);line-height:.95;
  color:var(--text);margin:0 0 14px}
.flc-sub{font-size:16px;color:var(--muted-2);margin:0 0 56px}

.flc-rows{border-top:1px solid var(--border-strong,rgba(13,13,13,.14))}
.flc-row{display:flex;align-items:center;gap:22px;width:100%;text-align:left;
  padding:30px 6px;border:0;border-bottom:1px solid var(--border-strong,rgba(13,13,13,.14));
  background:none;cursor:pointer;text-decoration:none;position:relative;
  transition:padding .3s var(--ease-out,ease)}
.flc-row:hover{padding-left:16px}
.flc-k{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--muted);width:92px;flex:none}
.flc-v{font-family:var(--display);font-weight:800;letter-spacing:-0.01em;
  font-size:clamp(17px,2.6vw,30px);color:var(--text);text-transform:lowercase;
  overflow-wrap:anywhere;min-width:0}
.flc-arr{margin-left:auto;flex:none;font-size:22px;color:var(--muted);
  transition:transform .3s var(--ease-out,ease),color .3s}
.flc-row:hover .flc-arr{transform:translate(4px,-4px);color:var(--accent)}
.flc-hint{position:absolute;right:6px;bottom:10px;font-family:var(--mono);font-size:10px;
  letter-spacing:.12em;text-transform:uppercase;color:var(--muted);opacity:0;transition:opacity .25s}
.flc-row:hover .flc-hint{opacity:1}
.flc-copied{position:absolute;right:6px;top:8px;font-family:var(--hand);font-weight:700;
  font-size:24px;color:var(--accent);transform:rotate(-5deg);opacity:0;transition:opacity .25s;
  pointer-events:none}
.flc-row.copied .flc-copied{opacity:1}
.flc-row.copied .flc-hint{opacity:0}

@media(max-width:640px){
  .flc-row{flex-wrap:wrap;gap:10px}
  .flc-k{width:100%}
}
`;

function ContactFlyer({ spec }) {
  const [copied, setCopied] = useStateFly(false);
  const timer = useRefFly(null);

  useEffectFly(() => {
    document.body.classList.add("contact-mode");
    return () => {
      document.body.classList.remove("contact-mode");
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copyEmail = (e) => {
    e.preventDefault(); // first click copies; the hint tells them
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(FL_EMAIL).catch(() => {});
      }
    } catch (err) {}
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="flc">
      <style>{FLYER_CSS}</style>

      <div className="flc-status"><i aria-hidden="true"></i>são paulo · barcelona</div>

      {/* the AI's real answer when there is one, otherwise the page's own line */}
      <p className="flc-answer">
        {(spec && spec.answer) || "always open to the right thing."}
        <span className="caret" aria-hidden="true"></span>
      </p>

      <h1 className="flc-title">let's talk.</h1>
      <p className="flc-sub">product design, design systems, and ai — tell me what you're building.</p>

      <div className="flc-rows">
        <button
          type="button"
          className={"flc-row" + (copied ? " copied" : "")}
          onClick={copyEmail}
          aria-label={"copy email: " + FL_EMAIL}
        >
          <span className="flc-k">email</span>
          <span className="flc-v">{FL_EMAIL}</span>
          <span className="flc-copied" aria-hidden="true">copied!</span>
          <span className="flc-hint">click to copy</span>
          <span className="flc-arr" aria-hidden="true">↗</span>
        </button>

        <a
          className="flc-row"
          href={FL_LINKEDIN_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="flc-k">linkedin</span>
          <span className="flc-v">{FL_LINKEDIN_LABEL}</span>
          <span className="flc-hint">opens profile</span>
          <span className="flc-arr" aria-hidden="true">↗</span>
        </a>
      </div>

    </div>
  );
}

/* take over the "contact" page */
if (typeof LAYOUTS !== "undefined") LAYOUTS.contact = ContactFlyer;

Object.assign(window, { ContactFlyer });
