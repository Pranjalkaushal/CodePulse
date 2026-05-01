import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Loader } from '../../../components/ui/Loader'
import { Alert } from '../../../components/ui/Alert'
import { useAuthStore } from '../../../app/store/authStore'
import { getErrorMessage } from '../../../utils/apiError'
import { getStudent, type StudentResponse } from '../services/studentApi'
import { getStudentAnalytics, type AnalyticsResponse } from '../../analytics/services/analyticsApi'
import { SubmissionHeatmap } from '../../../components/charts/SubmissionHeatmap'
import { SkillRadarChart } from '../../../components/charts/SkillRadarChart'

type LoadState<T> = { data: T | null; loading: boolean; error: string | null }

function useStudentData(studentId: string | null) {
  const [student, setStudent] = useState<LoadState<StudentResponse>>({
    data: null,
    loading: false,
    error: null,
  })
  const [analytics, setAnalytics] = useState<LoadState<AnalyticsResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (!studentId) return
    let alive = true

    setStudent((s) => ({ ...s, loading: true, error: null }))
    setAnalytics((s) => ({ ...s, loading: true, error: null }))

    Promise.all([getStudent(studentId), getStudentAnalytics(studentId)])
      .then(([s, a]) => {
        if (!alive) return
        setStudent({ data: s, loading: false, error: null })
        setAnalytics({ data: a, loading: false, error: null })
      })
      .catch((e) => {
        if (!alive) return
        const msg = getErrorMessage(e)
        setStudent((prev) => ({ ...prev, loading: false, error: msg }))
        setAnalytics((prev) => ({ ...prev, loading: false, error: msg }))
      })

    return () => {
      alive = false
    }
  }, [studentId])

  return { student, analytics }
}

type RadarPoint = { skill: string; value: number }
function normalizeSkillStats(skillStats: unknown): RadarPoint[] {
  if (!skillStats) return []
  if (Array.isArray(skillStats)) {
    const points: RadarPoint[] = []
    for (const item of skillStats) {
      if (!item || typeof item !== 'object') continue
      const skill = (item as any).skill ?? (item as any).name ?? (item as any).topic
      const value = (item as any).value ?? (item as any).score ?? (item as any).level
      if (typeof skill === 'string' && typeof value === 'number') points.push({ skill, value })
    }
    return points
  }
  if (typeof skillStats === 'object') {
    const points: RadarPoint[] = []
    for (const [k, v] of Object.entries(skillStats as Record<string, unknown>)) {
      if (typeof v === 'number') points.push({ skill: k, value: v })
    }
    return points
  }
  return []
}

export function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const studentId = user?.id ?? null
  const { student, analytics } = useStudentData(studentId)

  const streak = useMemo(() => {
    const v = analytics.data?.streak
    if (typeof v === 'number') return v
    if (v && typeof v === 'object' && 'current' in (v as any) && typeof (v as any).current === 'number')
      return (v as any).current
    return null
  }, [analytics.data])

  const strengthWeakness = useMemo(() => {
    const points = normalizeSkillStats(analytics.data?.skillStats)
    if (points.length === 0) return null
    const sorted = [...points].sort((a, b) => b.value - a.value)
    return { strength: sorted[0], weakness: sorted[sorted.length - 1] }
  }, [analytics.data])

  if (!studentId) {
    return (
      <Alert
        title="Missing student id"
        description="Your session does not include a user id. Please log in again."
      />
    )
  }

  const loading = student.loading || analytics.loading
  const error = student.error || analytics.error

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">Student dashboard</h2>
          <p className="mt-1 text-sm text-slate-400">Profile, activity, and skill insights.</p>
        </div>
        {loading ? <Loader label="Loading dashboard..." /> : null}
      </div>

      {error ? <Alert title="Failed to load dashboard" description={error} /> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="text-sm font-medium text-slate-100">Profile summary</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-400">Name</div>
              <div className="text-sm text-slate-100">{student.data?.name ?? '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Email</div>
              <div className="text-sm text-slate-100">{student.data?.email ?? '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Batch</div>
              <div className="text-sm text-slate-100">{(student.data?.batch as string) ?? '-'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Class</div>
              <div className="text-sm text-slate-100">{(student.data?.class as string) ?? '-'}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-slate-100">Streak tracker</div>
          <div className="mt-2 text-3xl font-semibold text-slate-100">{streak ?? '-'}</div>
          <div className="mt-1 text-xs text-slate-400">Current streak (days)</div>
          <div className="mt-4 grid gap-2">
            <div className="text-xs font-medium text-slate-200">Strength & weakness</div>
            {strengthWeakness ? (
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Strength</span>
                  <span className="text-slate-100">
                    {strengthWeakness.strength.skill} ({strengthWeakness.strength.value})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Weakness</span>
                  <span className="text-slate-100">
                    {strengthWeakness.weakness.skill} ({strengthWeakness.weakness.value})
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No skill stats available.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SubmissionHeatmap submissionCalendar={analytics.data?.submissionCalendar} />
        <SkillRadarChart skillStats={analytics.data?.skillStats} />
      </div>
    </div>
  )
}

