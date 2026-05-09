import { Card } from '../ui/Card'
import type { DashboardActivity } from '../../data/mock/dashboard'

const badge: Record<DashboardActivity['kind'], { label: string; className: string }> = {
  solve: {
    label: 'Solve',
    className: 'border border-blue-100 bg-blue-50 text-blue-900',
  },
  contest: {
    label: 'Contest',
    className: 'border border-slate-200 bg-slate-100 text-slate-800',
  },
  streak: {
    label: 'Streak',
    className: 'border border-slate-200 bg-white text-slate-800',
  },
  topic: {
    label: 'Topic',
    className: 'border border-slate-200 bg-slate-50 text-slate-800',
  },
}

export function RecentActivityList({ items }: { items: DashboardActivity[] }) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
        <p className="mt-1 text-xs text-slate-500">Latest events (sample data).</p>
      </div>

      <ul className="divide-y divide-slate-100">
        {items.map((a) => {
          const b = badge[a.kind]
          return (
            <li key={a.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${b.className}`}
              >
                {b.label.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-900">{a.title}</div>
                <div className="mt-0.5 text-xs text-slate-600">{a.subtitle}</div>
              </div>
              <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">{a.timeLabel}</span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
