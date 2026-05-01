import type { LeaderboardItem } from '../../leaderboard/services/leaderboardApi'
import { getLeaderboard } from '../../leaderboard/services/leaderboardApi'

export type TopicExpert = {
  topic: string
  student: { id: string; name?: string; class?: string; batch?: string }
  score: number
}

function normalizeSkillStats(skillStats: unknown): { topic: string; value: number }[] {
  if (!skillStats) return []
  if (Array.isArray(skillStats)) {
    const out: { topic: string; value: number }[] = []
    for (const item of skillStats) {
      if (!item || typeof item !== 'object') continue
      const topic = (item as any).topic ?? (item as any).skill ?? (item as any).name
      const value = (item as any).value ?? (item as any).score ?? (item as any).level
      if (typeof topic === 'string' && typeof value === 'number') out.push({ topic, value })
    }
    return out
  }
  if (typeof skillStats === 'object') {
    return Object.entries(skillStats as Record<string, unknown>)
      .filter(([, v]) => typeof v === 'number')
      .map(([topic, value]) => ({ topic, value: value as number }))
  }
  return []
}

export async function getTopicExperts() {
  // Uses the existing leaderboard endpoint. If the backend doesn't include `skillStats` per student,
  // the UI will show an empty-state rather than mock data.
  const students = await getLeaderboard()
  const bestByTopic = new Map<string, TopicExpert>()

  for (const s of students) {
    const stats = normalizeSkillStats((s as LeaderboardItem & { skillStats?: unknown }).skillStats)
    for (const { topic, value } of stats) {
      const prev = bestByTopic.get(topic)
      if (!prev || value > prev.score) {
        bestByTopic.set(topic, {
          topic,
          student: { id: s.id, name: s.name, class: s.class, batch: s.batch },
          score: value,
        })
      }
    }
  }

  return Array.from(bestByTopic.values()).sort((a, b) => b.score - a.score)
}

