import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Loader } from '../../../components/ui/Loader'
import { Alert } from '../../../components/ui/Alert'
import { Table } from '../../../components/ui/Table'
import { Input } from '../../../components/ui/Input'
import { getErrorMessage } from '../../../utils/apiError'
import { getLeaderboard, type LeaderboardItem } from '../services/leaderboardApi'

function weightedScore(item: LeaderboardItem) {
  const easy = typeof item.easy === 'number' ? item.easy : 0
  const medium = typeof item.medium === 'number' ? item.medium : 0
  const hard = typeof item.hard === 'number' ? item.hard : 0
  return easy * 1 + medium * 3 + hard * 6
}

export function LeaderboardPage() {
  const [classFilter, setClassFilter] = useState('')
  const [batchFilter, setBatchFilter] = useState('')
  const [items, setItems] = useState<LeaderboardItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)

    getLeaderboard({
      class: classFilter.trim() ? classFilter.trim() : undefined,
      batch: batchFilter.trim() ? batchFilter.trim() : undefined,
    })
      .then((data) => {
        if (!alive) return
        setItems(data)
      })
      .catch((e) => {
        if (!alive) return
        setError(getErrorMessage(e))
        setItems(null)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [classFilter, batchFilter])

  const rows = useMemo(() => {
    const data = items ?? []
    return [...data]
      .map((i) => ({ ...i, _score: weightedScore(i) }))
      .sort((a, b) => (b._score as number) - (a._score as number))
      .map((i, idx) => ({
        rank: idx + 1,
        id: i.id,
        name: i.name ?? '-',
        class: i.class ?? '-',
        batch: i.batch ?? '-',
        easy: typeof i.easy === 'number' ? i.easy : '-',
        medium: typeof i.medium === 'number' ? i.medium : '-',
        hard: typeof i.hard === 'number' ? i.hard : '-',
        score: i._score as number,
      }))
  }, [items])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">Leaderboard</h2>
          <p className="mt-1 text-sm text-slate-400">
            Weighted score = Easy×1 + Medium×3 + Hard×6
          </p>
        </div>
        {loading ? <Loader label="Loading leaderboard..." /> : null}
      </div>

      <Card className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Filter by Class"
            placeholder="e.g. CSE-A"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          />
          <Input
            label="Filter by Batch"
            placeholder="e.g. 2026"
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-400">
          Filters are sent to the backend as query params; results depend on API support.
        </div>
      </Card>

      {error ? <Alert title="Failed to load leaderboard" description={error} /> : null}

      <Table
        keyField="id"
        columns={[
          { key: 'rank', header: '#', className: 'w-14' },
          { key: 'name', header: 'Student' },
          { key: 'class', header: 'Class' },
          { key: 'batch', header: 'Batch' },
          { key: 'easy', header: 'Easy', className: 'w-20' },
          { key: 'medium', header: 'Medium', className: 'w-24' },
          { key: 'hard', header: 'Hard', className: 'w-20' },
          { key: 'score', header: 'Weighted score', className: 'w-36' },
        ]}
        rows={rows}
      />
    </div>
  )
}

