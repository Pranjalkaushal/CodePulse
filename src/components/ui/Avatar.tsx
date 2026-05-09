import { cn } from '../../utils/cn'

export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const initials =
    parts.length >= 2
      ? `${parts[0]![0]!}${parts[parts.length - 1]![0]!}`.toUpperCase()
      : (parts[0]?.slice(0, 2) ?? '?').toUpperCase()
  const sm = size === 'sm'

  return (
    <div
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 ring-1 ring-inset ring-slate-200/80',
        sm ? 'h-8 w-8 text-[10px]' : 'h-10 w-10 text-xs',
        className,
      )}
      aria-hidden
    >
      {initials.slice(0, 2)}
    </div>
  )
}
