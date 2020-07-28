/*

GET /network/:user_id/outgoing - get outgoing friend requests sent by user
POST /network/:user_id/outgoing/:friend_id/ - send an outgoing friend request
PUT /network/:user_id/outgoing/:friend_id/ - unsend an outgoing friend request

*/

const express = require('express')
const router = express.router()

router
    .get('/', async(req, res, next) => {

    })
    .post('/:friend_id', async(req, res, next) => {

    })
    .put('/:friend_id', async(req, res, next) => {

    })

module.exports = router