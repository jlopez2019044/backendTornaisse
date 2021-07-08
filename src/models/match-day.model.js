'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchDaySchema = Schema({
    number  :{type: Number, required: true },
    leagueId:{type: Schema.Types.ObjectId, ref: 'Leagues'},
    match   :[{
        teamIdOne   : {type: Schema.Types.ObjectId, ref: 'Leagues.teams._id'},
        goalsTeamOne: {type: Number, required: true},
        teamIdTwo   : {type: Schema.Types.ObjectId, ref: 'Leagues.teams._id'},
        goalsTeamTwo: {type: Number, required: true},
        hour        : {type: Date, required: true},
        winner      : {type: String, required: true}
    }],
    date    :{type: Date, required: true}
})

module.exports = mongoose.model('MatchDay', MatchDaySchema);