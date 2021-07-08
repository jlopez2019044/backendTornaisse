'use strict'

var jwt = require("jwt-simple")
var moment = require("moment")
var secret = 'key_Torneo_Deportivo'

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        rol: user.rol,
        image: user.image,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret)
}