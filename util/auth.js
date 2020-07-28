const _ = require('lodash')
const userModel = require(__basedir + '/models/models').User

module.exports.usernameValidation = function(username) {
    username = _.replace(username, /[&\/\\#, +()$~%.'":*?<>{}]/g, '') // remove special characters
    username = _.kebabCase(username) // convert to kebab case
    return username
}

module.exports.usernameAvailable = async function(username) {
    try {
        const user = await userModel.findOne({ username: username })
        return !user
            //return true
    } catch (e) { throw e }
}