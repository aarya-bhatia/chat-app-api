module.exports = (app) => {
    const user = require("../controllers/user.controller.js")
    const router = require('express').Router()

    // GET
    // get all users
    router.get("/", user.getUsers)

    // get friends
    //router.get("/friends")

    // get friend requests
    router.get("/friend-requests")

    // get rooms
    //router.get("/rooms", user.getRooms)
  
    // POST
    // sign up new user
    router.post("/signup", user.createUser)

    // login existing user
    router.post("/login", user.loginUser) 

    // send friend request 
    router.post("/send", user.sendFriendRequest)

    // accept friend request
    router.post("/accept", user.acceptFriendRequest)

    // reject friend request
    router.post("/reject", user.rejectFriendRequest)

    // unfriend a user
    router.post("/unfriend", user.unfriendUser)

    // leave room
    router.post("/leave-room", user.leaveRoom)

    // PUT
    // update user avatar url
    router.put("/avatar", user.setAvatar)

    // register current router on application
    app.use('/api/users', router)
}

