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
      <div className="mb-2 text-sm font-medium text-slate-100">Skill radar</div>
      {data.length === 0 ? (
        <div className="text-sm text-slate-400">No skill stats available.</div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <RadarChart data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#0b1220', border: '1px solid #1f2937', color: '#e5e7eb' }}
            />
            <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

