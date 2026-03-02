import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendApprovalEmail(to: string, orderId: string, customerName?: string) {
    if (!to) return;

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from,
        to,
        subject: "✅ Your Payment Has Been Approved – PlannerCraft",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #2d6a4f;">Payment Approved!</h2>
        <p>Hi ${customerName || "there"},</p>
        <p>Great news! Your payment for order <strong>#${orderId}</strong> has been verified and approved.</p>
        <p>Your order is now being processed and will be delivered to you shortly.</p>
        <br/>
        <p style="color: #555;">Thank you for shopping with <strong>PlannerCraft</strong>!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;"/>
        <p style="font-size: 12px; color: #999;">If you have any questions, please contact us at ${from}</p>
      </div>
    `,
    });
}
