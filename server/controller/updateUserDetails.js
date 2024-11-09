const UserModel = require("../models/UserModel")
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function updateUserDetails(request, response) {

    try {
        const token = request.cookies.token || ""
        const user = await getUserDetailsFromToken(token)

        const { name, profile_pic } = request.body

        await UserModel.updateOne({ _id: user._id }, { name, profile_pic })

        const userInfomation = await UserModel.findById(user._id).select('-password')

        return response.status(201).json({
            message: "User Updated",
            data: userInfomation,
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

module.exports = updateUserDetails