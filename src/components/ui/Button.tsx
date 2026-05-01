import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary' && 'bg-indigo-600 text-white hover:bg-indigo-500',
        variant === 'secondary' && 'bg-slate-800 text-slate-100 hover:bg-slate-700',
        variant === 'ghost' && 'bg-transparent text-slate-200 hover:bg-slate-900',
        variant === 'danger' && 'bg-rose-600 text-white hover:bg-rose-500',
        className,
      )}
      {...props}
    />
  )
}

