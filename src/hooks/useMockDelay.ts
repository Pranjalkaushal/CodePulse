import { useEffect, useState } from 'react'

/** Simulates minimum loading time so skeleton UX is visible during mock/demo mode. */
export function useMockDelay(ms = 480) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), ms)
    return () => window.clearTimeout(t)
  }, [ms])

  return ready
}
