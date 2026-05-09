import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_USER_ID,
} from '../../data/mock/demoCredentials'
import type { AuthUser } from '../../app/store/authStore'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function tryMockLogin(email: string, password: string) {
  const ok =
    normalizeEmail(email) === normalizeEmail(DEMO_EMAIL) && password === DEMO_PASSWORD
  if (!ok) {
    throw new Error(
      `Invalid credentials. Use demo login — Email: ${DEMO_EMAIL} · Password: ${DEMO_PASSWORD}`,
    )
  }

  const user: AuthUser = {
    id: DEMO_USER_ID,
    name: 'Pranjal Kumar',
    email: DEMO_EMAIL,
    role: 'student',
  }

  return {
    token: 'mock-session-token-codepulse',
    user,
  }
}
