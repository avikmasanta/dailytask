import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587),
  secure: process.env.SMTP_SECURE === "true" || false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
})

export async function sendApprovalEmail(to: string, orderId: string) {
  if (!to) return
  const subject = "Your order has been approved"
  const text = `Hello,\n\nYour order ${orderId} has been approved and is being processed.\n\nThank you for shopping with us!`
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  })
}
