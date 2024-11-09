const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    is_used: {
        type: Boolean
    }
}, {
    timestamps: true
})

const OtpModel = mongoose.model('Otp', otpSchema)

module.exports = OtpModel