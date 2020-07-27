const userModel = require('../schemas/users').model
const mongoose = require('mongoose')
const express = require('express')
const _ = require('lodash')

const ObjectId = mongoose.Types.ObjectId

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

/*
Summary

GET
1. get all users '/'
2. get specific user '/:user_id'

POST
1. create new user '/'

PATCH
1. update username '/:user_id/username'
2. update password '/:user_id/password'

DELETE
1. delete user '/:user_id'

*/

async function validateUsername(req, res, next) {
    try {
        const username = req.body.username
        // remove special characters then convert to kebab case
        const validated = _.kebabCase(_.replace(username, /[&\/\\#, +()$~%.'":*?<>{}]/g, ''))
        // check if username exists
        await userModel.findOne({ username: validated }, (err, found) => {
            if (err) {
                next(err)
            }
            if (found) {
                res.status(400).end('this username is taken by another user')
            } else {
                res.locals.username = validated
                next()
            }
        })
    } catch (err) {
        next(err)
    }
}

//GET: get all users
router.get('/', async (req, res, next) => {
    try {
        await userModel.find({}, (err, found) => {
            if (err) {
                next(err)
            }
            else {
                res.status(200).json(found)
            }
        })
    } catch (err) {
        next(err)
    }
})

//GET: get a user
router.get('/:user_id', async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.user_id)) {
            throw new Error('invalid id')
        }

        await userModel.findById(req.params.user_id, (err, user) => {
            if (err) {
                next(err)
            } else {
                if (user) {
                    console.log('successfully fetched user');
                    res.status(200).json(user)
                } else {
                    console.log('user does not exist')
                    res.status(404).send('user does not exist')
                }
            }
        })
    } catch (err) {
        next(err)
    }
})

//POST: create new user 
router.post('/', validateUsername, async (req, res, next) => {
    try {
        const username = res.locals.username
        const password = req.body.password
        // check if user exists
        await userModel.findOne({ username: username }, (err, found) => {
            if (err) {
                next(err)
            } else {
                if (found) {
                    res.status(400).send('A user with this username already exists')
                } else {
                    // proceed to create user
                    const newUser = new userModel({
                        username: username,
                        password: password
                    })
                    newUser.save(err => {
                        if (err) {
                            next(err)
                        } else {
                            res.status(201).send('user created successfully')
                        }
                    })
                }
            }
        })
    } catch (error) {
        next(error)
    }
})

//PATCH: update username
router.patch('/:user_id/username', validateUsername, async (req, res, next) => {
    try {
        const user_id = req.params.user_id
        const username = req.body.username
        if (!ObjectId.isValid(user_id)) {
            next('user id is invalid')
        }

        await userModel.findById(user_id, (err, user) => {
            if (err) {
                next(err)
            } else {
                if (user) {
                    // found user
                    user.username = res.locals.username
                    user.save(err => {
                        if (err) {
                            next(err)
                        }
                        else {
                            res.status(200).send('username was updated successfully')
                        }
                    })
                } else {
                    res.status(404).send('user not found')
                }
            }
        })
    } catch (err) {
        next(err)
    }
})

//PATCH: update password
router.patch('/:user_id/password', async (req, res, next) => {
    try {
        const user_id = req.params.user_id
        const password = req.body.password
        if (!ObjectId.isValid(user_id)) {
            next('user id is invalid')
        }
        await userModel.findById(user_id, (err, user) => {
            if (err) next(err)
            if (user) {
                user.password = password
                user.save(err => {
                    if (err) next(err)
                    res.status(200).send('password updated successfully')
                })
            } else {
                res.status(404).send('user not found')
            }
        })
    } catch (err) {
        next(err)
    }
})

//DELETE: user
router.delete('/:user_id', async (req, res, next) => {
    try {
        const user_id = req.params.user_id
        if (!ObjectId.isValid(user_id)) {
            console.log(user_id)
            throw new Error('user id is invalid')
        }

        await userModel.findByIdAndDelete(user_id, (err, found) => {
            if (err) {
                next(err)
            } else {
                if (found) {
                    res.status(200).send('user deleted successfully')
                } else {
                    res.status(404).send('user not found')
                }
            }
        })
    } catch (err) {
        next(err)
    }
})

// Error Handler
router.use((err, req, res, next) => {
    res.status(500)
    res.send(err.message)
})

module.exports = router