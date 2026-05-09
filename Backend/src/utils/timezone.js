const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

export function unixToIstDateKey(unixTimestamp) {
  const date = new Date(Number(unixTimestamp) * 1000 + IST_OFFSET_MS)
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function getDateKeyDaysAgo(days) {
  const now = new Date(Date.now() + IST_OFFSET_MS)
  now.setUTCDate(now.getUTCDate() - days)
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(now.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

