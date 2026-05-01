import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getClassSummary } from '../controllers/teacherController.js'

const router = Router()

router.get('/class-summary', protect, getClassSummary)

export default router

