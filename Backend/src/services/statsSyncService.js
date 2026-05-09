import User from '../models/User.js'
import LeetcodeStats from '../models/LeetcodeStats.js'
import TopicExpert from '../models/TopicExpert.js'
import { computeStreakMetrics } from '../utils/analytics.js'
import { fetchLeetcodeBundle, extractLanguageStats, extractTopicStats } from './leetcodeApiService.js'

function safeNumber(n) {
  return Number.isFinite(Number(n)) ? Number(n) : 0
}

function flattenTopicStats(topicStats) {
  if (!topicStats || typeof topicStats !== 'object') return {}
  const out = {}
  for (const [topic, value] of Object.entries(topicStats)) {
    if (typeof value === 'number') out[topic] = value
    else if (value && typeof value === 'object') {
      const solved = safeNumber(value.solved ?? value.count ?? value.total)
      out[topic] = solved
    }
  }
  return out
}

export async function syncUserLeetcodeStats(user) {
  if (!user?.leetcodeUsername) return null
  const bundle = await fetchLeetcodeBundle(user.leetcodeUsername)
  const profile = bundle.profile || {}
  const submissionCalendar = profile.submissionCalendar || bundle.calendar.submissionCalendar || {}
  const metrics = computeStreakMetrics(submissionCalendar)
  const topicStats = flattenTopicStats(extractTopicStats(bundle))
  const languageStats = extractLanguageStats(bundle)

  return LeetcodeStats.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      totalSolved: safeNumber(profile.totalSolved),
      easySolved: safeNumber(profile.easySolved),
      mediumSolved: safeNumber(profile.mediumSolved),
      hardSolved: safeNumber(profile.hardSolved),
      ranking: safeNumber(profile.ranking),
      contributionPoint: safeNumber(profile.contributionPoint),
      reputation: safeNumber(profile.reputation),
      submissionCalendar,
      recentSubmissions: Array.isArray(profile.recentSubmissions) ? profile.recentSubmissions : [],
      topicStats,
      languageStats,
      progressStats: bundle.stats.progressStats || {},
      activeDays: metrics.activeDays,
      streak: metrics.currentStreak,
      longestStreak: metrics.longestStreak,
      consistencyScore: metrics.consistencyScore,
      lastFetchedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

export async function recalculateTopicExperts() {
  const students = await User.find({ role: 'student', isVerified: true }).select('_id fullName')
  const statsRows = await LeetcodeStats.find({ userId: { $in: students.map((s) => s._id) } })
  const nameById = new Map(students.map((s) => [String(s._id), s.fullName]))
  const topicBuckets = new Map()

  for (const row of statsRows) {
    const entries = Object.entries(row.topicStats || {})
    for (const [topic, solvedRaw] of entries) {
      const solvedCount = safeNumber(solvedRaw)
      if (!topicBuckets.has(topic)) topicBuckets.set(topic, [])
      topicBuckets.get(topic).push({
        userId: row.userId,
        fullName: nameById.get(String(row.userId)) || 'Student',
        solvedCount,
      })
    }
  }

  await TopicExpert.deleteMany({})
  for (const [topic, studentsInTopic] of topicBuckets.entries()) {
    const ranked = studentsInTopic.sort((a, b) => b.solvedCount - a.solvedCount).slice(0, 10)
    const topStudents = ranked.map((student, idx) => ({ ...student, rank: idx + 1 }))
    const bestCount = topStudents[0]?.solvedCount || 0
    await TopicExpert.create({ topic, topStudents, solvedCount: bestCount, updatedAt: new Date() })
  }
}

export async function syncAllStudentsLeetcodeStats() {
  const students = await User.find({ role: 'student', isVerified: true })
  for (const student of students) {
    try {
      await syncUserLeetcodeStats(student)
    } catch (error) {
      console.error(`LeetCode sync failed for ${student.email}:`, error.message)
    }
  }
  await recalculateTopicExperts()
}

