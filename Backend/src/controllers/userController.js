import User from '../models/User.js'
import LeetcodeStats from '../models/LeetcodeStats.js'
import TopicExpert from '../models/TopicExpert.js'

export async function getMe(req, res, next) {
  try {
    const stats = await LeetcodeStats.findOne({ userId: req.user._id })
    res.json({
      id: String(req.user._id),
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      leetcodeUsername: req.user.leetcodeUsername,
      isVerified: req.user.isVerified,
      stats,
    })
  } catch (error) {
    next(error)
  }
}

export async function getLeaderboard(req, res, next) {
  try {
    const students = await User.find({ role: 'student', isVerified: true }).select('-password')
    const statsRows = await LeetcodeStats.find({ userId: { $in: students.map((s) => s._id) } })
    const statsByUserId = new Map(statsRows.map((row) => [String(row.userId), row]))
    const sorted = students
      .map((student) => {
        const stats = statsByUserId.get(String(student._id))
        return {
          id: String(student._id),
          fullName: student.fullName,
          email: student.email,
          leetcodeUsername: student.leetcodeUsername,
          totalSolved: stats?.totalSolved || 0,
          easySolved: stats?.easySolved || 0,
          mediumSolved: stats?.mediumSolved || 0,
          hardSolved: stats?.hardSolved || 0,
          ranking: stats?.ranking || 0,
          streak: stats?.streak || 0,
          consistencyScore: stats?.consistencyScore || 0,
        }
      })
      .sort((a, b) => b.totalSolved - a.totalSolved)
      .map((item, index) => ({ ...item, position: index + 1 }))
    res.json(sorted)
  } catch (error) {
    next(error)
  }
}

export async function getTopicExperts(req, res, next) {
  try {
    const rows = await TopicExpert.find({}).sort({ solvedCount: -1 })
    res.json(rows)
  } catch (error) {
    next(error)
  }
}

