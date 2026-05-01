import type { PropsWithChildren } from 'react'
import { cn } from '../../utils/cn'

export function Card({
  className,
  children,
}: PropsWithChildren<{
  className?: string
}>) {
  return (
    <div className={cn('rounded-xl border border-slate-800 bg-slate-900/40 p-4', className)}>
      {children}
    </div>
  )
}

