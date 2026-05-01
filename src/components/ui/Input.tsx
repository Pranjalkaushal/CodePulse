import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ className, label, error, id, ...props }: Props) {
  const resolvedId = id ?? props.name
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={resolvedId} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      ) : null}
      <input
        id={resolvedId}
        className={cn(
          'w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600',
          error && 'border-rose-600 focus:ring-rose-600',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
    </div>
  )
}

