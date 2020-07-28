const networkModel = require(__basedir + '/models/models').Network

module.exports = {

    // Send a friend request from one user to another 
    sendFriendRequest: async function(from, to) {
        try {
            const fromNetwork = await networkModel.findOne({ user_id: from }) // get sender's network
            const toNetwork = await networkModel.findOne({ user_id: to }) // get reciever's network

            // if sender has a network, push reciever to his/her outgoing requests[]
            if (fromNetwork) {
                // if request not already sent, send it
                if (!fromNetwork.outgoingRequests.includes(to)) {
                    fromNetwork.outgoingRequests.push(to)
                    await fromNetwork.save()
                    console.log(`${from} has sent a friend request to ${to}`)
                }

                // if reciever also has a network, push sender to his/her incoming requests[]
                if (toNetwork) {
                    // if request not already recieved, recieve it
                    if (!toNetwork.incomingRequests.includes(from)) {
                        toNetwork.incomingRequests.push(from)
                    }
                    await toNetwork.save()
                    console.log(`${to} has recieved a friend request from ${from}`)
                }
            }
        } catch (err) { throw err }
    },

    // Unsend a friend request sent by one user to another user
    unsendFriendRequest: async function(from, to) {
        try {
            const fromNetwork = await networkModel.findOne({ user_id: from }) // get sender's network
            const toNetwork = await networkModel.findOne({ user_id: to }) // get reciever's network

            // remove request from sender's outgoing
            if (fromNetwork) {
                const outgoingRequests = fromNetwork.outgoingRequests
                fromNetwork.outgoingRequests = outgoingRequests.filter(id => { return id != to })
                await fromNetwork.save()
                console.log(`${from} has removed friend request to ${to}`)
            }

            // remove request from reciever's incoming
            if (toNetwork) {
                const incomingRequests = toNetwork.incomingRequests
                toNetwork.incomingRequests = incomingRequests.filter(id => { return id != from })
                await toNetwork.save()
                console.log(`${to} has removed friend request from ${from}`)
            }
        } catch (err) { throw err }
    },

    // user accepts an incoming friend request from another user
    acceptFriendRequest: async function(user_id, other_id) {
        try { // 'user' will accept request from 'other'
            const userNetwork = await networkModel.findOne({ user_id: user_id })
            const friendNetwork = await networkModel.findOne({ user_id: other_id })

            // if reciever has network, remove incoming request from user and add him/her as a friend 
            if (userNetwork) {
                const incomingRequests = userNetwork.incomingRequests
                userNetwork.incomingRequests = incomingRequests.filter(id => { return id != other_id })
                if (!userNetwork.friends.includes(other_id)) userNetwork.friends.push(other_id)
                await userNetwork.save()
                console.log(`${user_id} made new friend ${other_id}`)
            } else {

            }

            // if sender has network, remove outgoing request to user and add him/her as a friend
            if (friendNetwork) {
                const outgoingRequests = friendNetwork.outgoingRequests
                friendNetwork.outgoingRequests = outgoingRequests.filter(id => { return id != user_id })
                if (!friendNetwork.friends.includes(user_id)) friendNetwork.friends.push(user_id)
                await friendNetwork.save()
                console.log(`${other_id} made new friend ${user_id}`)
            }
        } catch (err) { throw err }
    },

    // user rejects an incoming friend request from another user
    rejectFriendRequest: async function(from, to) {
        try {
            const fromNetwork = await networkModel.findOne({ user_id: from }) // get sender's network
            const toNetwork = await networkModel.findOne({ user_id: to }) // get reciever's network

            // if reciever has a network, remove sender's request from his incoming
            if (toNetwork) {
                const incomingRequests = toNetwork.incomingRequests
                toNetwork.incomingRequests = incomingRequests.filter(id => { return id != from })
                await toNetwork.save()
                console.log(`${to} has rejected friend request sent by ${from}`)
            }

            // if sender has a network, remove his/her request from his outgoing
            if (fromNetwork) {
                const outgoingRequests = fromNetwork.outgoingRequests
                fromNetwork.outgoingRequests = outgoingRequests.filter(id => { return id != to })
                await fromNetwork.save()
                console.log(`${from}'s friend request has been rejected by ${to}`)
            }

        } catch (err) { throw err }
    },

    // user unfriend's another user
    unfriend: async function(user_id, other_id) {
        try {
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
        } catch (err) { throw err }
    }
}