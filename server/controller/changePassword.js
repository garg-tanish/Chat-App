const bcryptjs = require('bcryptjs')
const OtpModel = require('../models/OtpModel')
const UserModel = require('../models/UserModel')

async function changePassword(request, response) {

  try {
    const { email, password, otp } = request.body

    const checkOtp = await OtpModel.findOne({ email, otp, is_used: "false" })

    if (!checkOtp) {
      return response.status(400).json({
        message: "Invalid Otp",
        error: true,
        success: false
      })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashpassword = await bcryptjs.hash(password, salt)

    await OtpModel.updateOne({ email, otp }, { is_used: "true" })
    await UserModel.updateOne({ email: email }, { password: hashpassword })

    return response.status(201).json({
      message: "Password Changed",
      success: true,
      error: false
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }

}

module.exports = changePassword