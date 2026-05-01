import mongoose from 'mongoose'

const snapshotSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },

    date: {
      type: Date,
      default: Date.now,
      index: true,
    },

    totalSolved: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
    },

    totalSubmissions: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
    },

    contest: {
      rating: { type: Number, default: 0 },
      ranking: { type: Number, default: 0 },
    },

    skillStats: {
      type: Map,
      of: Number,
      default: {},
    },

    submissionCalendar: {
      type: Map,
      of: Number,
      default: {},
    },

    derived: {
      weightedScore: { type: Number, default: 0 },
      placementScore: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
)

snapshotSchema.index({ studentId: 1, date: -1 })

export default mongoose.model('Snapshot', snapshotSchema)

