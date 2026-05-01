import Student from '../models/Student.js'

export async function getStudentById(req, res, next) {
  try {
    const student = await Student.findById(req.params.id).select('-password')
    if (!student) {
      res.status(404)
      throw new Error('Student not found')
    }
    res.json({
      id: String(student._id),
      name: student.name,
      email: student.email,
      leetcodeUsername: student.leetcodeUsername,
      class: student.class,
      batch: student.batch,
      role: student.role,
    })
  } catch (e) {
    next(e)
  }
}

