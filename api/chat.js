/* ════════════════════════════════════════════════════════════
   api/chat.js — Vercel serverless function. Holds the Anthropic
   API key server-side (never shipped to the browser) and turns
   a free-text question into the same PageSpec shape the front
   end already knows how to render (see data.jsx mockCompose).
   ════════════════════════════════════════════════════════════ */

const { SYSTEM_PROMPT, DETAIL_IDS, GALLERY_IDS, CASE_LAYOUT_FOR_ID } = require("./_context");

const MODEL = "claude-haiku-4-5-20251001";
// lite alias: the full "gemini-flash-latest" free tier caps at ~20 requests/day,
// while flash-lite's daily quota is far higher -- and a page-spec doesn't need more
const GEMINI_MODEL = "gemini-flash-lite-latest";
const MAX_QUESTION_LENGTH = 400;

const RENDER_PAGE_TOOL = {
  name: "render_page",
  description: "Choose which portfolio page/layout to show in response to the visitor's question.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      layout: {
        type: "string",
        enum: [
          "single-project", "gallery", "themed-list",
          "about", "contact", "off-topic", "case-study", "manyfest-case", "releve-case",
        ],
      },
      title: { type: "string", maxLength: 40 },
      subtitle: { type: "string", maxLength: 60 },
      intro: {
        type: "string", maxLength: 140,
        description: "One short, lowercase, conversational sentence. Must not state any fact, number, or " +
          "claim beyond what's already in the system prompt -- it's flavor text, not new information.",
      },
      answer: {
        type: "string", maxLength: 320,
        description: "A real 1-3 sentence answer to the visitor's question, first person as Ana, lowercase, " +
          "in the SAME language the question was asked in. Every fact must come from the system prompt; " +
          "if the information isn't there, say so honestly instead of inventing.",
      },
      items: { type: "array", items: { type: "string" } },
      big: { type: "string", maxLength: 120, description: "only used when layout is off-topic" },
    },
    required: ["layout", "title", "subtitle", "intro", "answer"],
  },
};

const OFF_TOPIC_FALLBACK = {
  layout: "off-topic",
  title: "off-topic.",
  subtitle: "",
  intro: "",
  items: [],
  big: "that's a great question for someone who is not a portfolio.",
};

const GALLERY_FALLBACK = {
  layout: "gallery",
  title: "selected work.",
  subtitle: "eight projects, two design systems",
  intro: "scroll, click, ask follow-ups. i'll tell you the messy parts if you ask.",
  items: GALLERY_IDS,
};

const clamp = (s, max) => (typeof s === "string" ? s.slice(0, max) : "");

/* like clamp, but never cuts mid-word: prefer the last sentence end, else the last space */
function clampAnswer(s, max) {
  if (typeof s !== "string") return "";
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("!"), cut.lastIndexOf("?"));
  if (lastStop > max * 0.5) return cut.slice(0, lastStop + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

/* clamp whatever the model returns to something the front end can safely render */
function normalizeSpec(raw) {
  if (!raw || typeof raw !== "object" || typeof raw.layout !== "string") return GALLERY_FALLBACK;

  let { layout, items } = raw;
  if (layout === "quality-showcase") layout = "themed-list"; // retired layout
  const title = clamp(raw.title, 40);
  const subtitle = clamp(raw.subtitle, 60);
  const intro = clamp(raw.intro, 140);
  const answer = clampAnswer(raw.answer, 320);
  const big = clamp(raw.big, 120);
  items = Array.isArray(items) ? items.filter((x) => typeof x === "string") : [];

  if (layout === "off-topic") {
    return { layout, title: title || "off-topic.", subtitle: subtitle || "", intro: "", answer: "", items: [], big: big || answer || OFF_TOPIC_FALLBACK.big };
  }

  if (layout === "about" || layout === "contact") {
    return { layout, title: title || "", subtitle: subtitle || "", intro: intro || "", answer, items: [] };
  }

  // a project id sometimes deserves its own dedicated case layout regardless of what the model picked
  const forcedLayout = items.length === 1 && CASE_LAYOUT_FOR_ID[items[0]];
  if (forcedLayout) {
    return { layout: forcedLayout, title: title || "", subtitle: subtitle || "", intro: intro || "", answer, items: [items[0]] };
  }

  if (layout === "case-study") return { layout, title: title || "weave.", subtitle: subtitle || "autodesk / weave", intro: "", answer, items: ["weave"] };
  if (layout === "manyfest-case") return { layout, title: title || "manyfest.", subtitle: subtitle || "manychat design system", intro: "", answer, items: ["manychat-ds"] };
  if (layout === "releve-case") return { layout, title: title || "(r)elevē.", subtitle: subtitle || "elisava capstone", intro: "", answer, items: ["releve"] };

  if (layout === "single-project") {
    const id = items.find((x) => DETAIL_IDS.includes(x) && !CASE_LAYOUT_FOR_ID[x]);
    if (!id) return { ...GALLERY_FALLBACK, answer };
    return { layout, title: title || "", subtitle: subtitle || "", intro: intro || "", answer, items: [id] };
  }

  if (layout === "gallery" || layout === "quality-showcase" || layout === "themed-list") {
    const valid = items.filter((x) => GALLERY_IDS.includes(x));
    /* work pages: the answer is an opener, two rendered lines max */
    const short = clampAnswer(answer, 140);
    if (!valid.length) return { ...GALLERY_FALLBACK, answer: short };
    return { layout, title: title || "selected work.", subtitle: subtitle || "", intro: intro || "", answer: short, items: valid };
  }

  return GALLERY_FALLBACK;
}

/* ── provider calls: both return the raw page-spec object (or null) ── */

async function askClaude(question, apiKey) {
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      temperature: 0.6, // enough for personality; the schema + rules keep routing honest
      system: SYSTEM_PROMPT,
      tools: [RENDER_PAGE_TOOL],
      tool_choice: { type: "tool", name: "render_page" },
      messages: [{ role: "user", content: question }],
    }),
  });
  if (!upstream.ok) throw new Error("upstream error " + upstream.status);
  const data = await upstream.json();
  const toolUse = (data.content || []).find((b) => b.type === "tool_use" && b.name === "render_page");
  return toolUse && toolUse.input;
}

/* Gemini's structured-output schema is an OpenAPI subset: no additionalProperties
   or maxLength, so we mirror RENDER_PAGE_TOOL's schema without them (normalizeSpec
   clamps lengths server-side anyway). Free tier: no card, ~1,500 requests/day. */
const GEMINI_SCHEMA = {
  type: "OBJECT",
  properties: {
    layout: { type: "STRING", enum: RENDER_PAGE_TOOL.input_schema.properties.layout.enum },
    title: { type: "STRING" },
    subtitle: { type: "STRING" },
    intro: { type: "STRING", description: RENDER_PAGE_TOOL.input_schema.properties.intro.description },
    answer: { type: "STRING", description: RENDER_PAGE_TOOL.input_schema.properties.answer.description },
    items: { type: "ARRAY", items: { type: "STRING" } },
    big: { type: "STRING", description: "only used when layout is off-topic" },
  },
  required: ["layout", "title", "subtitle", "intro", "answer"],
};

async function askGemini(question, apiKey, retried) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    GEMINI_MODEL + ":generateContent?key=" + encodeURIComponent(apiKey);
  const upstream = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: question }] }],
      generationConfig: {
        temperature: 0.6, // enough for personality; the schema + rules keep routing honest
        maxOutputTokens: 1024,
        // flash is a thinking model by default; a page-spec doesn't need it, and
        // thinking silently eats the whole token budget (finishReason MAX_TOKENS)
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: GEMINI_SCHEMA,
      },
    }),
  });
  if (!upstream.ok) {
    // free-tier rate limit or transient overload: wait once and retry
    if (!retried && (upstream.status === 429 || upstream.status === 503)) {
      await new Promise((r) => setTimeout(r, 1500));
      return askGemini(question, apiKey, true);
    }
    throw new Error("upstream error " + upstream.status);
  }
  const data = await upstream.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  if (!question) {
    res.status(400).json({ error: "missing question" });
    return;
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    res.status(400).json({ error: "question too long" });
    return;
  }

  /* Claude if configured, otherwise Gemini (free tier) */
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!anthropicKey && !geminiKey) {
    res.status(500).json({ error: "no API key configured (set ANTHROPIC_API_KEY or GEMINI_API_KEY)" });
    return;
  }

  try {
    const raw = anthropicKey ? await askClaude(question, anthropicKey) : await askGemini(question, geminiKey);
    res.status(200).json(normalizeSpec(raw));
  } catch (err) {
    res.status(502).json({ error: "chat request failed" });
  }
};
