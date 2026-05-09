import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ className, label, error, id, ...props }: Props) {
  const resolvedId = id ?? props.name
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={resolvedId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        id={resolvedId}
        className={cn(
          'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition-colors duration-150',
          'focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
          error && 'border-rose-500 focus:border-rose-600 focus:ring-rose-600',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}
