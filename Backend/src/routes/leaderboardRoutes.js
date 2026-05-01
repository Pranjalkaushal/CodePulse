import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getLeaderboard } from '../controllers/leaderboardController.js'

const router = Router()

router.get('/', protect, getLeaderboard)

export default router

