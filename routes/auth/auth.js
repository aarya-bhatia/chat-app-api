/* LOGIN AND SIGNUP ROUTES */

const express = require('express')
const model = require('../models/index').model
const userModel = model.user
const friendModel = model.friend

const userUtil = require('../util/user')
const validate = require('../util/validate')

const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//POST: Login a user with his credentials
router.post('/login', async(req, res, next) => {
    try {
        const username = req.body.username // validated username 
        const password = req.body.password // a md5 encrypted password

        await userModel.findOne({ username: username }, (err, found) => {
            if (err) next(err)
            if (found) {
                if (found.password == password) {
                    res.status(200).json(found) // send the user back
                } else {
                    // incorrect password
                    res.status(404).send('Invalid password. Please try again.')
                }
            } else {
                // incorrect username
                res.status(404).send('This username does not exist. Try signing up instead.')
            }
        })
    } catch (err) {
        next(err)
    }
})

//POST: create new user 
router.post('/signup', [validate.validateUsername, userUtil.usernameAvailable],
    async(req, res, next) => {
        const username = res.locals.username // validated and available username 
        const password = req.body.password // expecting md5 encrypted password

        // create user
        const newUser = new userModel({
            username: username,
            password: password
        })

        const newUserId = newUser._id

        // save new user to database
        await newUser.save(err => {
            if (err) next(err)

            // init new fmodel
            const newFModel = new friendModel({
                user_id: newUserId,
                friends: [],
                requests: []
            })

            console.log("NEW USER CREATED->")
            console.log(newUser)

            newFModel.save(err => {
                if (err) next(err)

                console.log('fModel created for new user');
                res.status(201).send('user created successfully')
            })
        })
    })

module.exports = router