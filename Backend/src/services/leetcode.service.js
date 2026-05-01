import axios from 'axios'

const BASE = 'https://alfa-leetcode-api.onrender.com'

function pickNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0
}

function pickObject(v) {
  return v && typeof v === 'object' ? v : {}
}

function pickArray(v) {
  return Array.isArray(v) ? v : []
}

export async function fetchLeetCodeStats(username) {
  try {
    const u = String(username || '').trim()
    if (!u) throw new Error('Invalid LeetCode username')

    const res = await axios.get(`${BASE}/${encodeURIComponent(u)}`, { timeout: 20000 })
    const data = res.data

    // If the API returns an error-ish payload, treat as invalid.
    if (!data || typeof data !== 'object') throw new Error('Invalid LeetCode username')
    if ('errors' in data || 'error' in data) throw new Error('Invalid LeetCode username')
    if ('status' in data && typeof data.status === 'string' && data.status.toLowerCase() === 'error') {
      throw new Error('Invalid LeetCode username')
    }

    return {
      totalSolved: pickNumber(data.totalSolved),
      easySolved: pickNumber(data.easySolved),
      mediumSolved: pickNumber(data.mediumSolved),
      hardSolved: pickNumber(data.hardSolved),
      ranking: pickNumber(data.ranking ?? data.contestGlobalRanking),
      submissionCalendar: pickObject(data.submissionCalendar),
      recentSubmissions: pickArray(data.recentSubmissions ?? data.recentSubmissionList),
    }
  } catch (e) {
    throw new Error('Invalid LeetCode username')
  }
}

