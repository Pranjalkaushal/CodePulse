import Student from '../models/Student.js'
import { signToken } from '../utils/jwt.js'
import { fetchLeetCodeStats } from '../services/leetcode.service.js'

export async function register(req, res, next) {
  try {
    const { name, email, password, leetcodeUsername, role, class: className, batch } = req.body || {}

    if (!name || !email || !password || !leetcodeUsername) {
      res.status(400)
      throw new Error('name, email, password and leetcodeUsername are required')
    }

    const existing = await Student.findOne({ email: String(email).toLowerCase() })
    if (existing) {
      res.status(409)
      throw new Error('Email already exists')
    }

    const leetcodeStats = await fetchLeetCodeStats(leetcodeUsername)

    const user = await Student.create({
      name,
      email,
      password,
      leetcodeUsername,
      role,
      class: className,
      batch,
      leetcodeStats,
    })

    const token = signToken({ id: user._id })
    res.status(201).json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        leetcodeUsername: user.leetcodeUsername,
      },
    })
  } catch (e) {
    next(e)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      res.status(400)
      throw new Error('email and password are required')
    }

    const user = await Student.findOne({ email: String(email).toLowerCase() })
    if (!user) {
      res.status(401)
      throw new Error('Invalid credentials')
    }

    const ok = await user.matchPassword(password)
    if (!ok) {
      res.status(401)
      throw new Error('Invalid credentials')
    }

    const token = signToken({ id: user._id })
    res.json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        leetcodeUsername: user.leetcodeUsername,
      },
    })
  } catch (e) {
    next(e)
  }
}

