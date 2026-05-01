import { http } from '../../../services/http'

export type StudentResponse = {
  id: string
  name?: string
  email?: string
  batch?: string
  class?: string
  department?: string
  avatarUrl?: string
  // backend may include more fields; keep flexible
  [key: string]: unknown
}

export async function getStudent(studentId: string) {
  const res = await http.get<StudentResponse>(`/api/student/${encodeURIComponent(studentId)}`)
  return res.data
}

