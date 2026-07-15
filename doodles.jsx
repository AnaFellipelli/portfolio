/* ════════════════════════════════════════════════════════════
   doodles.jsx — handwritten layer (Caveat + wobbly SVG)
   draws in via stroke-dashoffset; label fades up.
   ════════════════════════════════════════════════════════════ */

const { useState, useEffect } = React;

/* each doodle renders its own little SVG mark + Caveat label */
function DoodleMark({ type, text }) {
  if (type === "arrow") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
        <span className="label">{text}</span>
        <svg width="96" height="46" viewBox="0 0 96 46">
          <path pathLength="1" d="M4 6 C 20 2, 44 10, 62 26 C 70 33, 78 38, 86 40" />
          <path pathLength="1" d="M86 40 L 72 39" />
          <path pathLength="1" d="M86 40 L 80 28" />
        </svg>
      </div>
    );
  }
  if (type === "circle") {
    return (
      <div style={{ position: "relative", padding: "10px 18px" }}>
        <svg width="150" height="74" viewBox="0 0 150 74" style={{ position: "absolute", inset: 0 }}>
          <ellipse pathLength="1" cx="75" cy="37" rx="70" ry="30" transform="rotate(-4 75 37)" />
        </svg>
        <span className="label" style={{ position: "relative" }}>{text}</span>
      </div>
    );
  }
  if (type === "underline") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <span className="label">{text}</span>
        <svg width="110" height="16" viewBox="0 0 110 16">
          <path pathLength="1" d="M4 9 C 26 4, 52 13, 76 7 C 88 4, 98 8, 106 6" />
        </svg>
      </div>
    );
  }
  if (type === "asterisk") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="34" height="34" viewBox="0 0 34 34">
          <line pathLength="1" x1="17" y1="4" x2="17" y2="30" />
          <line pathLength="1" x1="5" y1="11" x2="29" y2="23" />
          <line pathLength="1" x1="29" y1="11" x2="5" y2="23" />
        </svg>
        <span className="label">{text}</span>
      </div>
    );
  }
  // note — text only
  return <span className="label">{text}</span>;
}

function Doodle({ spec, index, active }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!active) { setDrawn(false); return; }
    const t = setTimeout(() => setDrawn(true), 150 * index + 60);
    return () => clearTimeout(t);
  }, [active, index]);

  const style = {
    ...spec.position,
    transform: `rotate(${spec.rotation || 0}deg)`,
  };

  return (
    <div className={"doodle" + (drawn ? " drawn" : "")} style={style}>
      <DoodleMark type={spec.type} text={spec.text} />
    </div>
  );
}

function DoodleLayer({ doodles, active }) {
  if (!doodles || !doodles.length) return null;
  return (
    <div className="doodle-layer">
      {doodles.map((d, i) => (
        <Doodle key={i} spec={d} index={i} active={active} />
      ))}
    </div>
  );
}

Object.assign(window, { Doodle, DoodleLayer, DoodleMark });
