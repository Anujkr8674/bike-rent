import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || "587");
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const mailer =
  host && user && pass
    ? nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      })
    : null;

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export async function sendMail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  if (!mailer) {
    console.warn("[email] SMTP not configured, skipping:", options.subject);
    return false;
  }

  await mailer.sendMail({
    from: `"Nextgen Bike Rent" <${user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
  return true;
}
