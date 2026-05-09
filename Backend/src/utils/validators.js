const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function requireFields(obj, fields) {
  for (const field of fields) {
    if (!obj?.[field]) {
      const err = new Error(`${field} is required`)
      err.statusCode = 400
      throw err
    }
  }
}

export function validateEmail(email) {
  if (!EMAIL_REGEX.test(String(email || '').trim())) {
    const err = new Error('Invalid email address')
    err.statusCode = 400
    throw err
  }
}

export function validatePassword(password) {
  if (String(password || '').length < 6) {
    const err = new Error('Password must be at least 6 characters')
    err.statusCode = 400
    throw err
  }
}

