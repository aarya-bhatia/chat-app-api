const mongoose = require('mongoose')
const _ = require('lodash')

const MODELS = require(__basedir + '/models/models')

const userModel = MODELS.User
const roomModel = MODELS.Room


module.exports.validateUsername = async(req, res, next) => {
    const username = req.body.username
        // remove special characters then convert to kebab case
    const validated = _.kebabCase(_.replace(username, /[&\/\\#, +()$~%.'":*?<>{}]/g, ''))
        // check if username exists
    await userModel.findOne({ username: validated }, (err, found) => {
        if (err) {
            next(err)
        }
        if (found) {
            res.status(400).end('this username is taken by another user')
        } else {
            res.locals.username = validated // save local variable 
            next()
        }
    })
}

const checkID = (id) => {
    return mongoose.Types.ObjectId.isValid(user_id)
}

module.exports.user = async(req, res, next) => {
    const id = req.params.user_id

    if (checkID(user_id)) {
        await userModel.findById(id, (err, found) => {
            if (err) next(err)
            if (found) {
                // user exists
                res.locals.user = found
                next()
            } else {
                res.status(404).end('user not found')
            }
        })
    } else {
        res.status(400).end('invalid id for user')
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