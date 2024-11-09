const UserModel = require("../models/UserModel")

async function checkUser(request, response) {

  try {
    const { email } = request.body

    const checkEmail = await UserModel.findOne({ email })

    if (!checkEmail) {
      return response.status(200).json({
        message: "Email available",
        data: email,
        error: false,
        success: true
      })
    }

    return response.status(400).json({
      message: "Email Already Registered",
      success: false,
      error: true
    })

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

module.exports = checkUser