const messageModel = require('../schemas/messages')
const express = require('express')
const router = express.Router()
router.use(express.json())

module.exports = router