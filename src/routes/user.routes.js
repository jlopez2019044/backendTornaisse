'use strict';

const express = require("express")
const userController = require('../controllers/user.controller')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/login', userController.login)
api.post('/registerUser', userController.registerUser)
api.post('/registerUserAdmin', md_authentication.ensureAuth, userController.registerUserAdmin)
api.post('/uploads/profileImg/:id', md_authentication.ensureAuth, userController.uploadProfileImage)
api.put('/editUser/:idUser', md_authentication.ensureAuth, userController.editUser)
api.get('/getUserID/:idUser', md_authentication.ensureAuth, userController.getUserID)
api.get('/uploads/profileImg/:id', userController.getProfileImage);
api.delete('/deleteUser/:idUser', md_authentication.ensureAuth, userController.deleteUser)
api.delete('/uploads/profileImg/:id', md_authentication.ensureAuth, userController.deleteProfileImage)
api.get('/getRegisteredUsers', md_authentication.ensureAuth, userController.getRegisteredUsers)

module.exports = api