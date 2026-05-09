import { http } from '../../../services/http'

export type StudentResponse = {
  id: string
  fullName?: string
  email?: string
  role?: string
  leetcodeUsername?: string
  stats?: Record<string, unknown>
}

export async function getMe() {
  const res = await http.get<StudentResponse>('/api/users/me')
  return res.data
}

