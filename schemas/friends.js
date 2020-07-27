const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const friendSchema = new Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    friends: {
        type: [ObjectId]
    },
    requests: {
        type: [ObjectId]
    }
})

const Friend = mongoose.model('Friend', friendSchema)

module.exports = {
    model: Friend,
    schema: friendSchema
}
