import { http } from '../../../services/http'

export type TeacherAnalyticsResponse = {
  mostConsistent?: unknown[]
  inactiveStudents?: unknown[]
  topSolvers?: unknown[]
  longestStreaks?: unknown[]
  topicExperts?: unknown[]
  recentSubmissions?: unknown[]
  leaderboard?: unknown[]
  [key: string]: unknown
}

export async function getTeacherAnalytics() {
  const res = await http.get<TeacherAnalyticsResponse>('/api/teacher/analytics')
  return res.data
}

