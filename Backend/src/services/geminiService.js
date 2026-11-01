import axios from 'axios'

// The base URL and model are read from environment variables so you can change
// them without touching code (Google renames/retires models fairly often).
const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'
const DEFAULT_MODEL = 'gemini-3.8-flash'

function httpError(statusCode, message) {
  const err = new Error(message)
  err.statusCode = statusCode // our errorHandler middleware reads this
  return err
}

/**
 * Sends a conversation to Gemini and returns the reply as plain text.
 *
 * @param {string} systemPrompt  Hidden instructions + the student's stats
 * @param {{role: 'user'|'model', text: string}[]} messages  Conversation so far,
 *        ending with the student's newest message
 */
export async function askGemini(systemPrompt, messages) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw httpError(503, 'AI assistant is not configured yet. Ask the admin to set GEMINI_API_KEY.')
  }

  const baseUrl = (process.env.GEMINI_API_BASE || DEFAULT_BASE_URL).replace(/\/$/, '')
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL

  // Gemini's request format: system instructions are separate from the conversation,
  // and the AI's own earlier replies use the role "model" (not "assistant").
  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: {
      temperature: 0.6,
      // Newer Gemini models "think" before answering and thinking tokens count
      // toward this limit, so keep it generous or replies can get cut off.
      maxOutputTokens: 2048,
    },
  }

  let data
  try {
    const res = await axios.post(`${baseUrl}/models/${model}:generateContent`, body, {
      headers: {
        'Content-Type': 'application/json',
        // The API key goes in a header, from the server only. It never reaches the browser.
        'x-goog-api-key': apiKey,
      },
      timeout: 60000,
    })
    data = res.data
  } catch (e) {
    const status = e.response?.status
    // Log the real reason on the server, but only send safe, generic messages to the browser.
    console.error('[gemini] request failed:', status, e.response?.data?.error?.message || e.message)
    if (status === 429) throw httpError(429, 'The AI assistant is busy right now. Please try again in a minute.')
    if (e.code === 'ECONNABORTED') throw httpError(504, 'The AI assistant took too long to respond. Please try again.')
    if (status === 400 || status === 401 || status === 403 || status === 404) {
      throw httpError(502, 'The AI assistant is unavailable (configuration problem). Please tell the admin.')
    }
    throw httpError(502, 'The AI assistant is temporarily unavailable. Please try again.')
  }

  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((p) => p?.text || '')
    .join('')
    .trim()

  if (!text) {
    // Happens when Gemini's safety filter blocks the answer or returns nothing.
    throw httpError(422, 'The AI could not answer that. Try rephrasing your question.')
  }
  return text
}
