import { http } from '../../../services/http'

export type LeaderboardItem = {
  id: string
  fullName?: string
  email?: string
  leetcodeUsername?: string
  totalSolved?: number
  easySolved?: number
  mediumSolved?: number
  hardSolved?: number
  ranking?: number
  consistencyScore?: number
  streak?: number
  position?: number
  [key: string]: unknown
}

export async function getLeaderboard() {
  const res = await http.get<LeaderboardItem[]>('/api/users/leaderboard')
  return res.data
}

