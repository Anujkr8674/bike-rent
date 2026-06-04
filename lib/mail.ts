import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  if (!process.env.SMTP_USER) {
    console.warn("SMTP not configured, OTP:", otp);
    return;
  }

  await transporter.sendMail({
    from: `"Nextgen Bike Rent Service" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Nextgen OTP Code",
    html: `<div style="font-family:Inter,Arial,sans-serif;padding:16px">
      <h2>Login OTP</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:6px">${otp}</h1>
      <p>It expires in 10 minutes.</p>
    </div>`,
  });
}

export async function sendResetEmail(email: string, resetUrl: string) {
  if (!process.env.SMTP_USER) {
    console.warn("SMTP not configured, reset URL:", resetUrl);
    return;
  }

  await transporter.sendMail({
    from: `"Nextgen Bike Rent Service" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your Nextgen password",
    html: `<div style="font-family:Inter,Arial,sans-serif;padding:16px">
      <h2>Password Reset</h2>
      <p>Click the link below to set a new password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 30 minutes.</p>
    </div>`,
  });
}
