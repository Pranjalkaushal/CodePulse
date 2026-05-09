import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts'
import { Card } from '../ui/Card'

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

export function SkillRadarChart({ skillStats }: { skillStats: unknown }) {
  const data = normalizeSkillStats(skillStats)

  return (
    <Card className="h-[340px]">
      <div className="mb-3 text-sm font-semibold tracking-tight text-slate-900">Skill radar</div>
      {data.length === 0 ? (
        <div className="text-sm text-slate-500">No skill stats available.</div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <RadarChart data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                color: '#0f172a',
                boxShadow: '0 8px 24px -8px rgb(15 23 42 / 0.12)',
              }}
            />
            <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.22} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

