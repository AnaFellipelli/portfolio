/* ════════════════════════════════════════════════════════════
   stickers.jsx — holographic CSS sticker pack scattered on the hero
   each sticker = oil-slick gradient + gloss + white border + float
   ════════════════════════════════════════════════════════════ */

/* ---- icon glyphs (white, sit on top of the holo base) ---- */
const ICONS = {
  smiley: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="18" cy="20" r="2.6" fill="#1a1330" />
      <circle cx="30" cy="20" r="2.6" fill="#1a1330" />
      <path d="M16 28 C 19 33, 29 33, 32 28" fill="none" stroke="#1a1330"
        strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 13.5c2.4 0 4.2 1.4 4.7 3.2 2.6.2 4.6 2 4.6 4.4 0 .9-.3 1.7-.7 2.4
        1.3.9 2.1 2.2 2.1 3.7 0 2.2-1.6 4-3.8 4.3-.4 1.9-2.3 3.3-4.6 3.3-1.2 0-2.2-.4-3-1V14.4
        c.7-.6 1.6-.9 2.7-.9zM24 13.5c-2.4 0-4.2 1.4-4.7 3.2-2.6.2-4.6 2-4.6 4.4 0 .9.3 1.7.7 2.4
        -1.3.9-2.1 2.2-2.1 3.7 0 2.2 1.6 4 3.8 4.3.4 1.9 2.3 3.3 4.6 3.3 1.2 0 2.2-.4 3-1V14.4
        c-.7-.6-1.6-.9-2.7-.9z" fill="none" stroke="#fff" strokeWidth="2"
        strokeLinejoin="round" />
      <path d="M24 14v20" stroke="#fff" strokeWidth="2" />
      <path d="M19 21c2 0 3 1.4 5 1.4M29 25c-2 0-3 1.4-5 1.4" stroke="#fff"
        strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  ),
  cursor: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M16 13 L34 24 L25 26 L30 35 L26 37 L21 28 L16 33 Z"
        fill="#fff" stroke="#1a1330" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M19 17 L11 24 L19 31 M29 17 L37 24 L29 31 M26 14 L22 34"
        fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round"
        strokeLinejoin="round" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 7 C26 17, 31 22, 41 24 C31 26, 26 31, 24 41 C22 31, 17 26, 7 24
        C17 22, 22 17, 24 7 Z" fill="#fff" />
    </svg>
  ),
  disk: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="24" cy="24" r="2.4" fill="#1a1330" />
      <path d="M30 12 C24 14, 20 18, 18 24" stroke="#fff" strokeWidth="2"
        fill="none" strokeLinecap="round" opacity="0.85" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 14 L38 24 L24 34 L10 24 Z" fill="#fff" opacity="0.95" />
      <circle cx="24" cy="24" r="4.4" fill="#1a1330" />
      <path d="M20.2 23.4 C22 22.7, 26 22.7, 27.8 24" stroke="#fff" strokeWidth="1.3"
        fill="none" strokeLinecap="round" />
    </svg>
  ),
  manychat: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.9571 5.0037H18.8204C14.7785 5.0037 12.8139 11.0509 12.8139 11.0509V6.41073H2.1875V19.1643H6.43438V10.6613H8.7V19.1643H13.257C13.257 19.1643 15.5984 9.07149 17.7902 9.82669C19.2673 10.3806 15.1017 19.1551 15.1017 19.1551H21.1193C21.1193 19.1551 21.9539 13.4402 21.9668 11.4626C22.1515 8.10391 21.6216 5 18.9534 5"
        fill="#fff" />
    </svg>
  ),
};

function Sticker({ id, kind, shape, peel }) {
  return (
    <div className={"sticker st-" + id}>
      <div className={"sticker-inner" + (shape === "round" ? " round" : "") + (peel ? " peel" : "")}>
        <span className="holo"></span>
        <span className="gloss"></span>
        <span className="ico">{ICONS[kind]}</span>
      </div>
    </div>
  );
}

/* the order here only affects DOM; placement + look come from CSS (.st-*) */
const STICKER_SET = [
];

function StickerLayer({ shown }) {
  return (
    <div className={"sticker-layer" + (shown ? " shown" : "")} aria-hidden="true">
      {STICKER_SET.map((s) => <Sticker key={s.id} {...s} />)}
    </div>
  );
}

Object.assign(window, { Sticker, StickerLayer });
