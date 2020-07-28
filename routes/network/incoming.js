/*

GET /network/:user_id/incoming - get incoming friend requests recieved by user
POST /network/:user_id/request/incoming/:friend_id - accept an incoming friend request
PUT /network/:user_id/request/incoming/:friend_id - reject an incoming friend request

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