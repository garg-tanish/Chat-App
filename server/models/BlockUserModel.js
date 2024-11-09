const mongoose = require('mongoose')

const blockUserSchema = new mongoose.Schema({

  block_by: {
    type: String
  },
  block_to: {
    type: String
  }
})

const BlockUserSchema = mongoose.model('Block-user', blockUserSchema)

module.exports = BlockUserSchema