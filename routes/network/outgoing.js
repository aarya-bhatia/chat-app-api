/*

GET /network/:user_id/outgoing - get outgoing friend requests sent by user
POST /network/:user_id/outgoing/:friend_id/ - send an outgoing friend request
PUT /network/:user_id/outgoing/:friend_id/ - unsend an outgoing friend request

*/

const express = require('express')
const router = express.Router()

const networkModel = require(__basedir + '/models/models').network
const network = require(__basedir + '/util/network')

router
// get outgoing friend requests sent by user
    .get('/', async(req, res, next) => {
        try {
            const userNetwork = await networkModel.findOne({ user_id: req.params.user_id })
            res.status(200).json(userNetwork.outgoingRequests)
        } catch (err) { next(err) }
    })
    // send a friend request 
    .post('/:friend_id', async(req, res, next) => {
        try {
            await network.sendFriendRequest(req.params.user_id, req.params.friend_id)
            res.status(200).send()
        } catch (err) { next(err) }
    })
    .put('/:friend_id', async(req, res, next) => {
        try {
            await network.unsendFriendRequest(req.params.user_id, req.params.friend_id)
            res.status(200).send()
        } catch (err) { next(err) }
    })

module.exports = router