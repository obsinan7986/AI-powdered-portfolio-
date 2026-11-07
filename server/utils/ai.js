/**
 * AI provider — Gemini (default) + Claude.
 *
 * Gemini uses the NATIVE endpoint only:
 *   POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 *   Header: x-goog-api-key: <AI_API_KEY>
 *
 * This works with both key formats Google AI Studio issues:
 *   - AQ.Ab8RN6...   (newer "auth key" format)
 *   - AIzaSy...      (classic API key format)
 *
 * No key-prefix checks. No Bearer. No ?key= query param. No SDK needed.
 *
 * Env vars:
 *   AI_PROVIDER  gemini | claude   (default: gemini)
 *   AI_API_KEY   your key from https://aistudio.google.com/app/apikey
 *   AI_MODEL     model name        (default: gemini-1.5-flash)
 */

import Project    from '../models/Project.js';
import Experience from '../models/Experience.js';
import Skill      from '../models/Skill.js';

/* ------------------------------------------------------------------ */
/*  System prompt — built from live MongoDB data every request         */
/* ------------------------------------------------------------------ */
export async function buildSystemPrompt() {
  const [projects, experience, skills] = await Promise.all([
    Project.find()
      .select('title description category techStack liveUrl githubUrl featured')
      .lean(),
    Experience.find()
      .select('title company location startDate endDate type highlights')
      .lean(),
    Skill.find()
      .select('name category level')
      .lean(),
  ]);

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s.name);
    return acc;
  }, {});

  return `You are Obsa's AI assistant embedded in his personal portfolio website.
Your ONLY job is to answer questions about Obsa Tesfaye Demesa using the data below.
If a question is not covered by the data, reply exactly:
"I don't have that information, but you can contact Obsa at obsatesfaye6370@gmail.com"
Keep answers concise, friendly, and professional. Never invent information.

=== ABOUT ===
Name: Obsa Tesfaye Demesa
Title: Full-Stack Developer (MERN) | Computer Science Student
Education: BSc Computer Science, Haramaya University — College of Computing and Informatics, 4th Year, Expected Graduation 2027
Location: Ethiopia
Email: obsatesfaye6370@gmail.com | Phone: +251 931 597 986
GitHub: https://github.com/obsinan7986
LinkedIn: https://www.linkedin.com/in/obsa-tesfaye-demesa-67a41a363
Telegram: @Obsa_dev
Languages: Afaan Oromo (Native), Amharic (Fluent), English (Intermediate)

=== SKILLS ===
${Object.entries(grouped).map(([cat, names]) => `${cat}: ${names.join(', ')}`).join('\n')}

=== EXPERIENCE ===
${experience.map(e =>
  `- ${e.title} at ${e.company} (${e.startDate} – ${e.endDate}) [${e.type}]\n` +
  (e.highlights?.map(h => `  • ${h}`).join('\n') || '')
).join('\n\n')}

=== PROJECTS (${projects.length}) ===
${projects.map(p =>
  `- ${p.title} [${p.category}]${p.featured ? ' ⭐' : ''}\n` +
  `  ${p.description}\n` +
  `  Tech: ${Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack}\n` +
  `  Live: ${p.liveUrl || 'N/A'} | GitHub: ${p.githubUrl || 'N/A'}`
).join('\n\n')}

=== SERVICES ===
Web Development, Front-End Design, Graphic Design, UI Layout Design, Technical Consulting

=== AVAILABILITY ===
Obsa is currently a 4th-year student, open to internship and junior developer roles.
`;
}

/* ------------------------------------------------------------------ */
/*  Main dispatch                                                       */
/* ------------------------------------------------------------------ */
export async function chat(history, userMessage) {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const apiKey   = (process.env.AI_API_KEY  || '').trim();
  const model    = (process.env.AI_MODEL    || 'gemini-3.5-flash').trim();

  if (!apiKey) {
    const err = new Error('AI_API_KEY is not set in server .env');
    err.code    = 'MISSING_KEY';
    err.userMsg = 'The AI assistant is not configured yet. Please contact Obsa via the form below.';
    throw err;
  }

  const systemPrompt = await buildSystemPrompt();

  if (provider === 'gemini') return callGemini({ apiKey, model, systemPrompt, history, userMessage });
  if (provider === 'claude') return callClaude({ apiKey, model, systemPrompt, history, userMessage });

  const err = new Error(`Unsupported AI_PROVIDER: "${provider}". Use "gemini" or "claude".`);
  err.code    = 'BAD_PROVIDER';
  err.userMsg = 'AI provider is misconfigured. Contact the site owner.';
  throw err;
}

/* ------------------------------------------------------------------ */
/*  Gemini — native endpoint, x-goog-api-key header                   */
/* ------------------------------------------------------------------ */
async function callGemini({ apiKey, model, systemPrompt, history, userMessage }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const contents = [
    ...history.map(m => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
  };

  let response;
  try {
    response = await fetch(url, {
      method:  'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-goog-api-key':  apiKey,          // works for both AQ. and AIzaSy keys
      },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    // DNS / connection failure
    console.error('[Gemini] Network error:', networkErr.message);
    const err = new Error(networkErr.message);
    err.code    = 'NETWORK_ERROR';
    err.userMsg = 'Cannot reach the Gemini API. Check your internet connection.';
    throw err;
  }

  if (!response.ok) {
    // Read and log the real error — never log the key
    const raw = await response.text();
    let reason = raw;
    try { reason = JSON.parse(raw)?.error?.message || raw; } catch { /* keep raw */ }

    console.error(`[Gemini] HTTP ${response.status}: ${reason}`);

    throw classifyError(response.status, reason, model);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    const finish = data?.candidates?.[0]?.finishReason || 'unknown';
    const block  = data?.promptFeedback?.blockReason   || 'none';
    console.warn(`[Gemini] Empty response — finishReason=${finish}, blockReason=${block}`);
    const err = new Error(`Empty response (finishReason=${finish})`);
    err.code    = 'EMPTY_RESPONSE';
    err.userMsg = 'The AI did not return a response. Please rephrase your question.';
    throw err;
  }

  return text;
}

/* ------------------------------------------------------------------ */
/*  Error classifier — status + message → safe user string             */
/* ------------------------------------------------------------------ */
function classifyError(status, reason, model) {
  const err = new Error(reason);

  if (status === 400) {
    if (/model|not found|no longer available/i.test(reason)) {
      err.code    = 'MODEL_NOT_FOUND';
      err.userMsg = `Model "${model}" is unavailable. The site owner needs to update AI_MODEL in server/.env.`;
    } else {
      err.code    = 'BAD_REQUEST';
      err.userMsg = 'The AI request was invalid. Please try again.';
    }
  } else if (status === 401 || status === 403) {
    err.code    = 'INVALID_KEY';
    err.userMsg = 'The AI API key is invalid. The site owner needs to set a valid AI_API_KEY in server/.env.';
  } else if (status === 404) {
    err.code    = 'MODEL_NOT_FOUND';
    err.userMsg = `Model "${model}" was not found. The site owner needs to update AI_MODEL in server/.env (recommended: gemini-2.5-flash).`;
  } else if (status === 429) {
    err.code    = 'RATE_LIMITED';
    err.userMsg = 'Too many requests to the AI. Please wait a moment and try again.';
  } else if (status >= 500) {
    err.code    = 'SERVICE_UNAVAILABLE';
    err.userMsg = 'Gemini is temporarily unavailable. Please try again in a moment.';
  } else {
    err.code    = 'UNKNOWN';
    err.userMsg = `AI service error (HTTP ${status}). Please try again.`;
  }

  return err;
}

/* ------------------------------------------------------------------ */
/*  Claude (unchanged)                                                  */
/* ------------------------------------------------------------------ */
async function callClaude({ apiKey, model, systemPrompt, history, userMessage }) {
  const messages = [
    ...history.map(m => ({
      role:    m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      model || 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system:     systemPrompt,
        messages,
      }),
    });
  } catch (networkErr) {
    const err = new Error(networkErr.message);
    err.code    = 'NETWORK_ERROR';
    err.userMsg = 'Cannot reach the Claude API. Check your internet connection.';
    throw err;
  }

  if (!response.ok) {
    const raw = await response.text();
    console.error(`[Claude] HTTP ${response.status}: ${raw}`);
    const err = new Error(raw);
    err.code    = 'CLAUDE_ERROR';
    err.userMsg = `Claude API error (HTTP ${response.status}). Check AI_API_KEY.`;
    throw err;
  }

  const data = await response.json();
  return data.content[0].text;
}
