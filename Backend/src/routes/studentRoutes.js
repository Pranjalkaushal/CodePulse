import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getStudentById } from '../controllers/studentController.js'

const router = Router()

router.get('/:id', protect, getStudentById)

export default router

