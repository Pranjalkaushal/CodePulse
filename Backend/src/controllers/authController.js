import User from '../models/User.js'
import OtpVerification from '../models/OtpVerification.js'
import { signToken } from '../utils/jwt.js'
import {
  requireFields,
  validateEmail,
  validatePassword,
} from '../utils/validators.js'
import { sendOtpEmail } from '../services/mailService.js'
import { syncUserLeetcodeStats } from '../services/statsSyncService.js'

function generateOtp() {
  return String(
    Math.floor(100000 + Math.random() * 900000)
  )
}

/* =========================
   SEND OTP
========================= */

export async function sendOtp(req, res, next) {
  try {
    const body = req.body || {}

    requireFields(body, [
      'fullName',
      'email',
      'password',
      'role',
    ])

    validateEmail(body.email)
    validatePassword(body.password)

    const email = body.email.toLowerCase()

    if (!['student', 'teacher'].includes(body.role)) {
      throw new Error('Invalid role')
    }

    if (
      body.role === 'student' &&
      !body.leetcodeUsername
    ) {
      throw new Error(
        'leetcodeUsername required for student'
      )
    }

    const existing = await User.findOne({
      email,
    })

    if (existing) {
      throw new Error('Email already exists')
    }

    // delete old OTPs (important)
    await OtpVerification.deleteMany({ email })

    const otp = generateOtp()

    await OtpVerification.create({
      email,
      otp,
      payload: body,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
      verifiedAt: null,
    })

    await sendOtpEmail(email, otp)

    res.json({
      message: 'OTP sent successfully',
    })
  } catch (e) {
    next(e)
  }
}

/* =========================
   VERIFY OTP
========================= */

export async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body || {}

    requireFields(req.body || [], [
      'email',
      'otp',
    ])

    const record =
      await OtpVerification.findOne({
        email: email.toLowerCase(),
        otp,
      }).sort({ createdAt: -1 })

    if (!record) {
      throw new Error('Invalid OTP')
    }

    if (record.expiresAt < new Date()) {
      throw new Error('OTP expired')
    }

    record.verifiedAt = new Date()
    await record.save()

    res.json({
      message: 'OTP verified successfully',
    })
  } catch (e) {
    next(e)
  }
}

/* =========================
   SIGNUP
========================= */

export async function signup(req, res, next) {
  try {
    requireFields(req.body || [], [
      'email',
      'otp',
    ])

    const email = req.body.email.toLowerCase()

    // ONLY accept VERIFIED OTP
    const record =
      await OtpVerification.findOne({
        email,
        otp: req.body.otp,
        verifiedAt: { $ne: null },
      })

    if (!record) {
      throw new Error(
        'OTP not verified or invalid'
      )
    }

    const payload = record.payload

    const user = await User.create({
      fullName: payload.fullName,
      email,
      password: payload.password,
      role: payload.role,
      leetcodeUsername:
        payload.role === 'student'
          ? payload.leetcodeUsername
          : undefined,
      isVerified: true,
    })

    if (
      user.role === 'student' &&
      user.leetcodeUsername
    ) {
      await syncUserLeetcodeStats(user)
    }

    const token = signToken({
      id: user._id,
      role: user.role,
    })

    await OtpVerification.deleteMany({
      email,
    })

    res.status(201).json({
      token,
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        leetcodeUsername:
          user.leetcodeUsername,
      },
    })
  } catch (e) {
    next(e)
  }
}

/* =========================
   LOGIN (UNCHANGED)
========================= */

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      throw new Error(
        'email and password required'
      )
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const ok =
      await user.matchPassword(password)

    if (!ok) {
      throw new Error('Invalid credentials')
    }

    const token = signToken({
      id: user._id,
      role: user.role,
    })

    res.json({
      token,
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        leetcodeUsername:
          user.leetcodeUsername,
      },
    })
  } catch (e) {
    next(e)
  }
}