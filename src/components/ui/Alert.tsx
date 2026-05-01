import { cn } from '../../utils/cn'

export function Alert({
  title,
  description,
  variant = 'error',
  className,
}: {
  title: string
  description?: string
  variant?: 'error' | 'info' | 'success'
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3 text-sm',
        variant === 'error' && 'border-rose-900/60 bg-rose-950/30 text-rose-100',
        variant === 'info' && 'border-slate-800 bg-slate-900/40 text-slate-100',
        variant === 'success' && 'border-emerald-900/60 bg-emerald-950/30 text-emerald-100',
        className,
      )}
    >
      <div className="font-medium">{title}</div>
      {description ? <div className="mt-1 text-slate-200/90">{description}</div> : null}
    </div>
  )
}

