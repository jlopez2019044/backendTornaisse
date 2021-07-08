'use strict'
const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const cors = require("cors");
const fileUpload = require('express-fileupload')

const userController = require('./src/controllers/user.controller')

const user_routes = require('./src/routes/user.routes')
const league_routes = require('./src/routes/league.routes')
const matchDay_routes = require('./src/routes/match-day.routes');

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use( fileUpload({
    abortOnLimit: true,
    responseOnLimit: 'File size is bigger than allowed',
    limits: {
        fileSize: 50 * 1024 * 1024
    },
}) );
app.use(cors())

app.use('/api', user_routes)
app.use('/api', league_routes)
app.use('/api', matchDay_routes)

userController.createAdmin()

module.exports = app