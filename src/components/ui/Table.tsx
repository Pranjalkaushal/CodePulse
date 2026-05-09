import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export function Table({
  columns,
  rows,
  className,
  keyField,
  isRowHighlighted,
}: {
  columns: { key: string; header: ReactNode; className?: string }[]
  rows: Record<string, ReactNode>[]
  keyField: string
  className?: string
  isRowHighlighted?: (rowKey: string) => boolean
}) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card', className)}>
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500',
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                No data to show.
              </td>
            </tr>
          ) : (
            rows.map((r) => {
              const rk = String(r[keyField] ?? '')
              const hi = isRowHighlighted?.(rk)
              return (
                <tr
                  key={rk}
                  className={cn(
                    'transition-colors duration-150 hover:bg-slate-50',
                    hi && 'bg-blue-50/70',
                  )}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn('px-4 py-3 text-slate-800', c.className)}>
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
