const express = require('express')
const path = require('path')

const MODELS = require(path.join(__basedir, '/models/models'))
const userModel = MODELS.User

const validate = require(path.join(__basedir, '/util/validate'))
const authUtil = require(path.join(__basedir, '/util/auth'))

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use('/users', validate.user)

/*
Summary REST Model

GET
1. get all users '/'
2. get one user '/:user_id'

POST
1. update username '/:user_id/username'
2. update password '/:user_id/password'

DELETE
1. delete user '/:user_id'

*/

//get all users
router.get('/', async(req, res, next) => {
    try {
        const users = await userModel.find({})
        res.status(200).json(found)
    } catch (err) {
        next(err)
    }
})

//get a user
router.get('/:user_id', (req, res, next) => {
    const user = res.locals.user
    res.status(200).json(user)
})


//update username
//TODO: update user info in rooms
router.post('/:user_id/username', async(req, res, next) => {
    try {
        const user = res.locals.user
        user.username = authUtil.usernameValidation(res.body.username)
        await user.save()
        res.status(200).send('username was updated successfully')
    } catch (e) { next(e) }
})


//update password
//TODO: update user info in rooms
router.post('/:user_id/password', async(req, res, next) => {
    try {
        const user = res.locals.user
        user.password = password
        await user.save()
        res.status(200).send('password updated successfully')
    } catch (e) { next(e) }
})

//delete user
//TODO: delete user from rooms & delete user network
router.delete('/:user_id', async(req, res, next) => {
    try {
        const user_id = req.params.user_id
        await userModel.findByIdAndDelete(user_id)
        res.status(200).send('user deleted successfully')
    } catch (err) {
        next(err)
    }
})

module.exports = router