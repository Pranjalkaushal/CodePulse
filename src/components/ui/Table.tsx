import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export function Table({
  columns,
  rows,
  className,
  keyField,
}: {
  columns: { key: string; header: ReactNode; className?: string }[]
  rows: Record<string, ReactNode>[]
  keyField: string
  className?: string
}) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-slate-800', className)}>
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/60">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn('px-3 py-2 text-left font-medium text-slate-200', c.className)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950/40">
          {rows.map((r) => (
            <tr key={String(r[keyField])} className="hover:bg-slate-900/40">
              {columns.map((c) => (
                <td key={c.key} className={cn('px-3 py-2 text-slate-100', c.className)}>
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

