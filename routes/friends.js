const userModel = require('../schemas/users').model
const friendModel = require('../schemas/friends').model
const express = require('express')
const mongoose = require('mongoose')
const friends = require('../schemas/friends')
const router = express.Router()
router.use(express.json())

/* 
Summary

GET: 
1. get friends for user '/:user_id/friends'

POST
1. create friend model '/:user_id'
2. add friend for user '/:user_id/friend/:friend_id'
3. send friend request '/:user_id/request/:friend_id'

PATCH
1. accept friend request '/:user_id/accept/:friend_id'

DELETE:
1. delete friend request '/:user_id/request/:friend_id'
2. delete friend '/:user_id/unfriend/:friend_id'
3. delete all friends - when deleting user entirely '/:user_id/delete'

*/

async function userExists(id) {
    await userModel.findById(id, (err, found) => {
        return found ? true : false
    })
}

function validateId(id) {
    return mongoose.Types.ObjectId.isValid(id)
}

async function validateRequest(req, res, next) {
    try {
        const user_id = req.params.user_id
        const friend_id = req.params.friend_id

        if (!validateId(user_id) || !validateId(friend_id)) {
            res.status(400).end('user id is invalid')
        } else {
            if (!userExists(user_id) || !userExists(friend_id)) {
                res.status(404).end('cannot find user or friend')
            } else {
                // okay to proceed
                next()
            }
        }
    } catch (err) {
        next(err)
    }
}

//GET: get friends and requests for user
router.get('/:user_id', async (req, res, next) => {
    try {
        const user_id = req.params.user_id

        if (!validateId) {
            res.status(400).send('user id is invalid')
        } else {
            const user = userExists(user_id)
            if (user) {
                await friendModel.findOne({ user_id: user_id }, (err, found) => {
                    if (err) next(err)
                    if (found) {
                        res.status(200).json(found)
                    } else {
                        res.status(404).send('this user does not have a friend model. please create one and proceed')
                    }
                })
            } else {
                res.status(404).send('user not found')
            }
        }
    }
    catch (err) {
        next(err)
    }
})

//POST: create friend model for user
router.post('/:user_id/init', async (req, res, next) => {
    try {
        const user_id = req.params.user_id

        if (!validateId(user_id)) {
            res.status(400).send('user id is invalid')
        } else {
            if (!userExists(user_id)) {
                res.status(404).send('this user does not exist')
            } else {

                await friendModel.findOne({ user_id: user_id }, (err, found) => {
                    if (err) next(err)
                    if (found) {
                        res.status(400).send('this user already has friend model')
                    } else {
                        const newFModel = new friendModel({
                            user_id: user_id,
                            friends: [],
                            requests: []
                        })
                        newFModel.save((err, doc) => {
                            if (err) next(err)
                            res.status(201).json(doc)
                        })
                    }
                })
            }
        }
    } catch (err) {
        next(err)
    }
})

//POST: add friend for user
router.post('/:user_id/friend/:friend_id', validateRequest, async (req, res, next) => {
    try {
        const user_id = req.params.user_id
        const friend_id = req.params.friend_id

        // Find the user
        await friendModel.findOne({ user_id: user_id }, (err, found) => {
            if (err) next(err)
            else {
                if (found) {
                    found.friends.push(friend_id)
                    found.save((error, success) => {
                        if (error) next(error)
                        res.status(200).json(success)
                    })
                } else {
                    res.status(404).send('this user does not have a friend model. please create one and proceed')
                }
            }
        })

    } catch (err) {
        next(err)
    }
})

//POST: send friend request
router.post('/:user_id/request/:friend_id', validateRequest, async (req, res, next) => {
    try {
        const user_id = req.params.user_id
        const friend_id = req.params.friend_id

        // Find the friend
        await friendModel.findOne({ user_id: friend_id }, (err, found) => {
            if (err) next(err)
            else {
                if (found) {
                    found.requests.push(user_id)
                    found.save((error, success) => {
                        if (error) next(error)
                        res.status(200).json(success)
                    })
                } else {
                    res.status(404).send('this user does not have a friend model. please create one and proceed')
                }
            }
        })

    } catch (err) {
        next(err)
    }
})

//PATCH: accept friend request
router.patch('/:user_id/accept/:friend_id', validateRequest, async (req, res, next) => {
    try {
        const user_id = req.params.user_id
        const friend_id = req.params.friend_id

        // Find user
        await friendModel.findOne({ user_id: user_id }, (err, found) => {
            if (err) next(err)
            else {
                if (found) {
                    // Remove friend_id from user's request and add it to user's friends
                    found.requests = found.requests.filter(id => {
                        return id != friend_id
                    })

                    // Avoid adding duplicate friend
                    if (!found.friends.includes(friend_id)) {
                        found.friends.push(friend_id)
                    }

                    // Save document after making all changes
                    found.save((error, success) => {
                        if (error) next(error)
                        res.status(200).json(success)
                    })
                } else {
                    res.status(404).send('this user does not have a friend model. please create one and proceed')
                }
            }
        })
    } catch (err) {
        next(err)
    }
})

//DELETE: delete friend request
router.delete('/:user_id/request/:friend_id', validateRequest, async (req, res, next) => {

})

//DELETE: delete friend
router.delete('/:user_id/unfriend/:friend_id', validateRequest, async (req, res, next) => {

})

//DELETE: delete all friends : when deleting user entirely
router.delete('/:user_id/delete')

// Error Handler
router.use((err, req, res, next) => {
    res.status(500)
    res.send(err.message)
})

module.exports = router