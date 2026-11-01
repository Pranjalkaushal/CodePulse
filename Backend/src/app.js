
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import leetcodeRoutes from './routes/leetcodeRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import chatRoutes from './routes/chatRoutes.js'

const app = express()



const allowedOrigins = [
  'https://code-pulse-neon.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

app.use(
  cors({
    origin: (origin, callback) => {
      const isAllowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/code-pulse-.*\.vercel\.app$/.test(origin)

     

      callback(null, isAllowed)
    },
    credentials: true,
  }),
)

app.use(helmet())

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('CodeRank API Running')
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/leetcode', leetcodeRoutes)
app.use('/api/teacher', teacherRoutes)
app.use('/api/chat', chatRoutes)
app.use(notFound)
app.use(errorHandler)

export default app
