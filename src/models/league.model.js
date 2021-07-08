'use strict'

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var LeagueSchema = Schema({
    name: String,
    emblem: String,
    teams:[{
        name: String,
        coach: String,
        emblem: String,
        idLeague: String
    }],
    idCreator: { type: Schema.Types.ObjectId, ref: 'Users' }
})

module.exports = mongoose.model('Leagues', LeagueSchema)