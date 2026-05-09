import { fetchCalendar, fetchProfile, fetchStats } from '../services/leetcodeApiService.js'

export async function getLeetcodeProfile(req, res, next) {
  try {
    const data = await fetchProfile(req.params.username)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function getLeetcodeCalendar(req, res, next) {
  try {
    const data = await fetchCalendar(req.params.username)
    res.json(data || {})
  } catch (error) {
    next(error)
  }
}

export async function getLeetcodeStats(req, res, next) {
  try {
    const data = await fetchStats(req.params.username)
    res.json(data || {})
  } catch (error) {
    next(error)
  }
}

