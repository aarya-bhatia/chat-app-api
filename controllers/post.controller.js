const db = require("../models")
const userModel = db.users;
const postModel = db.posts;

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find({})
        res.status(200).send(posts)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

exports.getPosts = async (req, res) => {
    const username = req.body.username
    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }

        // only user's posts
        const myPosts = await postModel.find({
            '_id': { $in: user.posts }
        })

        /* his/her friend's posts */
        console.log(`these are ${username}'s friends: ${user.friends}`)
        const fposts = await userModel.find({
            username: {
                $in: user.friends
            }
        },{posts: 1}).sort({ 'posts.createdAt': 1 }).limit(50)


        /* These are all the posts to search for including user and his/her friends */
        console.log(fposts)
        console.log(myPosts)
        let posts = []
        fposts.forEach(e => {
            posts.push(e.posts)
        })
        myPosts.forEach(e => {
            posts.push(e.posts)
        })

        /* retrieving the posts */
        console.log(`these are the posts we ought to retrieve for user: ${posts}`)
        const data = await postModel.find({ '_id': { $in: posts }})
        console.log(`these are the actual posts: ${data}`)
        res.status(200).send(data)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
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

exports.makeNewPost = async (req, res) => {
    const username = req.body.username
    const title = req.body.title
    const content = req.body.content

    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    // title is optional

    if (!content) {
        return res.status(400).send({ message: 'content cannot be empty!' })
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

        if (user.posts) {
            user.posts.push(post._id)
        } else {
            user.posts = [post._id]
        }
        await user.save()

        res.status(200).send(post)

    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

exports.deletePost = async (req, res) => {
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
            return res.status(404).send({ message: 'post not found or already deleted' })
        }

        if (post.author != username) {
            return res.status(400).send({ message: 'the post can only be deleted by it\'s author' })
        }

        const sc = user.posts.length

        // remove post for user
        user.posts = user.posts.filter(p => {
            return p._id != post_id
        })

        await user.save()

        // remove post from db
        await post.remove()

        res.status(200).send({ message: `${sc - user.posts.length} item deleted.` })

    } catch (err) {
        res.status(500).send(err)
    }
}

/*
exports.likePost = async (req, res) => {
    const username = req.body.username
    const friendname = req.body.friendname
    const post_id = req.body.post_id

    if (!username || !friendname || !post_id) {
        return res.status(400).send({ message: 'username, friendname and post _id cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        const friend = await userModel.findOne({ username: friendname })

        if (!user || !friend) {
            return res.status(404).send({ message: 'user not found' })
        }

        if (user.likedPosts.includes(post_id)) {
            return res.status(400).send({ message: 'you cannot like a post twice' })
        }

        for (var i = 0; i < friend.posts.length; i++) {
            if (friend.posts[i]._id == post_id) {
                const current = parseInt(friend.posts[i].likes)
                friend.posts[i].likes = current + 1
                break;
            }
        }
        await friend.save()

        user.likedPosts.push(post_id)
        await user.save()

        res.status(200).send({ message: 'success' })
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

exports.savePost = async (req, res) => {
    const username = req.body.username
    const friendname = req.body.friendname
    const post_id = req.body.post_id

    if (!username || !friendname || !post_id) {
        return res.status(400).send({ message: 'username, friendname and post _id cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        const friend = await userModel.findOne({ username: friendname })

        if (!user || !friend) {
            return res.status(404).send({ message: 'user not found' })
        }

        if (user.savedPosts.includes(post_id)) {
            return res.status(400).send({ message: 'you cannot save a post twice' })
        }

        for (var i = 0; i < friend.posts.length; i++) {
            if (friend.posts[i]._id == post_id) {
                const current = parseInt(friend.posts[i].saves)
                friend.posts[i].saves = current + 1
                break;
            }
        }
        await friend.save()

        user.savedPosts.push(post_id)
        await user.save()

        res.status(200).send({ message: 'success' })
    } catch (err) {
        res.status(500).send(err)
    }
}
*/

exports.unlikePost = async (req, res) => {
    const username = req.body.username
    const post_id = req.body.post_id

    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    if (!post_id) {
        return res.status(400).send({ message: 'post _id cannot be empty' })
    }

    try {
        const user = await userModel.findOne({ username: username })

        if (!user) {
            return res.status(404).send({ message: 'success' })
        }

        user.likedPosts = user.likedPosts.filter(id => {
            return id != post_id
        })

        await user.save()

        res.status(200).send({ message: 'success' })
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.unsavePost = async (req, res) => {
    const username = req.body.username
    const post_id = req.body.post_id

    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    if (!post_id) {
        return res.status(400).send({ message: 'post _id cannot be empty' })
    }

    try {
        const user = await userModel.findOne({ username: username })

        if (!user) {
            return res.status(404).send({ message: 'success' })
        }

        user.savedPosts = user.savedPosts.filter(id => {
            return id != post_id
        })

        await user.save()

        res.status(200).send({ message: 'success' })
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}