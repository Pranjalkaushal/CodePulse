import User from '../models/User.js'
import LeetcodeStats from '../models/LeetcodeStats.js'
import TopicExpert from '../models/TopicExpert.js'

export async function getTeacherAnalytics(req, res, next) {
  try {
    const students = await User.find({ role: 'student', isVerified: true }).select('_id fullName email leetcodeUsername')
    const statsRows = await LeetcodeStats.find({ userId: { $in: students.map((s) => s._id) } })
    const byUserId = new Map(statsRows.map((row) => [String(row.userId), row]))
    const merged = students.map((s) => ({
      id: String(s._id),
      fullName: s.fullName,
      email: s.email,
      leetcodeUsername: s.leetcodeUsername,
      stats: byUserId.get(String(s._id)) || null,
    }))

    const mostConsistent = merged
      .filter((m) => m.stats)
      .sort((a, b) => (b.stats?.consistencyScore || 0) - (a.stats?.consistencyScore || 0))
      .slice(0, 10)
    const inactiveStudents = merged
      .filter((m) => (m.stats?.activeDays || 0) === 0 || (m.stats?.consistencyScore || 0) < 20)
      .slice(0, 20)
    const topSolvers = merged
      .filter((m) => m.stats)
      .sort((a, b) => (b.stats?.totalSolved || 0) - (a.stats?.totalSolved || 0))
      .slice(0, 10)
    const longestStreaks = merged
      .filter((m) => m.stats)
      .sort((a, b) => (b.stats?.longestStreak || 0) - (a.stats?.longestStreak || 0))
      .slice(0, 10)
    const topicExperts = await TopicExpert.find({}).sort({ solvedCount: -1 }).limit(20)

    res.json({
      totalStudents: students.length,
      mostConsistent,
      inactiveStudents,
      topSolvers,
      longestStreaks,
      topicExperts,
      recentSubmissions: merged.flatMap((m) => (m.stats?.recentSubmissions || []).slice(0, 5)).slice(0, 25),
      heatmap: merged.map((m) => ({
        studentId: m.id,
        fullName: m.fullName,
        submissionCalendar: m.stats?.submissionCalendar || {},
      })),
      leaderboard: topSolvers,
    })
  } catch (error) {
    next(error)
  }
}

export async function getConsistentStudents(req, res, next) {
  try {
    const rows = await LeetcodeStats.find({ consistencyScore: { $gte: 50 } }).sort({ consistencyScore: -1 }).limit(20)
    res.json(rows)
  } catch (error) {
    next(error)
  }
}

export async function getInactiveStudents(req, res, next) {
  try {
    const rows = await LeetcodeStats.find({ consistencyScore: { $lt: 20 } }).sort({ consistencyScore: 1 }).limit(20)
    res.json(rows)
  } catch (error) {
    next(error)
  }
}

