const express = require('express')

const userModel = require(__basedir + '/models/models').User
const authUtil = require(__basedir + '/util/auth')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//Login a user with his credentials
router.post('/login', async(req, res, next) => {
    try {
        const username = req.body.username // validated username 
        const password = req.body.password // a md5 encrypted password

        const user = await userModel.findOne({ username: username })

        // user does not exist
        if (!user) {
            res.status(404).send('This username does not exist. Try signing up instead.')
        }
        // user exists
        else {
            // send the user back if passwords match
            if (user.password == password) {
                res.status(200).json(user)
            }
            // passwords do not match 
            else {
                res.status(404).send('Invalid password. Please try again.')
            }
        }
    } catch (err) {
        next(err)
    }
})

//Sign up new user 
router.post('/signup', async(req, res, next) => {
    const username = authUtil.usernameValidation(req.body.username)
    const password = req.body.password

    try {
        if (authUtil.usernameAvailable(username)) {
            // create user
            const newUser = new userModel({
                username: username,
                password: password
            })

            await newUser.save()
            console.log(`new user created successfully: ${newUser}`);
            res.status(201).send('user created successfully')

        } else {
            res.status(400).send('this username is taken')
        }
    } catch (e) { next(e) }
})

module.exports = router