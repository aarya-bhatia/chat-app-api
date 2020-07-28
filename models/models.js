/* SCHEMAS */

const networkSchema = new Schema({
    user_id: ObjectId,
    friends: [ObjectId],
    outgoingRequests: [ObjectId],
    incomingRequests: [ObjectId]
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

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

/* MODELS */

module.exports.User = mongoose.model('User', userSchema)
module.exports.Network = mongoose.model('Network', networkSchema)
module.exports.Room = mongoose.model('Room', roomSchema)
module.exports.Message = mongoose.model('Message', messageSchema)