/**
 * Nodemailer helper — Gmail SMTP.
 *
 * EMAIL_HOST  = smtp.gmail.com
 * EMAIL_PORT  = 587
 * EMAIL_USER  = your Gmail address
 * EMAIL_PASS  = 16-char Gmail App Password (2FA must be on)
 * EMAIL_TO    = where contact messages are delivered
 */

import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true only for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send contact-form message to the portfolio owner.
 * @returns {{ sent: boolean, error?: string }}
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || user.includes('your_gmail')) {
    console.warn('⚠️  Email credentials not configured — skipping send.');
    return { sent: false, error: 'Email credentials not configured.' };
  }

  const to  = process.env.EMAIL_TO || 'obsatesfaye6370@gmail.com';
  const sub = subject || 'No subject';

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#3b82f6;border-radius:8px 8px 0 0;padding:20px 24px;">
        <h2 style="color:#fff;margin:0;font-size:20px;">📬 New Portfolio Message</h2>
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-weight:600;color:#64748b;width:80px;">From:</td>
              <td style="padding:8px 0;color:#0f172a;">${name} &lt;${email}&gt;</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#64748b;">Subject:</td>
              <td style="padding:8px 0;color:#0f172a;">${sub}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;"/>
        <p style="color:#334155;line-height:1.7;margin:0;">${message.replace(/\n/g, '<br/>')}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;"/>
        <p style="color:#94a3b8;font-size:13px;margin:0;">Reply directly to respond to ${name}.</p>
      </div>
    </div>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${user}>`,
      to,
      replyTo: email,
      subject: `[Portfolio] ${sub}`,
      text:    `From: ${name} <${email}>\n\n${message}`,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('⚠️  Email send failed:', err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * Verify SMTP at startup (dev only, non-blocking).
 */
export async function verifyEmailConnection() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass || user.includes('your_gmail')) return;
  try {
    const t = createTransporter();
    await t.verify();
    console.log('✅  SMTP connection verified');
  } catch (err) {
    console.warn(`⚠️  SMTP verify failed: ${err.message}`);
  }
}
