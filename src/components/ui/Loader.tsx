import { cn } from '../../utils/cn'

export function Loader({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex items-center gap-3 text-sm text-slate-300', className)}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-slate-200" />
      {label ? <span>{label}</span> : null}
    </div>
  )
}

