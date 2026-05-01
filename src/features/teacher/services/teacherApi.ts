import { http } from '../../../services/http'

export type ClassSummaryResponse = {
  classes?: unknown
  atRiskStudents?: unknown
  comparison?: unknown
  [key: string]: unknown
}

export async function getClassSummary() {
  const res = await http.get<ClassSummaryResponse>('/api/teacher/class-summary')
  return res.data
}

