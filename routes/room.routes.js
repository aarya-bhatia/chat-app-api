module.exports = (app) => {
    const room = require("../controllers/room.controller.js")

    const router = require('express').Router()

    // get all rooms
    router.get('/', room.getAllRooms)

    // get room
    router.get('/:room_id', room.getRoom)

    // create new room
    router.post('/', room.createRoom)

    // add member
    router.post('/member', room.addMember)

    // send message
    router.post('/message', room.sendMessage)

    // update room name
    router.put('/:room_id', room.updateName)

    // delete room
    router.delete('/:room_id', room.deleteRoom)

    // register current router on application
    app.use('/api/rooms', router)
}