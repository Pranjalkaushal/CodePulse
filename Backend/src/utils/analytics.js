import { getDateKeyDaysAgo, unixToIstDateKey } from './timezone.js'

export function normalizeCalendar(submissionCalendar) {
  const entries = Object.entries(submissionCalendar || {})
  return entries
    .map(([unix, count]) => ({ dateKey: unixToIstDateKey(unix), count: Number(count) || 0 }))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
}

export function computeStreakMetrics(submissionCalendar) {
  const days = normalizeCalendar(submissionCalendar).filter((day) => day.count > 0).map((day) => day.dateKey)
  if (!days.length) {
    return { currentStreak: 0, longestStreak: 0, activeDays: 0, consistencyScore: 0, activeLast7: 0, activeLast30: 0 }
  }

  const activeSet = new Set(days)
  const last7Start = getDateKeyDaysAgo(6)
  const last30Start = getDateKeyDaysAgo(29)
  const activeLast7 = days.filter((d) => d >= last7Start).length
  const activeLast30 = days.filter((d) => d >= last30Start).length

  let longestStreak = 1
  let streak = 1
  for (let i = 1; i < days.length; i += 1) {
    const prev = new Date(`${days[i - 1]}T00:00:00.000Z`)
    const curr = new Date(`${days[i]}T00:00:00.000Z`)
    const diff = Math.round((curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000))
    if (diff === 1) streak += 1
    else streak = 1
    if (streak > longestStreak) longestStreak = streak
  }

  let currentStreak = 0
  const today = getDateKeyDaysAgo(0)
  for (let i = 0; i < 365; i += 1) {
    const key = getDateKeyDaysAgo(i)
    if (activeSet.has(key)) currentStreak += 1
    else if (key === today) continue
    else break
  }

  const consistencyScore = Math.min(100, Math.round((activeLast30 / 30) * 100))
  return {
    currentStreak,
    longestStreak,
    activeDays: days.length,
    consistencyScore,
    activeLast7,
    activeLast30,
  }
}

