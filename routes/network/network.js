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

const express = require('express')
const router = express.Router()

router.use('/:user_id/outgoing', require('./outgoing'))
router.use('/:user_id/incoming', require('./incoming'))

router
// Get user's Network
    .get('/:user_id', async(req, res, next) => {

})

// Create user's Network
.post('/:user_id', async(req, res, next) => {

})

// Unfriend friend from user's Network
.put('/:user_id/:friend_id', async(req, res, next) => {

})

// Delete user's Network
.delete('/:user_id', async(req, res, next) => {

})

module.exports = router