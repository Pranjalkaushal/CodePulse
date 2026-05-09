import mongoose from 'mongoose'

const leetcodeStatsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 },
    contributionPoint: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    submissionCalendar: { type: mongoose.Schema.Types.Mixed, default: {} },
    recentSubmissions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    topicStats: { type: mongoose.Schema.Types.Mixed, default: {} },
    languageStats: { type: mongoose.Schema.Types.Mixed, default: {} },
    progressStats: { type: mongoose.Schema.Types.Mixed, default: {} },
    activeDays: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    lastFetchedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

export default mongoose.model('LeetcodeStats', leetcodeStatsSchema)

