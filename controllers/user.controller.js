const db = require("../models")
const slugify = require('slugify')
const userModel = db.users;
const roomModel = db.rooms;

exports.getUsers = async (req, res) => {
    await userModel.find({}, { password: 0 }).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
}

exports.getRooms = async (req, res) => {
    //todo
}

exports.createUser = async (req, res) => {

    // validate username and password

    if (!req.body.username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    if (!req.body.password) {
        return res.status(400).send({ message: 'password cannot be empty!' })
    }

    if (req.body.password.length < 3) {
        return res.status(400).send({ message: 'password must be atleast 3 characters long' })
    }

    // slugify the username to use it for identification

    const slug = slugify(req.body.username, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g
    })

    const user = new userModel({
        username: slug,
        password: req.body.password,
    })

    // check if a username with this slug exists in db

    await userModel.findOne({ username: slug })
        .then(found => {
            if (found) {
                return res.status(400).send({ message: 'this username is taken' })
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })

    // save the user

    await user.save()
        .then(data => {
            res.status(201).send(data)
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.loginUser = async (req, res) => {

    // validate username and password

    if (!req.body.username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    if (!req.body.password) {
        return res.status(400).send({ message: 'password cannot be empty!' })
    }

    // find the user by username

    await userModel.findOne({ username: req.body.username })
        .then(found => {
            if (found) {

                if (found.password == req.body.password) {
                    res.status(200).send(found)
                } else {
                    res.status(400).send({ message: 'passwords do not match' })
                }
            } else {
                res.status(400).send({ message: 'this username does not exist' })
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.setAvatar = async (req, res) => {
    if (!req.body.username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    await userModel.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                user.avatar = req.body.avatar
                user.save(err => {
                    if (err) res.status(500).send(err)
                    res.status(200).send()
                })
            } else {
                res.status(400).send({ message: 'user not found' })
            }
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

exports.sendFriendRequest = async (req, res) => {
    if (!req.body.username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    if (!req.body.friendname) {
        return res.status(400).send({ message: 'friendname cannot be empty!' })
    }

    try {
        const fromUser = await userModel.findOne({ username: req.body.username })
        const toUser = await userModel.findOne({ username: req.body.friendname })

        if (!fromUser || !toUser) {
            res.status(400).send({ message: 'user not found' })
        }

        if (!fromUser.outgoingRequests.includes(toUser.username)) {
            fromUser.outgoingRequests.push(toUser.username)
            await fromUser.save()
        }

        if (!toUser.outgoingRequests.includes(fromUser.username)) {
            toUser.incomingRequests.push(fromUser.username)
            await toUser.save()
        }

        res.status(200).send({ message: 'friend request was sent successfully' })
    }
    catch (err) {
        res.status(500).send(err)
    }
}

exports.getFriendRequests = async (req, res) => {
    if (!req.body.username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        if (user) {
            res.status(200).send(user.incomingRequests)
        } else {
            res.status(400).send({ message: 'user not found' })
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.acceptFriendRequest = async (req, res) => {

    if (!req.body.username) {
        return res.status(400).send({ message: 'username cannot be empty' })
    }

    if (!req.body.friendname) {
        return res.status(400).send({ message: 'friendname cannot be empty' })
    }

    try {
        const username = req.body.username
        const friendname = req.body.friendname

        const user = await userModel.findOne({ username: username })
        const friend = await userModel.findOne({ username: friendname })

        if (!user || !friend) {
            res.status(400).send({ message: 'user not found' })
        }

        const userIn = user.incomingRequests
        const friendOut = friend.outgoingRequests


        if (userIn.includes(friendname) && friendOut.includes(username)) {
            user.incomingRequests = userIn.filter(e => {
                return e != friendname
            })
            user.friends.push(friendname)
            await user.save()

            friend.outgoingRequests = friendOut.filter(e => {
                return e != username
            })
            friend.friends.push(username)
            await friend.save()

            res.status(200).send({ message: 'success' })
        }
        else {
            res.status(400).send({ message: 'this friend request does not exist' })
        }

    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
}

exports.rejectFriendRequest = async (req, res) => {
    if (!req.body.username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    if (!req.body.friendname) {
        return res.status(400).send({ message: 'friendname cannot be empty' })
    }

    try {
        const username = req.body.username
        const friendname = req.body.friendname

        const user = await userModel.findOne({ username: username })
        const friend = await userModel.findOne({ username: friendname })

        if (!user || !friend) {
            return res.status(400).send({ message: 'user not found' })
        }

        const userIn = user.incomingRequests
        const friendOut = friend.outgoingRequests

        if (userIn.includes(friendname) && friendOut.includes(username)) {
            user.incomingRequests = userIn.filter(e => {
                return e != friendname
            })

            await user.save()

            friend.outgoingRequests = friendOut.filter(e => {
                return e != username
            })

            await friend.save()

            res.status(200).send()
        }
        else {
            res.status(400).send({ message: 'friend request does not exist' })
        }

    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

//todo
exports.leaveRoom = async (req, res) => {
    const username = req.body.username
    const room_id = req.body.room_id

    if (!username) {
        return res.status(400).send({ message: 'username cannot be empty!' })
    }

    if (!room_id) {
        return res.status(400).send({ message: 'room _id cannot be empty!' })
    }

    try {
        const user = await userModel.findOne({ username: username })
        const room = await roomModel.findById(room_id)

        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }

        if (!room) {
            return res.status(404).send({ message: 'room not found' })
        }

        user.rooms = user.rooms.filter(e => {
            return e != room_id
        })

        room.members = room.members.filter(e => {
            return e != username
        })

        if (room.members === 0) {
            room.remove()
        }

        res.status(200).send({ message: 'success' })
    } catch (err) {
        res.status(500).send(err)
    }
}

// unfriend user
exports.unfriendUser = async (req, res) => {
    res.status(200).send('todo...')
}