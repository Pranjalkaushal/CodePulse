import Snapshot from '../models/Snapshot.js'
import { computeStreak } from '../utils/streak.js'

function mapToArray(mapLike) {
  if (!mapLike) return []
  const entries = mapLike instanceof Map ? Array.from(mapLike.entries()) : Object.entries(mapLike)
  return entries.map(([key, value]) => ({ key, value }))
}

function mapToDateArray(mapLike) {
  if (!mapLike) return []
  const entries = mapLike instanceof Map ? Array.from(mapLike.entries()) : Object.entries(mapLike)
  return entries.map(([date, count]) => ({ date, count }))
}

export async function getStudentAnalytics(req, res, next) {
  try {
    const { studentId } = req.params
    const snap = await Snapshot.findOne({ studentId }).sort({ date: -1 })
    if (!snap) {
      res.status(404)
      throw new Error('No analytics available for this student yet')
    }

    const streak = computeStreak(snap.submissionCalendar)

    // strengths/weaknesses from skillStats map
    const skillEntries = mapToArray(snap.skillStats)
      .filter((x) => typeof x.key === 'string' && typeof x.value === 'number')
      .map((x) => ({ skill: String(x.key), value: Number(x.value) }))

    const sorted = [...skillEntries].sort((a, b) => b.value - a.value)
    const strengths = sorted.slice(0, 3)
    const weaknesses = sorted.slice(-3).reverse()

    res.json({
      submissionCalendar: mapToDateArray(snap.submissionCalendar),
      skillStats: Object.fromEntries(
        (snap.skillStats instanceof Map ? Array.from(snap.skillStats.entries()) : Object.entries(snap.skillStats || {})).map(
          ([k, v]) => [k, Number(v) || 0],
        ),
      ),
      streak,
      strengths,
      weaknesses,
    })
  } catch (e) {
    next(e)
  }
}

