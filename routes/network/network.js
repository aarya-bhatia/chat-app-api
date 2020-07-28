/* 
SUMMARY

Main Routes

GET /network/:user_id/ - get user's network
POST /network/:user_id/ - create user's network
PUT /network/:user_id/:friend_id/ - unfriend both users
DELETE /network/:user_id/ = delete user's network

Sub Routes

GET /network/:user_id/outgoing - get outgoing friend requests sent by user
POST /network/:user_id/outgoing/:friend_id/ - send an outgoing friend request
PUT /network/:user_id/outgoing/:friend_id/ - unsend an outgoing friend request

GET /network/:user_id/incoming - get incoming friend requests recieved by user
POST /network/:user_id/request/incoming/:friend_id/incoming - accept an incoming friend request
PUT /network/:user_id/request/incoming/:friend_id/incoming - reject an incoming friend request

*/
const networkModel = require(__basedir + '/models/models').network
const network = require(__basedir + '/util/network')

const express = require('express')
const router = express.Router()

router.use('/:user_id/outgoing', require('./outgoing'))
router.use('/:user_id/incoming', require('./incoming'))

router
// Get user's network
    .get('/:user_id', async(req, res, next) => {
    try {
        const userNetwork = await networkModel.findOne({ user_id: req.params.user_id })
        res.status(200).json(userNetwork)
    } catch (err) { next(err) }
})

// Create user's Network
.post('/:user_id', async(req, res, next) => {
    try {
        const network = new userNetwork({
            user_id: req.params.user_id,
            friends: [],
            incomingRequests: [],
            outgoingRequests: []
        })

        await network.save()
        res.status(200).json(network)
    } catch (err) { next(err) }
})

// Unfriend friend from user's Network
.put('/:user_id/:friend_id', async(req, res, next) => {
    try {
        await network.unfriend(req.params.user_id, req.params.friend_id)
        res.status(200).send()
    } catch (err) { next(err) }
})

// Delete user's Network
.delete('/:user_id', async(req, res, next) => {
    try {
        await networkModel.deleteOne({ user_id: req.params.user_id })
        res.status(200).json(userNetwork)
    } catch (err) { next(err) }
})

module.exports = router