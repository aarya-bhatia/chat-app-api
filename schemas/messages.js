const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
}) 

const Message = mongoose.model('Message', messageSchema)

module.exports = {
    model: Message,
    schema: messageSchema
}
