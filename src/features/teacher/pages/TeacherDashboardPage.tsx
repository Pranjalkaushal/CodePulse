import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Loader } from '../../../components/ui/Loader'
import { Alert } from '../../../components/ui/Alert'
import { Table } from '../../../components/ui/Table'
import { getErrorMessage } from '../../../utils/apiError'
import { getClassSummary, type ClassSummaryResponse } from '../services/teacherApi'
import { Input } from '../../../components/ui/Input'

function toArray(x: unknown) {
  return Array.isArray(x) ? x : []
}

export function TeacherDashboardPage() {
  const [data, setData] = useState<ClassSummaryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [classA, setClassA] = useState('')
  const [classB, setClassB] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    getClassSummary()
      .then((d) => {
        if (!alive) return
        setData(d)
      })
      .catch((e) => {
        if (!alive) return
        setError(getErrorMessage(e))
        setData(null)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const classRows = useMemo(() => {
    const classes = toArray(data?.classes)
    return classes
      .filter((c) => c && typeof c === 'object')
      .map((c: any, idx: number) => {
        const fallback = `${c.batch ?? ''}-${c.class ?? c.section ?? ''}`.trim()
        return {
          id: String(c.id ?? c.classId ?? (fallback || idx)),
        class: String(c.class ?? c.section ?? '-'),
        batch: String(c.batch ?? '-'),
        avgScore: typeof c.avgScore === 'number' ? c.avgScore : c.averageScore ?? '-',
        activeStudents: typeof c.activeStudents === 'number' ? c.activeStudents : c.studentCount ?? '-',
        health: String(c.health ?? c.status ?? '-'),
        }
      })
  }, [data])

  const atRiskRows = useMemo(() => {
    const students = toArray(data?.atRiskStudents)
    return students
      .filter((s) => s && typeof s === 'object')
      .map((s: any, idx: number) => ({
        id: String(s.id ?? s.studentId ?? s.email ?? idx),
        name: String(s.name ?? '-'),
        class: String(s.class ?? '-'),
        batch: String(s.batch ?? '-'),
        risk: String(s.risk ?? s.riskLevel ?? '-'),
        reason: String(s.reason ?? '-'),
      }))
  }, [data])

  const comparison = useMemo(() => {
    const classes = toArray(data?.classes).filter((c) => c && typeof c === 'object') as any[]
    const a = classes.find((c) => String(c.class ?? c.section ?? '') === classA)
    const b = classes.find((c) => String(c.class ?? c.section ?? '') === classB)
    if (!a || !b) return null
    return { a, b }
  }, [classA, classB, data])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">Teacher dashboard</h2>
          <p className="mt-1 text-sm text-slate-400">Class health, at-risk students, and comparisons.</p>
        </div>
        {loading ? <Loader label="Loading class summary..." /> : null}
      </div>

      {error ? <Alert title="Failed to load teacher dashboard" description={error} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <div className="text-sm font-medium text-slate-100">Class health</div>
          <Table
            keyField="id"
            columns={[
              { key: 'class', header: 'Class' },
              { key: 'batch', header: 'Batch' },
              { key: 'avgScore', header: 'Avg score' },
              { key: 'activeStudents', header: 'Active students' },
              { key: 'health', header: 'Health' },
            ]}
            rows={classRows}
          />
        </Card>

        <Card className="space-y-3">
          <div className="text-sm font-medium text-slate-100">At-risk students</div>
          <Table
            keyField="id"
            columns={[
              { key: 'name', header: 'Student' },
              { key: 'class', header: 'Class' },
              { key: 'batch', header: 'Batch' },
              { key: 'risk', header: 'Risk' },
              { key: 'reason', header: 'Reason' },
            ]}
            rows={atRiskRows}
          />
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="text-sm font-medium text-slate-100">Comparison tool</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Class A" placeholder="Exact class label from API" value={classA} onChange={(e) => setClassA(e.target.value)} />
          <Input label="Class B" placeholder="Exact class label from API" value={classB} onChange={(e) => setClassB(e.target.value)} />
        </div>

        {comparison ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="bg-slate-950/30">
              <div className="text-xs text-slate-400">Class A</div>
              <div className="text-sm text-slate-100">{String(comparison.a.class ?? comparison.a.section ?? '-')}</div>
              <div className="mt-1 text-xs text-slate-400">
                Avg score: {String(comparison.a.avgScore ?? comparison.a.averageScore ?? '-')}
              </div>
            </Card>
            <Card className="bg-slate-950/30">
              <div className="text-xs text-slate-400">Class B</div>
              <div className="text-sm text-slate-100">{String(comparison.b.class ?? comparison.b.section ?? '-')}</div>
              <div className="mt-1 text-xs text-slate-400">
                Avg score: {String(comparison.b.avgScore ?? comparison.b.averageScore ?? '-')}
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-sm text-slate-400">
            Enter two class labels (as returned by the API) to compare.
          </div>
        )}
      </Card>
    </div>
  )
}

