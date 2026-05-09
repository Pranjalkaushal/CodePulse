import axios from 'axios'

const baseURL = process.env.LEETCODE_API_BASE_URL || 'https://alfa-leetcode-api.onrender.com'

async function get(path) {
  const { data } = await axios.get(`${baseURL}${path}`, { timeout: 25000 })
  return data
}

function ensureObject(v) {
  return v && typeof v === 'object' ? v : {}
}

export async function fetchProfile(username) {
  return get(`/${encodeURIComponent(username)}/profile`)
}

export async function fetchCalendar(username) {
  try {
    return await get(`/${encodeURIComponent(username)}/calendar`)
  } catch {
    return null
  }
}

export async function fetchStats(username) {
  try {
    return await get(`/${encodeURIComponent(username)}/stats`)
  } catch {
    return null
  }
}

export async function fetchLeetcodeBundle(username) {
  const profile = await fetchProfile(username)
  const [calendar, stats] = await Promise.all([fetchCalendar(username), fetchStats(username)])
  return {
    profile: ensureObject(profile),
    calendar: ensureObject(calendar),
    stats: ensureObject(stats),
  }
}

export function extractTopicStats(bundle) {
  const stats = bundle.stats || {}
  const profile = bundle.profile || {}
  return (
    stats.topicStats ||
    stats.tagProblemCounts ||
    profile.tagProblemCounts ||
    profile.skillStats ||
    {}
  )
}

export function extractLanguageStats(bundle) {
  const stats = bundle.stats || {}
  const profile = bundle.profile || {}
  return stats.languageStats || profile.languageProblemCount || {}
}

