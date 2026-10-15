
import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  }

  return transporter
}

export async function sendOtpEmail(email, otp) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('Mail credentials are not configured')
  }

  const clientUrl =
    process.env.CLIENT_URL || 'https://code-pulse-neon.vercel.app'

  try {
    console.log('OTP email: connecting to SMTP')

    await getTransporter().sendMail({
      from: `"CodePulse" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Your OTP for CodePulse signup',
      text: `Your CodePulse signup OTP is ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>CodePulse Verification</h2>
          <p>Your signup OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP expires in <b>5 minutes</b>.</p>
          <p>${clientUrl}</p>
        </div>
      `,
    })

    console.log('OTP email: sent successfully')
  } catch (err) {
    console.error('OTP email failed:', err.message)
    throw new Error('Failed to send OTP email. Please try again.')
  }
}
