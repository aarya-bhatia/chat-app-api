const mongoose = require('mongoose')
const MODELS = require(__basedir + '/models/models')
const userModel = MODELS.User
const roomModel = MODELS.Room

const checkID = id => {
    return mongoose.Types.ObjectId.isValid(user_id)
}

module.exports.user = async(req, res, next) => {
    if (req.path == '/users') { next() } else {
        const id = req.params.user_id

        try {
            if (checkID(id)) {
                const user = await userModel.findById(id)
                if (user) {
                    // user exists
                    res.locals.user = found
                    next()
                } else {
                    res.status(404).end('user not found')
                }
            } else {
                res.status(400).end('invalid id for user')
            }
        } catch (e) { next(e) }
    }
}

module.exports.friend = async(req, res, next) => {
    const id = req.params.friend_id

    if (checkID(user_id)) {
        await userModel.findById(id, (err, found) => {
            if (err) next(err)
            if (found) {
                // friend exists
                res.locals.friend = found
                next()
            } else {
                res.status(404).end('friend not found')
            }
        })
    } else {
        res.status(400).end('invalid id for friend')
    }
}

module.exports.room = async(req, res, next) => {
    const id = req.params.rooom_id

    if (checkID(user_id)) {
        await roomModel.findById(id, (err, found) => {
            if (err) next(err)
            if (found) {
                // room exists
                res.locals.room = found
                next()
            } else {
                res.status(404).end('room not found')
            }
        })
    } else {
        res.status(400).end('invalid id for room')
    }
}