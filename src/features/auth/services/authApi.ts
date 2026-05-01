import { http } from '../../../services/http'

export type LoginBody = {
  email: string
  password: string
}

export type RegisterBody = {
  name: string
  email: string
  password: string
  leetcodeUsername: string   // ✅ REQUIRED
}

export type AuthResponse = {
  token: string
  user: {
    id: string
    name?: string
    email?: string
    role?: string
    leetcodeUsername?: string
  }
}

export async function login(body: LoginBody) {
  const res = await http.post<AuthResponse>('/api/auth/login', body)
  return res.data
}

export async function register(body: RegisterBody) {
  const res = await http.post<AuthResponse>('/api/auth/register', body)
  return res.data
}