const User = require('../models/User');
const CommunitySubscriber = require('../models/CommunitySubscriber');
const nodemailer = require('nodemailer');

// Helper to validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Get all unique broadcast recipients from Users and CommunitySubscribers
// @route   GET /api/broadcast/recipients
// @access  Private/Admin
const getRecipients = async (req, res) => {
  try {
    const users = await User.find({}, 'email');
    const subscribers = await CommunitySubscriber.find({ subscribed: true }, 'email');

    const emailMap = new Map();

    // Process registered users
    for (const u of users) {
      if (u.email) {
        const normalized = u.email.toLowerCase().trim();
        if (emailRegex.test(normalized)) {
          emailMap.set(normalized, {
            email: normalized,
            isUser: true,
            isSub: false
          });
        }
      }
    }

    // Process community subscribers
    for (const s of subscribers) {
      if (s.email) {
        const normalized = s.email.toLowerCase().trim();
        if (emailRegex.test(normalized)) {
          if (emailMap.has(normalized)) {
            emailMap.get(normalized).isSub = true;
          } else {
            emailMap.set(normalized, {
              email: normalized,
              isUser: false,
              isSub: true
            });
          }
        }
      }
    }

    // Build the final response list
    const recipients = Array.from(emailMap.values()).map(item => {
      let source = '';
      if (item.isUser && item.isSub) {
        source = 'Registered User & Community Subscriber';
      } else if (item.isUser) {
        source = 'Registered User';
      } else {
        source = 'Community Subscriber';
      }
      return {
        email: item.email,
        source
      };
    });

    res.json(recipients);
  } catch (error) {
    console.error('Error fetching broadcast recipients:', error);
    res.status(500).json({ message: 'Error fetching recipients', error: error.message });
  }
};

// @desc    Send broadcast email to selected recipients
// @route   POST /api/broadcast/send
// @access  Private/Admin
const sendBroadcast = async (req, res) => {
  const { subject, message, selectedEmails } = req.body;

  // 1. Validation
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    return res.status(400).json({ message: 'Subject is required and must be a valid string.' });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Message content is required and must be a valid string.' });
  }

  if (!selectedEmails || !Array.isArray(selectedEmails) || selectedEmails.length === 0) {
    return res.status(400).json({ message: 'selectedEmails must be a non-empty array of email addresses.' });
  }

  const validEmails = [];
  const invalidEmails = [];

  for (const rawEmail of selectedEmails) {
    if (typeof rawEmail === 'string') {
      const email = rawEmail.trim();
      if (emailRegex.test(email)) {
        validEmails.push(email);
      } else {
        invalidEmails.push(rawEmail);
      }
    } else {
      invalidEmails.push(String(rawEmail));
    }
  }

  if (validEmails.length === 0) {
    return res.status(400).json({ 
      message: 'No valid recipient email addresses found in the selection.',
      invalidEmails 
    });
  }

  const emailUser = process.env.EMAIL_USER || "shichan132@gmail.com";
  const emailPass = process.env.EMAIL_PASS || "bsjq fvhn htev mktu";

  if (!emailUser || !emailPass) {
    return res.status(500).json({ message: 'Email service credentials are not configured.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const sendPromises = validEmails.map(async (email) => {
      try {
        await transporter.sendMail({
          from: `"MongoMeals" <${emailUser}>`,
          to: email,
          subject: subject.trim(),
          text: message,
          html: message.replace(/\n/g, '<br>')
        });
        return { email, success: true };
      } catch (err) {
        console.error(`Broadcast email error to ${email}:`, err);
        return { email, success: false, error: err.message };
      }
    });

    const results = await Promise.all(sendPromises);

    let successCount = 0;
    let failedCount = 0;
    const failures = [];

    // Increment failedCount for skipped invalid emails
    for (const email of invalidEmails) {
      failedCount++;
      failures.push({ email, error: 'Invalid email format' });
    }

    for (const r of results) {
      if (r.success) {
        successCount++;
      } else {
        failedCount++;
        failures.push({ email: r.email, error: r.error });
      }
    }

    res.status(200).json({
      message: 'Broadcast process completed.',
      successCount,
      failedCount,
      failures
    });

  } catch (error) {
    console.error('Nodemailer initialization or runtime error during broadcast:', error);
    res.status(500).json({ message: 'Server error during email broadcast.', error: error.message });
  }
};

module.exports = { getRecipients, sendBroadcast };
