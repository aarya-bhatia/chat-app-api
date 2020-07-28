const networkModel = require(__basedir + '/models/models').Network

module.exports = {

    // Send a friend request from one user to another 
    sendFriendRequest: async function(from, to) {
        const fromNetwork = await networkModel.findOne({ user_id: from }) // get sender's network
        const toNetwork = await networkModel.findOne({ user_id: to }) // get reciever's network

        // if sender has a network, push reciever to his/her outgoing requests[]
        if (fromNetwork) {
            // if request not already sent, send it
            if (!fromNetwork.outgoingRequests.includes(to)) {
                fromNetwork.outgoingRequests.push(to)
                await fromNetwork.save()
            }

            // if reciever also has a network, push sender to his/her incoming requests[]
            if (toNetwork) {
                // if request not already recieved, recieve it
                if (!toNetwork.incomingRequests.includes(from)) {
                    toNetwork.incomingRequests.push(from)
                }
                await toNetwork.save()
            }
        }
    },

    // Unsend an existing friend request from one user to another
    unsendFriendRequest: async function(from, to) {
        const fromNetwork = await networkModel.findOne({ user_id: from })
        const toNetwork = await networkModel.findOne({ user_id: to })

        if (fromNetwork) {
            fromNetwork.outgoingRequests.filter(id => { return id != to })
            await fromNetwork.save()
        }

        if (toNetwork) {
            toNetwork.incomingRequests.filter(id => { return id != from })
            await toNetwork.save()
        }
    },

    // user accepts an incoming friend request from another user
    acceptFriendRequest: async function(user_id, other_id) {
        // 'user' will accept request from 'other'
        const userNetwork = await networkModel.findOne({ user_id: user_id })
        const friendNetwork = await networkModel.findOne({ user_id: other_id })

        if (userNetwork) {
            userNetwork.incomingRequests.filter(id => { return id != other_id })
            if (!userNetwork.friends.includes(other_id)) userNetwork.friends.push(other_id)
            await userNetwork.save()
            console.log(`${user_id} made new friend ${other_id}`)
        } else {

        }

        if (friendNetwork) {
            friendNetwork.outgoingRequests.filter(id => { return id != user_id })
            if (!friendNetwork.friends.includes(user_id)) friendNetwork.friends.push(user_id)
            await friendNetwork.save()
            console.log(`${other_id} made new friend ${user_id}`)
        }
    },

    // user rejects an incoming friend request from another user
    rejectFriendRequest: async function() {

    },

    // user unfriend's another user
    unfriend: async function(user_id, other_id) {
        const userNetwork = await networkModel.findOne({ user_id: user_id }) // get user's network
        const friendNetwork = await networkModel.findOne({ user_id: other_id }) // get other user's network

        // if 'user' has a network, filter out 'other' user from his/her friends[]
        if (userNetwork) {
            userNetwork.friends = userNetwork.friends.filter(id => { return id != other_id })
            await userNetwork.save()
        }

        // if the 'other' user has a network, filter out 'user' from his/her friends[]
        if (friendNetwork) {
            friendNetwork.friends = friendNetwork.friends.filter(id => { return id != user_id })
            await friendNetwork.save()
        }
    }


}