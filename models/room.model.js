module.exports = (mongoose) => {
    const Room = mongoose.model('Room',
        mongoose.Schema({
            members: [String],
            name: String,
            messages: [{
                content: String,
                sender: String,
                timestamp: String
            }],
            createdBy: String
        }, { timestamps: true }))

    return Room
}
