/*

GET /network/:user_id/incoming - get incoming friend requests recieved by user
POST /network/:user_id/request/incoming/:friend_id - accept an incoming friend request
PUT /network/:user_id/request/incoming/:friend_id - reject an incoming friend request

*/

const express = require('express')
const router = express.Router()

const networkModel = require(__basedir + '/models/models').Network
const network = require(__basedir + '/util/network')

router
// get incoming friend requests 
    .get('/', async(req, res, next) => {
        try {
            const userNetwork = await networkModel.findOne({ user_id: req.user_id })
            res.status(200).json(userNetwork.incomingRequests)
        } catch (err) { next(err) }
    })
    // accept incoming friend request
    .post('/:friend_id', async(req, res, next) => {
        try {
            await network.acceptFriendRequest(req.user_id, req.params.friend_id)
            res.status(200).send()
        } catch (err) { next(err) }
    })
    // reject incoming friend request
    .put('/:friend_id', async(req, res, next) => {
        try {
            await network.rejectFriendRequest(req.params.friend_id, ReadableStreamReader.user_id)
            res.status(200).send()
        } catch (err) { next(err) }
    })

module.exports = router