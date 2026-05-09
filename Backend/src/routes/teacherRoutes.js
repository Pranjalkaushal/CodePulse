import { Router } from 'express'
import { allowRoles, protect } from '../middleware/authMiddleware.js'
import {
  getConsistentStudents,
  getInactiveStudents,
  getTeacherAnalytics,
} from '../controllers/teacherAnalyticsController.js'

const router = Router()

router.get('/analytics', protect, allowRoles('teacher'), getTeacherAnalytics)
router.get('/consistent-students', protect, allowRoles('teacher'), getConsistentStudents)
router.get('/inactive-students', protect, allowRoles('teacher'), getInactiveStudents)

export default router

