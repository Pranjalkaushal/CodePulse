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
        'rounded-xl border p-4 text-sm shadow-sm',
        variant === 'error' &&
          'border-rose-200 bg-rose-50 text-rose-900 [&_.desc]:text-rose-800/90',
        variant === 'info' && 'border-slate-200 bg-slate-50 text-slate-800 [&_.desc]:text-slate-600',
        variant === 'success' &&
          'border-emerald-200 bg-emerald-50 text-emerald-900 [&_.desc]:text-emerald-900/85',
        className,
      )}
    >
      <div className="font-semibold">{title}</div>
      {description ? <div className="desc mt-1 text-[13px] leading-relaxed">{description}</div> : null}
    </div>
  )
}
