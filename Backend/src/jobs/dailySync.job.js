import cron from 'node-cron'
import { syncAllStudentsLeetcodeStats } from '../services/statsSyncService.js'

export const startDailyJob = () => {
  cron.schedule(
    '30 0 * * *',
    async () => {
      console.log('Running daily LeetCode sync at 12:30 AM IST')
      await syncAllStudentsLeetcodeStats()
      console.log('Daily LeetCode sync completed')
    },
    { timezone: 'Asia/Kolkata' },
  )
}

