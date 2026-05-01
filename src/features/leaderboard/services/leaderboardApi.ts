import { http } from '../../../services/http'

export type LeaderboardItem = {
  id: string
  name?: string
  email?: string
  class?: string
  batch?: string
  easy?: number
  medium?: number
  hard?: number
  [key: string]: unknown
}

export async function getLeaderboard(params?: { class?: string; batch?: string }) {
  const res = await http.get<LeaderboardItem[]>('/api/leaderboard', { params })
  return res.data
}

