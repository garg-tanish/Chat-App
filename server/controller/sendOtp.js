const crypto = require('crypto');
const nodemailer = require("nodemailer");
const OtpModel = require('../models/OtpModel')

async function sendOtp(request, response) {

  try {
    const { email } = request.body

    const otp = crypto.randomInt(1000, 9999);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // false for other ports like 587
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: `${email}`,
      subject: "Otp for ChatApp",
      text: `Your otp is ${otp}`
    });

    const payload = { email, otp, is_used: "false" }

    const otpCol = new OtpModel(payload)
    await otpCol.save()

    return response.status(201).json({
      message: `Otp Sent to ${email}`,
      error: false,
      success: true
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }

}

module.exports = sendOtp