import { http } from '../../../services/http'

export type AnalyticsResponse = {
  submissionCalendar?: unknown
  skillStats?: unknown
  streak?: unknown
  strengths?: unknown
  weaknesses?: unknown
}

export async function getStudentAnalytics(studentId: string) {
  const res = await http.get<AnalyticsResponse>(`/api/analytics/${encodeURIComponent(studentId)}`)
  return res.data
}

