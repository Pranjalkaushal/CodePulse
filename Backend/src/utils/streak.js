function toDailyCounts(calendarMap) {
  if (!calendarMap) return []
  const entries = calendarMap instanceof Map ? Array.from(calendarMap.entries()) : Object.entries(calendarMap)
  return entries
    .map(([k, v]) => ({ date: String(k), count: Number(v) || 0 }))
    .filter((x) => x.date && !Number.isNaN(new Date(x.date).getTime()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function computeStreak(submissionCalendar) {
  const days = toDailyCounts(submissionCalendar)
  if (days.length === 0) return { current: 0 }

  let streak = 0
  let i = days.length - 1

  // normalize "today" to last day present in calendar
  let last = new Date(days[i].date)
  last.setHours(0, 0, 0, 0)

  while (i >= 0) {
    const d = new Date(days[i].date)
    d.setHours(0, 0, 0, 0)

    const diffDays = Math.round((last.getTime() - d.getTime()) / 86400000)
    if (diffDays === 0) {
      if (days[i].count > 0) streak += 1
      last = d
      i -= 1
      continue
    }
    if (diffDays === 1) {
      if (days[i].count > 0) streak += 1
      last = d
      i -= 1
      continue
    }
    break
  }

  return { current: streak }
}

