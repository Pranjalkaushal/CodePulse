import { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Table } from '../../../components/ui/Table'
import { PageHeader } from '../../../components/layout/PageHeader'
import { Avatar } from '../../../components/ui/Avatar'
import { Skeleton } from '../../../components/ui/Skeleton'
import { EmptyState } from '../../../components/layout/EmptyState'
import { getTopicExperts } from '../services/mentorshipApi'
import { Alert } from '../../../components/ui/Alert'

export function MentorshipPage() {
  const [experts, setExperts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getTopicExperts()
        setExperts(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load topic experts')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Topic Experts"
        description="Students ranked by solved counts across LeetCode topics."
      />
      {error ? <Alert title="Topic experts unavailable" description={error} /> : null}

      {loading ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-[280px] w-full" />
        </div>
      ) : experts.length === 0 ? (
        <EmptyState
          title="No mentorship graph yet"
          description="Hydrate leaderboard payloads with granular skill buckets to populate this explorer."
        />
      ) : (
        <Card>
          <Table
            keyField="topic"
            columns={[
              { key: 'topic', header: 'Topic' },
              { key: 'student', header: 'Expert Student' },
              { key: 'solved', header: 'Problems Solved', className: 'w-36 text-right' },
              { key: 'rank', header: 'Rank', className: 'w-24 text-right' },
            ]}
            rows={experts.map((e) => ({
              topic: <span className="font-semibold text-slate-900">{e.topic}</span>,
              student: (
                <div className="flex items-center gap-3">
                  <Avatar name={e.topStudents?.[0]?.fullName ?? 'Student'} />
                  <div className="text-sm font-semibold text-slate-900">{e.topStudents?.[0]?.fullName ?? '—'}</div>
                </div>
              ),
              solved: <span className="block text-right font-semibold tabular-nums text-slate-900">{e.topStudents?.[0]?.solvedCount ?? 0}</span>,
              rank: <span className="block text-right font-semibold tabular-nums text-slate-900">{e.topStudents?.[0]?.rank ?? 1}</span>,
            }))}
          />
        </Card>
      )}
    </div>
  )
}
