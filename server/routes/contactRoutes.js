const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields are required.",
    });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid email address.",
    });
  }

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email to YOU (the owner)
    const ownerMailOptions = {
      from: process.env.CONTACT_EMAIL,
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
    };

    // Confirmation email to the SENDER
    const senderMailOptions = {
      from: process.env.CONTACT_EMAIL,
      to: email,
      subject: `We received your message — ReqClarity AI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Thanks for reaching out, ${name}!</h2>
          <p style="color: #64748b; line-height: 1.7;">
            We've received your message and will get back to you as soon as possible.
          </p>
          <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #1e293b; font-weight: bold;">Your message:</p>
            <p style="margin: 8px 0 0; color: #64748b; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
            — The ReqClarity AI Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(senderMailOptions);

    res.json({
      success: true,
      message:
        "Message sent successfully! Check your email for a confirmation.",
    });
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
});

module.exports = router;
