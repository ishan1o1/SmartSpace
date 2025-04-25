const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(to, token) {
  const verifyURL = `http://localhost:3000/auth/verify-email/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify Your Email",
    html: `<h2>Email Verification</h2>
           <p>Please click the link below to verify your email:</p>
           <a href="${verifyURL}">Verify Email</a>`,
  });

  console.log(`Verification email sent to ${to}`);
}

module.exports = { sendVerificationEmail };
