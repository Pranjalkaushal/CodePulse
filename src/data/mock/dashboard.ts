import type { AnalyticsResponse } from '../../features/analytics/services/analyticsApi'
import { DEMO_USER_ID } from './demoCredentials'

function buildSubmissionCalendar(days = 210): { date: string; count: number }[] {
  const out: { date: string; count: number }[] = []
  const today = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setUTCDate(d.getUTCDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const activity = ((i % 17) % 9) > 6 ? (i % 8) + 1 : Math.max(0, (i % 5) - 2)
    if (activity > 0) out.unshift({ date: iso, count: activity })
  }
  return out
}

export type DashboardActivity = {
  id: string
  title: string
  subtitle: string
  timeLabel: string
  kind: 'solve' | 'contest' | 'streak' | 'topic'
}

export type DemoDashboard = {
  userId: string
  profile: {
    name: string
    email: string
    batch: string
    classLabel: string
    leetcodeUsername: string
  }
  stats: {
    points: number
    campusRank: number
    submissionsThisWeek: number
    problemsSolved: number
    acceptanceRatePct: number
  }
  recentActivity: DashboardActivity[]
  analytics: AnalyticsResponse
}

export const demoDashboard: DemoDashboard = {
  userId: DEMO_USER_ID,
  profile: {
    name: 'Pranjal Kumar',
    email: 'pranjalkausha@gmail.com',
    batch: '2027',
    classLabel: 'Mca',
    leetcodeUsername: 'pranjal_09',
  },
  stats: {
    points: 98,
    campusRank: 4,
    submissionsThisWeek: 24,
    problemsSolved: 88,
    acceptanceRatePct: 67,
  },
  recentActivity: [
    {
      id: '1',
      title: 'Solved “Binary Tree Paths”',
      subtitle: 'Easy · Trees · +12 pts',
      timeLabel: '2h ago',
      kind: 'solve',
    },
    {
      id: '2',
      title: 'Weekly contest participated',
      subtitle: 'Contest #412 · Rating +18',
      timeLabel: 'Yesterday',
      kind: 'contest',
    },
    {
      id: '3',
      title: 'Streak milestone',
      subtitle: '7-day active coding streak unlocked',
      timeLabel: '2 days ago',
      kind: 'streak',
    },
    {
      id: '4',
      title: 'Topic drill: DP',
      subtitle: 'Completed 5 / 8 recommended problems',
      timeLabel: '3 days ago',
      kind: 'topic',
    },
  ],
  analytics: {
    submissionCalendar: buildSubmissionCalendar(),
    skillStats: {
      Arrays: 78,
      'Two Pointers': 64,
      Graphs: 52,
      DP: 45,
      Trees: 70,
      Greedy: 58,
    },
    streak: 12,
    strengths: [
      { skill: 'Arrays', value: 78 },
      { skill: 'Trees', value: 70 },
      { skill: 'Greedy', value: 58 },
    ],
    weaknesses: [
      { skill: 'DP', value: 45 },
      { skill: 'Graphs', value: 52 },
      { skill: 'Two Pointers', value: 64 },
    ],
  },
}
