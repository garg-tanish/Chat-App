const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function userDetails(request, response) {

    try {
        const token = request.cookies.token || ""
        const user = await getUserDetailsFromToken(token)

        return response.status(200).json({
            message: "User details",
            data: user,
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

module.exports = userDetails