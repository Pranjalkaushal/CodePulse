import type { ReactNode } from 'react'
import { Card } from './Card'

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: ReactNode
  hint?: string
  accent?: 'default' | 'primary'
}) {
  return (
    <Card className={accent === 'primary' ? 'border-slate-200 border-l-[3px] border-l-blue-600' : undefined}>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </Card>
  )
}
