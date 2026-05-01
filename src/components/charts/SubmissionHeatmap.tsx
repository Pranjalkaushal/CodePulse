import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Card } from '../ui/Card'
import './heatmap.css'

type HeatPoint = { date: string; count?: number }

function normalizeCalendar(input: unknown): HeatPoint[] {
  if (!input) return []
  if (!Array.isArray(input)) return []

  const out: HeatPoint[] = []
  for (const item of input) {
    if (!item || typeof item !== 'object') continue
    const date = (item as any).date ?? (item as any).day
    const count = (item as any).count ?? (item as any).value ?? (item as any).submissions
    if (typeof date === 'string') out.push({ date, count: typeof count === 'number' ? count : undefined })
  }
  return out
}

function getRange(values: HeatPoint[]) {
  if (!values.length) return null
  const dates = values
    .map((v) => new Date(v.date))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())
  if (!dates.length) return null
  return { start: dates[0], end: dates[dates.length - 1] }
}

export function SubmissionHeatmap({ submissionCalendar }: { submissionCalendar: unknown }) {
  const values = normalizeCalendar(submissionCalendar)
  const range = getRange(values)

  return (
    <Card>
      <div className="mb-2 text-sm font-medium text-slate-100">Submission calendar</div>
      {values.length === 0 || !range ? (
        <div className="text-sm text-slate-400">No submission activity available.</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[720px] coderank-heatmap">
            <CalendarHeatmap
              startDate={range.start}
              endDate={range.end}
              values={values}
              classForValue={(v: any) => {
                const c = typeof v?.count === 'number' ? v.count : 0
                if (c <= 0) return 'color-empty'
                if (c < 2) return 'color-scale-1'
                if (c < 4) return 'color-scale-2'
                if (c < 7) return 'color-scale-3'
                return 'color-scale-4'
              }}
            />
          </div>
        </div>
      )}
    </Card>
  )
}

