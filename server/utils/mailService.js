const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer and Gmail App Passwords.
 * Does not throw errors to ensure backend operations continue even if email fails.
 * Logs any email sending errors locally on the backend.
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Text version of the body
 * @param {string} [options.html] - HTML version of the body (optional)
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const emailUser = process.env.EMAIL_USER || "shichan132@gmail.com";
  const emailPass = process.env.EMAIL_PASS || "bsjq fvhn htev mktu";

  if (!emailUser || !emailPass) {
    console.error('Mail Service Error: EMAIL_USER or EMAIL_PASS is not configured in environment variables.');
    return;
  }

  console.log(`[Email Service] Email sending started to: ${to} (Subject: "${subject}")`);
  console.log(`[Email Service] Configured Sender/Auth User: ${emailUser}`);
  console.log(`[Email Service] Configured Pass Length: ${emailPass ? emailPass.length : 0}`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"MongoMeals" <${emailUser}>`,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent successfully to: ${to}`);
    console.log(`[Email Service] SMTP Response: ${info.response}`);
    console.log(`[Email Service] Accepted Recipients:`, info.accepted);
    console.log(`[Email Service] Rejected Recipients:`, info.rejected);
    console.log(`[Email Service] Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email Service] Exact email error if failed to ${to}:`, error);
  }
};

module.exports = { sendEmail };
