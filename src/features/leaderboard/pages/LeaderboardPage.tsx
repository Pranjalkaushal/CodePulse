import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Table } from '../../../components/ui/Table'
import { PageHeader } from '../../../components/layout/PageHeader'
import { getLeaderboard } from '../services/leaderboardApi'
import { Skeleton } from '../../../components/ui/Skeleton'
import { Avatar } from '../../../components/ui/Avatar'
import { useAuthStore } from '../../../app/store/authStore'
import { Alert } from '../../../components/ui/Alert'

export function LeaderboardPage() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getLeaderboard()
        setRows(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const leaderboardRows = useMemo(() => {
    const q = query.toLowerCase().trim()
    const sorted = rows.filter((row) => !q || String(row.fullName || '').toLowerCase().includes(q))
    const currentId = user?.id

    return sorted.map((i, idx) => ({
      id: i.id,
      rank: i.position ?? idx + 1,
      avatar: (
        <div className="flex items-center gap-3">
          <Avatar name={i.fullName ?? '-'} />
          <div className="min-w-0">
            <div className={currentId === i.id ? 'font-semibold text-blue-900' : 'font-medium text-slate-900'}>
              {i.fullName}
            </div>
            {currentId === i.id ? (
              <div className="text-[11px] font-medium uppercase tracking-wide text-blue-600">You</div>
            ) : null}
          </div>
        </div>
      ),
      leetcodeUsername: i.leetcodeUsername ?? '-',
      easy: i.easySolved ?? '-',
      medium: i.mediumSolved ?? '-',
      hard: i.hardSolved ?? '-',
      solved: i.totalSolved ?? 0,
      consistency: `${i.consistencyScore ?? 0}%`,
      streak: i.streak ?? 0,
    }))
  }, [query, rows, user?.id])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leaderboard"
        />

      <Card className="space-y-4">
        <Input label="Search student" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
      </Card>
      {error ? <Alert title="Leaderboard unavailable" description={error} /> : null}

      {loading ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-[320px] w-full" />
        </div>
      ) : (
        <Table
          keyField="id"
          isRowHighlighted={(key) => key === user?.id}
          columns={[
            { key: 'rank', header: 'Rank', className: 'w-14 text-slate-500' },
            { key: 'avatar', header: 'Student', className: 'min-w-[220px]' },
            { key: 'leetcodeUsername', header: 'LeetCode' },
            { key: 'easy', header: 'Easy', className: 'w-20' },
            { key: 'medium', header: 'Medium', className: 'w-24' },
            { key: 'hard', header: 'Hard', className: 'w-20' },
            { key: 'solved', header: 'Solved', className: 'w-24' },
            { key: 'consistency', header: 'Consistency', className: 'w-24' },
            { key: 'streak', header: 'Streak', className: 'w-20' },
          ]}
          rows={leaderboardRows}
        />
      )}
    </div>
  )
}
