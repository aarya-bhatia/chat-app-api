module.exports = (app) => {
    const post = require("../controllers/post.controller.js")
  
    const router = require('express').Router()

    // get all posts
    router.get("/", post.getAllPosts)

    // get posts for a user
    router.get("/user", post.getPosts)

    // get liked posts
    router.get("/liked-posts", post.getLikedPosts)

    // get saved posts
    router.get("/saved-posts", post.getSavedPosts)

    // make new post
    router.post("/new-post", post.makeNewPost)

    // like friend's post
    //router.post("/like-post", post.likePost)

    // save friend's post
    //router.post("/save-post", post.savePost)

    // unlike a post
    router.post("/unlike-post", post.unlikePost)

    // unsave a post
    router.post("/unsave-post", post.unsavePost)

    // delete post
    router.delete("/delete-post", post.deletePost)

    // register current router on application
    app.use('/api/posts', router)
}

