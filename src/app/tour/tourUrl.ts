import { tourSteps } from './tourConfig'

export function getTourSearch(stepIndex: number) {
  const step = Math.max(0, Math.min(stepIndex, tourSteps.length - 1))
  return `?tour=1&step=${step}`
}

export function parseTourStep(search: string) {
  const sp = new URLSearchParams(search)
  const enabled = sp.get('tour') === '1'
  const raw = sp.get('step')
  const step = raw ? Number(raw) : 0
  return { enabled, step: Number.isFinite(step) ? step : 0 }
}

