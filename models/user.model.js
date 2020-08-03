module.exports = (mongoose) => {
    const User = mongoose.model('User',
        mongoose.Schema({
            username: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            avatar: String,
            friends: [String], /* reference to other users */
            outgoingRequests: [String],
            incomingRequests: [String],
            likedPosts: [mongoose.Schema.Types.ObjectId],
            savedPosts: [mongoose.Schema.Types.ObjectId],
            rooms: [mongoose.Schema.Types.ObjectId],
        }, 
        {
            timestamps: true
        }))

    return User
}