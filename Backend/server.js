import dotenv from 'dotenv'
import connectDB from './src/config/db.js'
import app from './src/app.js'
import { startDailyJob } from './src/jobs/dailySync.job.js'

dotenv.config()

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  startDailyJob()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})

