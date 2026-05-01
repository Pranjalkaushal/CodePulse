import Student from '../models/Student.js'
import { verifyToken } from '../utils/jwt.js'

export async function protect(req, res, next) {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
      res.status(401)
      throw new Error('Not authorized')
    }
    const token = auth.split(' ')[1]
    const decoded = verifyToken(token)
    const user = await Student.findById(decoded.id).select('-password')
    if (!user) {
      res.status(401)
      throw new Error('Not authorized')
    }
    req.user = user
    next()
  } catch (e) {
    next(e)
  }
}

