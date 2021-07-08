'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'key_Torneo_Deportivo'

exports.ensureAuth = function (req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send({ message: 'The request is not authorized' })
    }

    var token = req.headers.authorization.replace(/['"]+/g, '')

    try {
        var payload = jwt.decode(token, secret)

        if(payload.exp <= moment.unix()){
            return res.status(401).send({ message: 'The token has expired' })
        }
    } catch (error) {
        return res.status(404).send({ message: 'The token is not valid' })
    }

    req.user = payload
    next()
}