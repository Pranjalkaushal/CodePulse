import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // IMPORTANT FIX (more stable than service:gmail)
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
    throw new Error(
      'Mail credentials are not configured'
    )
  }

  const clientUrl =
    process.env.CLIENT_URL ||
    'http://localhost:3000'

  try {
    await getTransporter().sendMail({
      from: `"CodePulse" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Your OTP for CodePulse signup',
      html: `
        <div style="font-family: Arial; padding: 10px;">
          <h2>CodePulse Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP expires in <b>10 minutes</b>.</p>
          <hr/>
          <p style="font-size: 12px;">${clientUrl}</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('OTP Email Error:', err.message)
    throw new Error('Failed to send OTP email')
  }
}