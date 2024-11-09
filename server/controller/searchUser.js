const UserModel = require('../models/UserModel')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')

async function searchUser(request, response) {

    try {
        const token = request.cookies.token || ""
        const user = await getUserDetailsFromToken(token);

        const { search } = request.body
        const query = new RegExp(search, "i", "g")

        const users = await UserModel.find({
            "$or": [
                { name: query },
                { email: query }
            ]
        }).select("-password")

        return response.status(200).json({
            message: 'List of Users',
            data: users.filter(data => data.email !== user.email),
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

module.exports = searchUser