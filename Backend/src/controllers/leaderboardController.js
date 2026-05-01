import Student from '../models/Student.js'
import Snapshot from '../models/Snapshot.js'

async function latestSnapshotsByStudent(studentIds) {
  // Mongo aggregation: pick the latest snapshot per studentId
  const rows = await Snapshot.aggregate([
    { $match: { studentId: { $in: studentIds } } },
    { $sort: { studentId: 1, date: -1 } },
    {
      $group: {
        _id: '$studentId',
        doc: { $first: '$$ROOT' },
      },
    },
    { $replaceRoot: { newRoot: '$doc' } },
  ])
  const map = new Map(rows.map((r) => [String(r.studentId), r]))
  return map
}

export async function getLeaderboard(req, res, next) {
  try {
    const classFilter = req.query.class ? String(req.query.class) : null
    const batchFilter = req.query.batch ? String(req.query.batch) : null

    const query = {}
    if (classFilter) query.class = classFilter
    if (batchFilter) query.batch = batchFilter

    const students = await Student.find(query).select('-password')
    const ids = students.map((s) => s._id)
    const latest = await latestSnapshotsByStudent(ids)

    const result = students.map((s) => {
      const snap = latest.get(String(s._id))
      const easy = snap?.totalSolved?.easy ?? 0
      const medium = snap?.totalSolved?.medium ?? 0
      const hard = snap?.totalSolved?.hard ?? 0
      return {
        id: String(s._id),
        name: s.name,
        email: s.email,
        class: s.class,
        batch: s.batch,
        easy,
        medium,
        hard,
      }
    })

    res.json(result)
  } catch (e) {
    next(e)
  }
}

