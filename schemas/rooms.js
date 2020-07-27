const mongoose = require('mongoose')
const userSchema = require('../schemas/users').schema
const messageSchema = require('../schemas/messages').schema

const roomSchema = new mongoose.Schema({
    members: {
        type: [userSchema]
    },
    name: {
        type: String
    },
    messages: {
        type: [messageSchema]
    }
})

const Room = mongoose.model('Room', roomSchema)

module.exports = {
    model: Room,
    schema: roomSchema
}