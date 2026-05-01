import axios from 'axios'

export const fetchLeetCodeData = async (username) => {
  try {
    const res = await axios.get(`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}`)
    return res.data
  } catch (error) {
    console.error('Error fetching LeetCode data', error?.message || error)
    return null
  }
}

