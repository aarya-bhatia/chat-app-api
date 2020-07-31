module.exports = (mongoose) => {
    const Post = mongoose.model('Post',
        mongoose.Schema({
            author: String,
            title: String,
            content: String,
            likes: Number,
            saves: Number
        },
            {
                timestamps: true
            }))

    return Post
}