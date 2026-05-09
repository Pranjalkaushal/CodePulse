import { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { StatCard } from '../../../components/ui/StatCard'
import { Avatar } from '../../../components/ui/Avatar'
import { PageHeader } from '../../../components/layout/PageHeader'
import { DashboardSkeleton } from '../../../components/dashboard/DashboardSkeleton'
import { SubmissionHeatmap } from '../../../components/charts/SubmissionHeatmap'
import { SkillRadarChart } from '../../../components/charts/SkillRadarChart'
import { Alert } from '../../../components/ui/Alert'
import { getMe } from '../services/studentApi'

export function StudentDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError('')
        const me = await getMe()
        setData(me)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) return <Alert title="Dashboard unavailable" description={error} />

  const stats = data?.stats || {}

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your profile, key metrics, and recent practice activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Solved" value={stats.totalSolved ?? 0} hint="All solved problems" accent="primary" />
        <StatCard label="Global Ranking" value={stats.ranking ? `#${stats.ranking}` : '—'} hint="LeetCode rank" />
        <StatCard label="Consistency" value={`${stats.consistencyScore ?? 0}%`} hint="Last 30 days activity" />
        <StatCard label="Streak" value={stats.streak ?? 0} hint="Current streak in days" />
      </div>

      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar name={data?.fullName ?? data?.email ?? 'Student'} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{data?.fullName ?? 'Student'}</h2>
            <p className="mt-1 text-sm text-slate-600">{data?.email ?? '-'}</p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs font-medium text-slate-500">LeetCode</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{data?.leetcodeUsername ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Easy</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{stats.easySolved ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Medium</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{stats.mediumSolved ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Hard</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{stats.hardSolved ?? 0}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <SubmissionHeatmap submissionCalendar={Object.entries(stats.submissionCalendar || {}).map(([k, v]) => ({ date: new Date(Number(k) * 1000).toISOString().slice(0, 10), count: Number(v) || 0 }))} />
        <SkillRadarChart skillStats={stats.topicStats || {}} />
      </div>
    </div>
  )
}
