const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.',
    });
  }

  try {
    await resend.emails.send({
      from: 'ReqClarity AI <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL,
      subject: `[ReqClarity Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
            New Contact Form Submission — ReqClarity AI
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #64748b; width: 100px;">Name:</td>
              <td style="padding: 8px; color: #1e293b;">${name}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 8px; font-weight: bold; color: #64748b;">Email:</td>
              <td style="padding: 8px; color: #1e293b;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #64748b;">Subject:</td>
              <td style="padding: 8px; color: #1e293b;">${subject}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 8px; font-weight: bold; color: #64748b; vertical-align: top;">Message:</td>
              <td style="padding: 8px; color: #1e293b; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
            Sent from ReqClarity AI Contact Form
          </p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: 'Message sent successfully!',
    });

  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.',
    });
  }
});

module.exports = router;