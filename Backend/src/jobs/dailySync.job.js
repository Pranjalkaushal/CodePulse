import cron from 'node-cron'
import Student from '../models/Student.js'
import Snapshot from '../models/Snapshot.js'
import { fetchLeetCodeData } from '../services/leetcodeService.js'
import { calculateScores } from '../utils/scoreCalculator.js'

export const startDailyJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running Daily Sync...')

    const students = await Student.find({ leetcodeUsername: { $exists: true, $ne: '' } })

    for (const student of students) {
      const data = await fetchLeetCodeData(student.leetcodeUsername)
      if (!data) continue

      const scores = calculateScores(data)

      await Snapshot.create({
        studentId: student._id,
        totalSolved: {
          easy: data.easySolved ?? 0,
          medium: data.mediumSolved ?? 0,
          hard: data.hardSolved ?? 0,
        },
        totalSubmissions: {
          easy: data.totalEasySubmissions ?? 0,
          medium: data.totalMediumSubmissions ?? 0,
          hard: data.totalHardSubmissions ?? 0,
        },
        contest: {
          rating: data.contestRating ?? 0,
          ranking: data.contestGlobalRanking ?? 0,
        },
        skillStats: data.tagProblemCounts || {},
        submissionCalendar: data.submissionCalendar || {},
        derived: scores,
      })
    }

    console.log('Daily Sync Completed')
  })
}

