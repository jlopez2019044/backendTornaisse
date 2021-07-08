'use strict'

const express = require('express')
const leagueController = require('../controllers/league.controller')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/createLeague', md_authentication.ensureAuth, leagueController.createLeague)
api.put('/editLeague/:idLeague', md_authentication.ensureAuth, leagueController.editLeague)
api.delete('/deleteLeague/:idLeague', md_authentication.ensureAuth, leagueController.deleteLeague)
api.get('/getLeagueID/:idLeague', md_authentication.ensureAuth, leagueController.getLeagueID)
api.get('/getLeaguesIdCreator', md_authentication.ensureAuth, leagueController.getLeaguesIdCreator)
api.put('/addTeam/:idLeague', md_authentication.ensureAuth, leagueController.addTeam)
api.get('/getTeamsLeague/:idLeague', md_authentication.ensureAuth, leagueController.getTeamsLeague)
api.put('/deleteTeamOfLeague/:idLeague/:idTeam', md_authentication.ensureAuth, leagueController.deleteTeam)
api.put('/editTeam/:idLeague/:idTeam', md_authentication.ensureAuth, leagueController.editTeam)
api.get('/getTeamID/:idLeague/:idTeam', md_authentication.ensureAuth, leagueController.getTeamID)
api.get('/uploads/teamImg/:file', leagueController.getTeamImage);
//api.put('/addPlayerToTeam/:idLeague/:idTeam', md_authentication.ensureAuth, leagueController.addPlayerToTeam)

module.exports = api