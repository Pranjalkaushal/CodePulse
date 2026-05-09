import type { PropsWithChildren } from 'react'
import { cn } from '../../utils/cn'

export function Card({
  className,
  children,
}: PropsWithChildren<{
  className?: string
}>) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-card', className)}>{children}</div>
  )
}
