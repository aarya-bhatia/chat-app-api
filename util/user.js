const path = require('path')
const MODELS = require(path.join(__basedir, '/schemas/index')).model
const friendModel = MODELS.friend
const userModel = MODELS.user
const roomModel = MODELS.room

// delete user and user's friend model 
module.exports.deleteUserFriends = async(req, res, next) => {
    const user_id = req.params.user_id
    await friendModel.findOneAndDelete({ user_id: user_id }, (err, success) => {
        if (err) next(err)
        next()
    })
}

//#TODO
module.exports.deleteUserFromRooms = async(req, res, next) => {
    // Go through all rooms which contain the user and delete user from those rooms
    roomModel.find({ "members._id": req.params.user_id }, (err, rooms) => {
        if (err) next(err)
        else {
            console.log(rooms) // TODO
            next()
        }
    })
}

// check if a user exists by id
module.exports.usernameAvailable = async(req, res, next) => {
    const username = res.locals.username
    await userModel.findOne({ username: username }, (err, user) => {
        if (err) next(err)
        if (user) res.status(400).end('A user with this username already exists')
        else next()
    })
}