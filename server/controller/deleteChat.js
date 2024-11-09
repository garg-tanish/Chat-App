const { ConversationModel } = require('../models/ConversationModel')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')

async function deleteChat(request, response) {

  try {
    const token = request.cookies.token || ""
    const user = await getUserDetailsFromToken(token)

    const { receiver } = request.body

    const conversation = await ConversationModel.findOne({
      sender: user._id,
      receiver: receiver._id
    });

    if (!conversation) {
      return response.status(404).json({
        message: 'Conversation not found',
        error: true,
        success: false
      });
    }

    await conversation.deleteOne();

    return response.status(201).json({
      message: "Chat deleted successfully",
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

module.exports = deleteChat