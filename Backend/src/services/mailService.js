
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOtpEmail(email, otp) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const clientUrl =
    process.env.CLIENT_URL || 'https://code-pulse-neon.vercel.app'

  const { data, error } = await resend.emails.send({
    from: 'CodePulse <onboarding@resend.dev>',
    to: [email],
    subject: 'Your OTP for CodePulse signup',
    text: `Your CodePulse signup OTP is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>CodePulse Verification</h2>
        <p>Your signup OTP is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP expires in <b>5 minutes</b>.</p>
        <p><a href="${clientUrl}">Open CodePulse</a></p>
      </div>
    `,
  })

  if (error) {
    console.error('Resend email failed:', error.message)
    throw new Error('Failed to send OTP email. Please try again.')
  }

  console.log('OTP email sent successfully:', data?.id)
}
