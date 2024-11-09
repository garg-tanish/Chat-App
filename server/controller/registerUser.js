const bcryptjs = require('bcryptjs')
const OtpModel = require('../models/OtpModel')
const UserModel = require("../models/UserModel")

async function registerUser(request, response) {

    try {
        const { name, email, password, profile_pic, bg_color, otp } = request.body

        const checkEmail = await UserModel.findOne({ email })
        const checkOtp = await OtpModel.findOne({ email, otp, is_used: "false" })

        if (checkEmail) {
            return response.status(400).json({
                message: "User already exist",
                error: true,
                success: false
            })
        }

        if (!checkOtp) {
            return response.status(400).json({
                message: "Invalid Otp",
                error: true,
                success: false
            })
        }

        await OtpModel.updateOne({ email, otp }, { is_used: "true" })

        //password into hashpassword
        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            profile_pic,
            password: hashpassword,
            bg_color
        }

        const user = new UserModel(payload)
        await user.save()

        return response.status(201).json({
            message: "SignUp successfully",
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

module.exports = registerUser