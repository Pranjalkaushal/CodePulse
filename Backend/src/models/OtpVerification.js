import mongoose from 'mongoose'

const otpVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    // ✅ REQUIRED FIX (used in controller logic)
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

/**
 * Auto delete expired OTPs
 */
otpVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)

export default mongoose.model(
  'OtpVerification',
  otpVerificationSchema
)