const _ = require('lodash')
const userModel = require(__basedir + '/models/models').User

module.exports.usernameValidation = function(username) {
    let username = req.body.username
    username = _.replace(username, /[&\/\\#, +()$~%.'":*?<>{}]/g, '') // remove special characters
    username = _.kebabCase(username) // convert to kebab case
    return username
}

module.exports.usernameAvailable = function(username) {
    try {
        const user = await userModel.findOne({ username: validated })
        return !user
    } catch (e) { throw e }
}