import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, name, email } = req.body;

  if (!answers || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const formatAnswers = (answers) => {
    return answers.map(({ section, question, answer }) => `
<div style="margin-bottom: 24px;">
  <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C8A96E; margin-bottom: 4px;">${section}</div>
  <div style="font-size: 14px; color: #888; margin-bottom: 8px;">${question}</div>
  <div style="font-size: 15px; color: #F0EDE8; background: #1A1A1A; padding: 12px 16px; border-left: 3px solid #C8A96E;">${answer || '<em style="color: #555;">No answer provided</em>'}</div>
</div>
    `).join('');
  };

  try {
    await resend.emails.send({
      from: process.env.INTAKE_FROM_EMAIL,
      to: process.env.INTAKE_TO_EMAIL,
      subject: `🎯 New Migration Intake — ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background: #0F0F0F; color: #F0EDE8; font-family: Georgia, serif; margin: 0; padding: 0;">
  <div style="max-width: 680px; margin: 0 auto; padding: 40px 32px;">
    
    <div style="border-bottom: 1px solid #2A2A2A; padding-bottom: 24px; margin-bottom: 32px;">
      <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #666; margin-bottom: 8px;">
        Podcast Impact Studio
      </div>
      <h1 style="font-size: 28px; font-weight: 400; margin: 0 0 8px; color: #F0EDE8;">
        New Migration Intake
      </h1>
      <div style="font-size: 18px; color: #C8A96E;">${name}</div>
      <div style="font-size: 14px; color: #666; margin-top: 4px;">${email}</div>
    </div>

    <div style="margin-bottom: 40px;">
      ${formatAnswers(answers)}
    </div>

    <div style="border-top: 1px solid #2A2A2A; padding-top: 24px; font-size: 13px; color: #444;">
      Submitted via Impact Studio AI Migration intake form
    </div>
  </div>
</body>
</html>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
