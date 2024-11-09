const ConversationModel = require('../models/ConversationModel')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')

async function blockUser(request, response) {

  try {
    const token = request.cookies.token || ""
    const user = await getUserDetailsFromToken(token)

    const { receiver } = request.body

    const conversation = await ConversationModel.findOne({
      sender: user._id,
      receiver: receiver._id
    });

    const blockUser = !conversation.blockUser

    await ConversationModel.updateOne({ _id: conversation._id }, { blockUser })

    const userInfomation = await ConversationModel.findById(conversation._id)

    return response.json({
      message: "User blocked successfully",
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

module.exports = blockUser