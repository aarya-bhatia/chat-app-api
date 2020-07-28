const express = require('express')
const path = require('path')

const model = require(path.join(__basedir, '/schemas/index')).model
const userModel = model.user
const networkModel = model.friend

const userUtil = require(path.join(__basedir, '/util/userUtil'))
const validate = require(path.join(__basedir, '/util/validate'))

const router = express.Router()

// Middleware
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use('/users', validate.user)

/*
Summary

GET
1. get all users '/'
2. get specific user '/:user_id'
3. get user's friends '/:user_id/friends'

PATCH
1. update username '/:user_id/username'
2. update password '/:user_id/password'

DELETE
1. delete user '/:user_id'

*/

//GET: get all users
router.get('/', async(req, res, next) => {
    try {
        await userModel.find({}, (err, found) => {
            if (err) {
                next(err)
            } else {
                res.status(200).json(found)
            }
        })
    } catch (err) {
        next(err)
    }
})

//GET: get a user
router.get('/:user_id', (req, res, next) => {
    const user = res.locals.user
    res.status(200).json(user)
})


//GET: get user friends and requests
router.get('/:user_id/friends', async(req, res, next) => {
    const user_id = req.params.user_id
    await networkModel.findOne({ user_id: user_id }, (err, found) => {
        if (err) next(err)
        res.status(200).json(found)
    })
})

//PATCH: update username
//TODO: update user info in rooms
router.patch('/:user_id/username', validate.validateUsername, async(req, res, next) => {
    const user = res.locals.user
        // update username
    user.username = res.locals.username
        // save changes
    await user.save(err => {
        if (err) next(err)
        else res.status(200).send('username was updated successfully')
    })
})

//PATCH: update password
//TODO: update user info in rooms
router.patch('/:user_id/password', async(req, res, next) => {
    const user = res.locals.user
        // update password
    user.password = password
        // save changes
    await user.save(err => {
        if (err) next(err)
        res.status(200).send('password updated successfully')
    })
})

//DELETE: user & delete friend 
//TODO: delete user from rooms
router.delete('/:user_id', userUtil.deleteUserFriends, async(req, res, next) => {
    try {
        const user_id = req.params.user_id

        await userModel.findByIdAndDelete(user_id, (err, found) => {
            if (err) {
                next(err)
            } else {
                if (found) {
                    res.status(200).send('user deleted successfully')
                } else {
                    res.status(404).send('user not found or already deleted')
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