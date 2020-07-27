const roomModel = require('../schemas/rooms').model
const userModel = require('../schemas/users').model
const messageModel = require('../schemas/messages').model
const express = require('express')
const { json } = require('express')
const router = express.Router()
router.use(express.json())

//TODO: change room schema-only store user id's not user schema 
// so we dont have to update every time user gets updated 

/* 
Summary

GET REQUESTS
1. get all rooms '/'
2. get rooms containing user '/user/:user_id'
3. get all messages in room '/:room_id/messages'

POST REQUESTS
1. create room containing users '/'
2. add new message to room '/:room_id/message'

PATCH REQUESTS
1. add a user to existing room '/:room_id/user/:user_id'
2. update room name '/:room_id/name/:name'

DELETE REQUESTS
1. delete user from room '/:room_id/user/:user_id'
2. delete room '/:room_id'

 */


// GET: get all rooms
router.get('/', async (req, res) => {
    await roomModel.find({}, (err, found) => {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        }
        else {
            if (found) {
                res.status(200).json(found)
            }
        }
    })
})

// GET: get all rooms containing a user
router.get('/user/:user_id', async (req, res) => {
    await roomModel.find({ "members._id" : req.params.user_id }, (err, found) => {
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

// GET: get all messages in a room
router.get('/:room_id/messages', async (req, res) => {
    await roomModel.findById(req.params.room_id, (err, found) => {
        if(err) {
            console.log('error while fetching messages', err)
            res.status(500).json(err)
        } else {
            console.log('fetched messages successfully')
            res.status(200).json(found.messages)
        }
    })
})

// POST: create a room with user
router.post('/', async (req, res) => {
    const name = req.body.name
    const members = req.body.members

    const newRoom = roomModel({
        members: members,
        name: name
    })
    await newRoom.save((err,docs) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(docs)
        }
    })
})

// POST: add new message to a room
router.post('/:room_id/message', async (req, res) => {
    await roomModel.findById(req.params.room_id, (err, found) => {
        if(err) {
            console.log('error while fetching room', err)
            res.status(500).json(err)
        } else {
            const newMessage = new messageModel({
                content: req.body.content,
                sender: req.body.sender
            })
            found.messages.push(newMessage)
            found.save(err => {
                if(err) {
                    console.log('error while saving message to room', err)
                    res.status(500).json(err)
                } else {
                    console.log('saved message successfully')
                    res.status(200).send('saved message successfully')
                }
            })

        }
    })
})

// PATCH: add user to existing room
router.patch('/:room_id/user/:user_id', async (req, res) => {
    const room_id = req.params.room_id
    const user_id = req.params.user_id

    roomModel.findById(room_id, (err, found) => {
        if(err) {
            res.status(500).json(err)
        } else {
            if(found) {
                userModel.findById(user_id, (e, f) => {
                    if(e) {
                        res.status(500).json(e)
                    } else {
                        if(f) {
                            found.members.push(f)
                            found.save(error => {
                                if(error) {
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

// PATCH: update room name
router.patch('/:room_id/name/:name', async (req, res) => {
    const room_id = req.params.room_id
    const name = req.params.name

    roomModel.findByIdAndUpdate(room_id, { name: name }, { new: true }, (error, doc) => {
        if(error) {
            console.log('error while updating room name ',error)
            res.status(500).json(error)
        } else {
            console.log('room name updated')
            res.status(200).json(doc)
        }
    })
})

// DELETE: remove a user from existing room
router.delete('/:room_id/user/:user_id', async (req, res) => {
    const room_id = req.params.room_id
    const user_id = req.params.user_id

    roomModel.findById(room_id, (err, found) => {
        if(err) {
            res.status(500).json(err)
        } else {
            if(found) {
                found.members.id(user_id).remove()
                found.save(e => {
                    if(e) {
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

// DELETE: delete a room
router.delete('/:room_id/delete', async (req, res) => {
    roomModel.deleteOne({ '_id': req.params.room_id }, err => {
        if (err) {
            console.log('error while deleting room', err)
            res.status(500).json(err)
        } else {
            res.status(200).send('deleted document')
        }
    })
})

module.exports = router