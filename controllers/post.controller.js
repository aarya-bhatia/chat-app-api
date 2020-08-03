const db = require("../models")
const userModel = db.users;
const postModel = db.posts;

// get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find({})
        res.status(200).send(posts)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

// Get posts for specific user 
exports.getPosts = async (req, res) => {
    const username = req.body.username
    if (!username) {
        res.status(400).send({ message: 'username cannot be empty' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        const friends = user.friends

        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }

        const posts = await postModel.find({ author: { $in: [username, ...friends] } })
            .sort({ createdAt: -1 })
            .limit(50)

        res.status(200).send(posts)
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ message: err.message })
    }
}

exports.getLikedPosts = async (req, res) => {
    const username = req.body.username
    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })

        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }

        const posts = await postModel.find({
            '_id': {
                $in: user.likedPosts
            }
        })

        res.status(200).send(posts)
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.getSavedPosts = async (req, res) => {
    const username = req.body.username
    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })

        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }

        const posts = await postModel.find({
            '_id': {
                $in: user.savedPosts
            }
        })

        res.status(200).send(posts)
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}

// create post
exports.makeNewPost = async (req, res) => {
    const username = req.body.username
    const title = req.body.title
    const content = req.body.content

    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    if (!content || !title) {
        return res.status(400).send({ message: 'title and content cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })

        if (!user) {
            return res.status(400).send({ message: 'user not found' })
        }

        const post = new postModel({
            author: username,
            title: title,
            content: content,
            likes: 0,
            saves: 0
        })

        await post.save()
        res.status(200).send(post)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

// delete post 
exports.deletePost = async (req, res) => {
    const post_id = req.body.post_id
    const username = req.body.username

    if (!post_id) {
        return res.status(400).send({ message: 'post _id cannot be empty!' })
    }

    if(!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    try {
        const post = await postModel.findById(post_id)

        if(!post) {
            return res.status(404).send({ message: 'this post does not exist'})
        }

        if(post.author != username) {
            return res.status(400).send({ message: 'post can only be deleted by its creator'})
        }

        //await postModel.findByIdAndDelete(post_id)
        await post.remove()

        res.status(200).send({ message: 'success' })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

// like or unlike...
exports.likePost = async (req, res) => {
    const username = req.body.username
    const post_id = req.body.post_id

    if (!username || !post_id) {
        return res.status(400).send({ message: 'username, friendname and post _id cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        const post = await postModel.findById(post_id)

        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }

        if (!post) {
            return res.status(404).send({ message: 'post not found' })
        }

        // like post
        if (!user.likedPosts.includes(post_id)) {
            post.likes = post.likes + 1
            user.likedPosts.push(post_id)
        }
        // unlike post
        else {
            let likes = parseInt(post.likes)
            if (likes > 0) {
                likes = likes - 1
                post.likes = likes
            }
            user.likedPosts = user.likedPosts.filter(id => {
                return id != post_id
            })
        }

        await post.save()
        await user.save()
        res.status(200).send({ message: 'success' })
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

// save or unsave...
exports.savePost = async (req, res) => {
    const username = req.body.username
    const post_id = req.body.post_id

    if (!username || !post_id) {
        return res.status(400).send({ message: 'username and post _id cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        const post = await postModel.findById(post_id)

        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }

        if (!post) {
            return res.status(404).send({ message: 'post not found' })
        }

        // like post
        if (!user.savedPosts.includes(post_id)) {
            post.saves = post.saves + 1
            user.savedPosts.push(post_id)
        }
        // unlike post
        else {
            let saves = parseInt(post.saves)
            if (saves > 0) {
                saves = saves - 1
                post.saves = saves
            }
            user.savedPosts = user.savedPosts.filter(id => {
                return id != post_id
            })
        }

        await post.save()
        await user.save()
        res.status(200).send({ message: 'success' })
    } catch (err) {
        res.status(500).send(err)
    }
}