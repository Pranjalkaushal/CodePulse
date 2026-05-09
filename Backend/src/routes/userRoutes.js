import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getLeaderboard, getMe, getTopicExperts } from '../controllers/userController.js'

const router = Router()

router.get('/me', protect, getMe)
router.get('/leaderboard', protect, getLeaderboard)
router.get('/topic-experts', protect, getTopicExperts)

export default router

