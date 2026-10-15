
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import leetcodeRoutes from './routes/leetcodeRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

app.use((req, res, next) => {
  console.log(
    'REQUEST:',
    req.method,
    req.url,
    'ORIGIN:',
    req.headers.origin,
  )
  next()
})

const allowedOrigins = [
  'https://code-pulse-neon.vercel.app',
]

app.use(
  cors({
    origin: (origin, callback) => {
      const isAllowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/code-pulse-.*\.vercel\.app$/.test(origin)

      console.log('CORS ALLOWED:', isAllowed, 'ORIGIN:', origin)

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

app.use(notFound)
app.use(errorHandler)

export default app
