const UserModel = require("../models/UserModel")

async function checkEmail(request, response) {

    try {
        const { email } = request.body

        const checkEmail = await UserModel.findOne({ email }).select("-password")

        if (!checkEmail) {
            return response.status(400).json({
                message: "User not exist",
                error: true,
                success: false
            })
        }

        return response.status(201).json({
            message: "Email Verified",
            data: checkEmail,
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

module.exports = checkEmail