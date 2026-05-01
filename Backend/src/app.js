import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import leaderboardRoutes from './routes/leaderboardRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('CodeRank API Running')
})

app.use('/api/auth', authRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/teacher', teacherRoutes)

app.use(notFound)
app.use(errorHandler)

export default app

