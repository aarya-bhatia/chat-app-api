const userModel = require(__basedir + '/models/user.js')
const roomModel = require(__basedir + '/models/room.js')

/**
 *  METHODS
 * getRoomsForUser(username)
 * createRoom(username, name)
 * addMember(username)
 * addMembers(usernames, room_id)
 * sendMessage(username, content, room_id)
 */

module.exports.Room = {
    async getRoomsForUser(username) {
        try {
            const user = await userModel.findOne({ username: username })
            if (!user) {
                throw new Error('user not found')
            }
            const roomRefs = user.rooms
            const rooms = await roomModel.find({ '_id': { $in: roomRefs } })
            return rooms
        } catch (err) {
            console.log(err)
            return []
        }
    },

    async createRoom(username, name) {
        try {
            const user = await userModel.findOne({ username: username })

            if (!user) {
                throw new Error('user not found')
            }

            const room = new roomModel({
                createdBy: username,
                createdAt: Date.now(),
                name: name,
                members: [username]
            })

            await room.save()
            return room

        } catch (error) {
            console.log(error)
            return null
        }
    },

    async addMember(username, room_id) {
        try {
            const user = await userModel.findOne({ username: username })
            const room = await roomModel.findById(room_id)

            if (!user) {
                throw new Error('user not found')
            }

            if (!room) {
                throw new Error('room not found')
            }

            room.members.push(username)
            user.rooms.push(room._id)

            await user.save()
            await room.save()

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async addMembers(usernames, room_id) {
        try {
            const users = await userModel.find({ username: {$in: usernames }})
            const room = await roomModel.findById(room_id)

            if(!room) {
                throw new Error('room not found')
            }
            
            if(users.length != usernames.length) {
                throw new Error('some users were not found')
            }

            for(var i = 0; i < users.length; i++) {
                users[i].rooms.push(room_id)
                room.members.push(usernames[i])
                await users[i].save()
            }

            await room.save()
            
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async sendMessage(username, content, room_id) {
        try {
            const user = await userModel.findOne({ username: username })
            const room = await roomModel.findById(room_id)

            if (!user) {
                throw new Error('user not found')
            }

            if (!room) {
                throw new Error('room not found')
            }

            const message = {
                sender: username,
                content: content,
                timestamp: Date.now()
            }

            room.messages.push(message)
            room.save()
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

