/* 
Summary

MAIN ROUTES

ROUTE: '/'
1. get: get all rooms 
2. post: make new room (body: name, members)

ROUTE: '/:room_id/'
1. delete: delete room
2. patch: update name (body: name)

 */

const roomModel = require(__basedir + '/models/models').Room
const express = require('express')
const router = express.Router()

// subroutes
router.use('/user', require('./user'))
router.use('/message', require('./message'))

// Get All Rooms
router.get('/', async(req, res) => {
    await roomModel.find({}, (err, found) => {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else {
            if (found) {
                res.status(200).json(found)
            }
        }
    })
})

// Create New Room
router.post('/', async(req, res) => {
    const name = req.body.name
    const members = req.body.members

    const newRoom = roomModel({
        members: members,
        name: name
    })
    await newRoom.save((err, docs) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(docs)
        }
    })
})

// Update Room Name
router.patch('/:room_id', async(req, res) => {
    const room_id = req.params.room_id
    const name = req.body.name

    roomModel.findByIdAndUpdate(room_id, { name: name }, { new: true }, (error, doc) => {
        if (error) {
            console.log('error while updating room name ', error)
            res.status(500).json(error)
        } else {
            console.log('room name updated')
            res.status(200).json(doc)
        }
    })
})

// Delete Room
router.delete('/:room_id', async(req, res) => {
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