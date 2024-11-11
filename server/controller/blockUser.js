const BlockUserModel = require('../models/BlockUserModel')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')

const blockUser = (type) => async (request, response) => {

  try {
    const token = request.cookies.token || ""
    const user = await getUserDetailsFromToken(token)

    const { id } = request.params

    if (type === 'block') {
      const u = new BlockUserModel({
        block_by: user._id?.toString(),
        block_to: id
      })
      await u.save()
    } else {
      await BlockUserModel.deleteMany({
        block_by: user._id?.toString(),
        block_to: id
      })
    }

    return response.json({
      message: `User ${type} successfull`,
      data: null,
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

module.exports = blockUser