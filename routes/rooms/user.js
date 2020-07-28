/*
SUBROUTE '/user/'
'/:user_id'
1. get: get rooms containing user

'/:user_id/room/:room_id'
1. post: add user to room
2. delete: delete user from room

*/
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const MODELS = require('../../models/index').model
const userModel = MODELS.user

const validateUser = async(req, res, next) => {
    if (mongoose.Schema.Types.ObjectId)
        await userModel.findById(req.params.user_id, (err, user) => {
            if (err) next(err)
            if (user)
        })
}
const validateRoom = async(req, res, next) => {

}

// Get all rooms containing a user
router.get('/:user_id', async(req, res) => {
    await roomModel.find({ "members._id": req.params.user_id }, (err, found) => {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else {
            if (found) {
                console.log(found)
                res.status(200).json(found)
            } else {
                res.status(404).json('No such user')
            }
        }
    })
})

// Add user to existing room
router.post('/:user_id/room/:room_id', async(req, res) => {
    const room_id = req.params.room_id
    const user_id = req.params.user_id

    roomModel.findById(room_id, (err, found) => {
        if (err) {
            res.status(500).json(err)
        } else {
            if (found) {
                userModel.findById(user_id, (e, f) => {
                    if (e) {
                        res.status(500).json(e)
                    } else {
                        if (f) {
                            found.members.push(f)
                            found.save(error => {
                                if (error) {
                                    console.log(error)
                                    res.status(500).send()
                                } else {
                                    console.log('success')
                                    res.status(200).send('user was added to room')
                                }
                            })
                        } else {
                            res.send(404).send('No such user')
                        }
                    }
                })
            } else {
                res.status(404).send('No such room')
            }
        }
    })
})

// Remove a user from existing room
router.delete('/:user_id/room/:room_id', async(req, res) => {
    const room_id = req.params.room_id
    const user_id = req.params.user_id

    roomModel.findById(room_id, (err, found) => {
        if (err) {
            res.status(500).json(err)
        } else {
            if (found) {
                found.members.id(user_id).remove()
                found.save(e => {
                    if (e) {
                        console.log('error while saving room');
                        res.status(500).json(e)
                    } else {
                        console.log('user remove success');
                        res.status(200).send('user was removed')
                    }
                })
            } else {
                res.status(404).send('no room found')
            }
        }
    })
})

module.exports = router