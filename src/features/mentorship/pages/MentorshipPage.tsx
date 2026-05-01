import { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Loader } from '../../../components/ui/Loader'
import { Alert } from '../../../components/ui/Alert'
import { Table } from '../../../components/ui/Table'
import { getErrorMessage } from '../../../utils/apiError'
import { getTopicExperts, type TopicExpert } from '../services/mentorshipApi'

export function MentorshipPage() {
  const [experts, setExperts] = useState<TopicExpert[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    getTopicExperts()
      .then((data) => {
        if (!alive) return
        setExperts(data)
      })
      .catch((e) => {
        if (!alive) return
        setError(getErrorMessage(e))
        setExperts(null)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">Mentorship</h2>
          <p className="mt-1 text-sm text-slate-400">Find topic experts using skillStats.</p>
        </div>
        {loading ? <Loader label="Loading experts..." /> : null}
      </div>

      {error ? <Alert title="Failed to load mentors" description={error} /> : null}

      <Card className="space-y-3">
        {experts && experts.length === 0 ? (
          <Alert
            variant="info"
            title="No experts found"
            description="The backend did not return skillStats per student (or it was empty)."
          />
        ) : null}

        <Table
          keyField="topic"
          columns={[
            { key: 'topic', header: 'Topic' },
            { key: 'student', header: 'Top student' },
            { key: 'class', header: 'Class' },
            { key: 'batch', header: 'Batch' },
            { key: 'score', header: 'Score' },
          ]}
          rows={(experts ?? []).map((e) => ({
            topic: e.topic,
            student: e.student.name ?? e.student.id,
            class: e.student.class ?? '-',
            batch: e.student.batch ?? '-',
            score: e.score,
          }))}
        />
      </Card>
    </div>
  )
}

