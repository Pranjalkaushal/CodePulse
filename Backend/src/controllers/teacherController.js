import Student from '../models/Student.js'
import Snapshot from '../models/Snapshot.js'

function weightedScoreFromSolved(solved) {
  const easy = solved?.easy ?? 0
  const medium = solved?.medium ?? 0
  const hard = solved?.hard ?? 0
  return easy * 1 + medium * 3 + hard * 6
}

async function latestSnapshotMap(studentIds) {
  const rows = await Snapshot.aggregate([
    { $match: { studentId: { $in: studentIds } } },
    { $sort: { studentId: 1, date: -1 } },
    { $group: { _id: '$studentId', doc: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$doc' } },
  ])
  return new Map(rows.map((r) => [String(r.studentId), r]))
}

export async function getClassSummary(req, res, next) {
  try {
    const students = await Student.find({ role: 'student' }).select('-password')
    const ids = students.map((s) => s._id)
    const latest = await latestSnapshotMap(ids)

    const byClass = new Map()
    const atRisk = []

    for (const s of students) {
      const snap = latest.get(String(s._id))
      const score = snap?.derived?.weightedScore ?? weightedScoreFromSolved(snap?.totalSolved)

      const key = `${s.batch ?? '-'}__${s.class ?? '-'}`
      const bucket = byClass.get(key) || {
        class: s.class ?? '-',
        batch: s.batch ?? '-',
        totalScore: 0,
        count: 0,
      }
      bucket.totalScore += Number(score) || 0
      bucket.count += 1
      byClass.set(key, bucket)

      // At-risk heuristic: low weighted score (no dummy data; purely derived from snapshots)
      if (snap && (Number(score) || 0) < 30) {
        atRisk.push({
          id: String(s._id),
          name: s.name,
          class: s.class ?? '-',
          batch: s.batch ?? '-',
          risk: 'low-score',
          reason: 'Weighted score below threshold',
        })
      }
    }

    const classes = Array.from(byClass.values()).map((c) => {
      const avg = c.count ? c.totalScore / c.count : 0
      return {
        class: c.class,
        batch: c.batch,
        avgScore: Math.round(avg * 100) / 100,
        activeStudents: c.count,
        health: avg >= 120 ? 'great' : avg >= 60 ? 'ok' : 'needs-attention',
      }
    })

    res.json({
      classes,
      atRiskStudents: atRisk,
    })
  } catch (e) {
    next(e)
  }
}

