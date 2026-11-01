import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { protect, allowRoles } from '../middleware/authMiddleware.js'
import { chat } from '../controllers/chatController.js'

const router = Router()

// Each AI call costs quota, so limit it per logged-in student (stricter than the global limit).
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => String(req.user?._id),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'You are sending messages too fast. Please wait a few minutes.' },
})

// Order matters: log-in check -> role check -> rate limit -> controller
router.post('/', protect, allowRoles('student'), chatLimiter, chat)

export default router
