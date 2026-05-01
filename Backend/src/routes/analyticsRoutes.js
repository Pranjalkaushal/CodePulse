import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getStudentAnalytics } from '../controllers/analyticsController.js'

const router = Router()

router.get('/:studentId', protect, getStudentAnalytics)

export default router

