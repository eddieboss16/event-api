const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, attachment = null) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  };

  if (attachment) {
    mailOptions.attachments = [{
      filename: 'ticket.pdf',
      path: attachment,
    }];
  }

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };