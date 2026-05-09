import mongoose from 'mongoose'

const topicExpertSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, unique: true, trim: true },
    topStudents: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          fullName: { type: String, required: true },
          solvedCount: { type: Number, required: true },
          rank: { type: Number, required: true },
        },
      ],
      default: [],
    },
    solvedCount: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model('TopicExpert', topicExpertSchema)

