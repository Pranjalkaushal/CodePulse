import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Table } from '../../../components/ui/Table'
import { Input } from '../../../components/ui/Input'
import { PageHeader } from '../../../components/layout/PageHeader'
import { Skeleton } from '../../../components/ui/Skeleton'
import { getTeacherAnalytics } from '../services/teacherApi'
import { Alert } from '../../../components/ui/Alert'

export function TeacherDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [studentA, setStudentA] = useState('')
  const [studentB, setStudentB] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getTeacherAnalytics()
        setData(response)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load teacher analytics')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const topSolvers = Array.isArray(data?.topSolvers) ? data.topSolvers : []
  const consistent = Array.isArray(data?.mostConsistent) ? data.mostConsistent : []
  const inactive = Array.isArray(data?.inactiveStudents) ? data.inactiveStudents : []

  const comparison = useMemo(() => {
    const a = topSolvers.find((s: any) => String(s.fullName || '').toUpperCase() === studentA.toUpperCase().trim())
    const b = topSolvers.find((s: any) => String(s.fullName || '').toUpperCase() === studentB.toUpperCase().trim())
    if (!a || !b) return null
    return {
      a: { name: a.fullName, solved: a.stats?.totalSolved ?? 0, consistency: a.stats?.consistencyScore ?? 0 },
      b: { name: b.fullName, solved: b.stats?.totalSolved ?? 0, consistency: b.stats?.consistencyScore ?? 0 },
    }
  }, [studentA, studentB, topSolvers])

  const consistentRows = useMemo(
    () =>
      consistent.map((row: any, idx: number) => ({
        id: String(row._id || idx),
        consistencyScore: `${row.consistencyScore ?? 0}%`,
        totalSolved: row.totalSolved ?? 0,
        streak: row.streak ?? 0,
      })),
    [consistent],
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Teacher"
        description="Read-only analytics view built from real student LeetCode data."
      />
      {error ? <Alert title="Teacher analytics unavailable" description={error} /> : null}

      {loading ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[360px] w-full" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4">
            <div className="text-sm font-semibold text-slate-900">Top Solvers</div>
            <Table
              keyField="id"
              columns={[
                { key: 'fullName', header: 'Student' },
                { key: 'leetcodeUsername', header: 'LeetCode' },
                { key: 'solved', header: 'Solved' },
                { key: 'consistency', header: 'Consistency' },
              ]}
              rows={topSolvers.map((s: any, idx: number) => ({
                id: String(s.id || idx),
                fullName: s.fullName,
                leetcodeUsername: s.leetcodeUsername,
                solved: s.stats?.totalSolved ?? 0,
                consistency: `${s.stats?.consistencyScore ?? 0}%`,
              }))}
            />
          </Card>

          <Card className="space-y-4">
            <div className="text-sm font-semibold text-slate-900">Inactive Students</div>
            <Table
              keyField="id"
              columns={[
                { key: 'fullName', header: 'Student' },
                { key: 'leetcodeUsername', header: 'LeetCode' },
                { key: 'consistency', header: 'Consistency' },
                { key: 'streak', header: 'Streak' },
              ]}
              rows={inactive.map((s: any, idx: number) => ({
                id: String(s.id || idx),
                fullName: s.fullName,
                leetcodeUsername: s.leetcodeUsername,
                consistency: `${s.stats?.consistencyScore ?? 0}%`,
                streak: s.stats?.streak ?? 0,
              }))}
            />
          </Card>

          <Card className="space-y-4 lg:col-span-2">
            <div className="text-sm font-semibold text-slate-900">Compare two students</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Student A" placeholder="Try Alex" value={studentA} onChange={(e) => setStudentA(e.target.value)} />
              <Input label="Student B" placeholder="Try Priya" value={studentB} onChange={(e) => setStudentB(e.target.value)} />
            </div>
            {comparison ? (
              <div className="grid gap-3 md:grid-cols-2">
                <Card className="shadow-sm">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Class A</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{comparison.a.name}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Solved <span className="font-semibold text-slate-900">{comparison.a.solved}</span>
                  </div>
                </Card>
                <Card className="shadow-sm">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Class B</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{comparison.b.name}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Solved <span className="font-semibold text-slate-900">{comparison.b.solved}</span>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-sm font-medium text-slate-600">Pick two student names listed in Top Solvers to compare.</div>
            )}
          </Card>
          <Card className="space-y-4 lg:col-span-2">
            <div className="text-sm font-semibold text-slate-900">Most Consistent Students</div>
            <Table
              keyField="id"
              columns={[
                { key: 'consistencyScore', header: 'Consistency' },
                { key: 'totalSolved', header: 'Solved' },
                { key: 'streak', header: 'Streak' },
              ]}
              rows={consistentRows}
            />
          </Card>
        </div>
      )}
    </div>
  )
}
