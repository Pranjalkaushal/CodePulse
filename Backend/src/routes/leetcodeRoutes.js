import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getLeetcodeCalendar, getLeetcodeProfile, getLeetcodeStats } from '../controllers/leetcodeController.js'

const router = Router()

router.get('/:username', protect, getLeetcodeProfile)
router.get('/:username/calendar', protect, getLeetcodeCalendar)
router.get('/:username/stats', protect, getLeetcodeStats)

export default router

