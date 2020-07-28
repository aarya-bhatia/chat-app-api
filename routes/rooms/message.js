/*

SUBROUTE: '/message/'

'/:room_id'
1. get: get all messages in room
2. post: add message to room

*/
const express = require('express')
const router = express.Router()

const MODELS = require(__basedir + '/models/models')
const messageModel = MODELS.Message

// GET: get all messages in a room
router.get('/:room_id/messages', async(req, res) => {
    await roomModel.findById(req.params.room_id, (err, found) => {
        if (err) {
            console.log('error while fetching messages', err)
            res.status(500).json(err)
        } else {
            console.log('fetched messages successfully')
            res.status(200).json(found.messages)
        }
    })
})


// POST: add new message to a room
router.post('/:room_id/message', async(req, res) => {
    await roomModel.findById(req.params.room_id, (err, found) => {
        if (err) {
            console.log('error while fetching room', err)
            res.status(500).json(err)
        } else {
            const newMessage = new messageModel({
                content: req.body.content,
                sender: req.body.sender
            })
            found.messages.push(newMessage)
            found.save(err => {
                if (err) {
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

module.exports = router