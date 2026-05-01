import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    leetcodeUsername: { type: String, required: true, unique: true, trim: true },

    class: { type: String, trim: true },
    batch: { type: String, trim: true },

    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },

    leetcodeStats: {
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      ranking: { type: Number, default: 0 },
      submissionCalendar: { type: mongoose.Schema.Types.Mixed, default: {} },
      recentSubmissions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    },
  },
  { timestamps: true },
)

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('Student', studentSchema)

