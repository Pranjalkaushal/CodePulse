import { cn } from '../../utils/cn'

export function Loader({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5 text-sm font-medium text-slate-600', className)}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      {label ? <span>{label}</span> : null}
    </div>
  )
}
