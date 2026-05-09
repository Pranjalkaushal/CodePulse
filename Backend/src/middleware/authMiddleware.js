import User from '../models/User.js'
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
    const user = await User.findById(decoded.id).select('-password')
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

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403)
      return next(new Error('Forbidden: insufficient permissions'))
    }
    return next()
  }
}

