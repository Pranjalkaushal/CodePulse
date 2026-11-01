import LeetcodeStats from '../models/LeetcodeStats.js'
import { askGemini } from '../services/geminiService.js'
import { MAX_MESSAGE_CHARS, buildSystemPrompt, sanitizeHistory } from '../utils/chatPrompt.js'

export async function chat(req, res, next) {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
    if (!message) {
      res.status(400)
      throw new Error('Please type a message.')
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      res.status(400)
      throw new Error(`Message is too long (max ${MAX_MESSAGE_CHARS} characters).`)
    }

    // The stats come from OUR database for the logged-in student (req.user, set by `protect`).
    // The browser can never choose whose stats are used, so nobody can read another student's data.
    const stats = await LeetcodeStats.findOne({ userId: req.user._id })
    const systemPrompt = buildSystemPrompt(req.user, stats)

    const history = sanitizeHistory(req.body?.history)
    const reply = await askGemini(systemPrompt, [...history, { role: 'user', text: message }])

    res.json({ reply })
  } catch (error) {
    next(error)
  }
}
