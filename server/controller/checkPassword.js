const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const UserModel = require("../models/UserModel")

async function checkPassword(request, response) {

    try {
        const { password, userId } = request.body

        const user = await UserModel.findById(userId)

        const verifyPassword = await bcryptjs.compare(password, user.password)

        if (!verifyPassword) {
            return response.status(400).json({
                message: "Please check your password",
                error: true,
                success: false
            })
        }

        const tokenData = { id: user._id, email: user.email }

        const token = jwt.sign(tokenData, process.env.JWT_SECREAT_KEY, { expiresIn: '1d' })

        const cookieOptions = {
            http: true,
            secure: true
        }

        return response.cookie('token', token, cookieOptions).status(200).json({
            message: "Login successfully",
            token: token,
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

module.exports = checkPassword