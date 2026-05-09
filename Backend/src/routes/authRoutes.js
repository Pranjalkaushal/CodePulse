import { Router } from 'express'
import {
  sendOtp,
  verifyOtp,
  signup,
  login,
} from '../controllers/authController.js'

const router = Router()

// OTP FLOW (must be visually grouped)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.post('/signup', signup)

// AUTH
router.post('/login', login)

export default router