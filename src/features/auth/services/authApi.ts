import { http } from '../../../services/http'

export type LoginBody = {
  email: string
  password: string
}

export type RegisterBody = {
  fullName: string
  email: string
  password: string
  role: 'student' | 'teacher'
  leetcodeUsername?: string
}

export type AuthResponse = {
  token: string
  user: {
    id: string
    fullName?: string
    email?: string
    role?: string
    leetcodeUsername?: string
  }
}

export async function login(body: LoginBody) {
  const res = await http.post<AuthResponse>(
    '/api/auth/login',
    body
  )
  return res.data
}

/* ✅ FIX: rename register → sendOtp */
export async function sendOtp(body: RegisterBody) {
  const res = await http.post(
    '/api/auth/send-otp',
    body
  )
  return res.data as { message: string }
}

export async function verifyOtp(body: {
  email: string
  otp: string
}) {
  const res = await http.post<{
    message: string
  }>('/api/auth/verify-otp', body)
  return res.data
}

export async function signup(body: {
  email: string
  otp: string
}) {
  const res = await http.post<AuthResponse>(
    '/api/auth/signup',
    body
  )
  return res.data
}