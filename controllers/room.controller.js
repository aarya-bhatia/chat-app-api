const db = require("../models")
const userModel = db.users;
const roomModel = db.rooms;
const moment = require('moment')

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find({})
        res.status(200).send(rooms)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

exports.getRoom = async (req, res) => {
    const room_id = req.params.room_id

    try {
        const room = await roomModel.findById(room_id)

        res.status(200).send(room)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

exports.createRoom = async (req, res) => {
    const username = req.body.username
    const name = req.body.name

    if (!username || !name) {
        return res.status(400).send({ message: 'username and name cannot be empty' })
    }

    try {
        const user = await userModel.findOne({ username: username })

        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }

        const room = new roomModel({
            admin: username,
            name: name,
            members: [username]
        })

        await room.save()
        res.status(200).send(room)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.addMember = async (req, res) => {
    const username = req.body.username
    const room_id = req.body.room_id
    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        const room = await roomModel.findById(room_id)

        if (!room) {
            throw new Error('room not found')
        }

        if (!room.members.includes(username)) {
            room.members.push(username)
            user.rooms.push(room._id)
            console.log(`${username} has been added to group`)
        } else {
            console.log(`${username} was not added to the group...`)
        }

        await user.save()
        await room.save()
        res.status(200).send(room)
    } catch (error) {
        res.status(500).send({ mesasge: error.message })
    }
}


exports.sendMessage = async (req, res) => {
    const username = req.body.username
    const content = req.body.content
    const room_id = req.body.room_id

    if (!username || !content || !room_id) {
        return res.status(400).send({ message: 'username,content and room _id cannot be empty!' })
    }

    try {
        const room = await roomModel.findById(room_id)

        if (!room) {
            return res.status(404).send({ message: 'Room not found!' })
        }

        if (!room.members.includes(username)) {
            return res.status(400).send({ message: 'Only members can send messages to the room!' })
        }

        const message = {
            sender: username,
            content: content,
            timestamp: moment().format("ddd, hA") /** Format: Sun, 3PM  */
        }

        room.messages.push(message)

        await room.save()
        res.status(200).send(room)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.deleteRoom = async (req, res) => {

}

exports.updateName = async (req, res) => {

}