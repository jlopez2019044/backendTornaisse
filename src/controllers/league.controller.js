'use strict'

const leagueModel = require('../models/league.model')

const League = require('../models/league.model')
const User = require('../models/user.model')
const fs = require('fs').promises;

function createLeague(req,res){
    var leagueModel = new League();
    var params = req.body
    
    //if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para crear una liga.'})

    if(params.name){
        leagueModel.name = params.name
        leagueModel.emblem = params.emblem
        leagueModel.idCreator = req.user.sub

        leagueModel.save((err, leagueSaved) => {
            if(err) return res.status(500).send({ message: 'Error en la petición' })
            if(!leagueSaved) return res.status(500).send({message: 'Error al guardar la liga' })
            return res.status(200).send({ leagueSaved })
        })

    }else{
        return res.status(500).send({ message: 'Faltan datos por ingresar'})
    }
}

async function editLeague(req,res){
    var idLeague = req.params.idLeague
    var params = req.body
    const userFound = await User.findById( req.user?.sub )
    League.findById(idLeague, (err, leagueFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!leagueFound) return res.status(500).send({ message: 'Liga no encontrada'})

        if(req.user.sub != leagueFound.idCreator && userFound.rol !== 'ROL_ADMIN') return res.status(500).send({ message: 'No tienes permisos para editar esta liga.'})

        League.findByIdAndUpdate(idLeague, params, { new: true, useFindAndModify: false}, (err, editedLeague) => {
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!editedLeague) return res.status(500).send({ message: 'Error al editar la liga'})
            return res.status(200).send({ editedLeague})
        })
    })
}

function deleteLeague(req,res){
    var idLeague = req.params.idLeague

    //if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para eliminar una liga.'})

    League.findById(idLeague, (err, leagueFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!leagueFound) return res.status(500).send({ message: 'Liga no encontrada'})

        if(req.user.sub != leagueFound.idCreator) return res.status(500).send({ message: 'No tienes permisos para eliminar esta liga.'})

        League.findByIdAndDelete(idLeague, (err, deletedLeague) => {
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!deletedLeague) return res.status(500).send({ message: 'Error al eliminar la liga'})
            return res.status(200).send({ deletedLeague})
        })
    })
}

function getLeagueID(req,res){
    var idLeague = req.params.idLeague

    //if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para ver una liga.'})

    League.findById(idLeague).populate('idCreator', 'name lastname username').exec((err, leagueFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!leagueFound) return res.status(500).send({ message: 'Error al encontrar la liga'})
        if(req.user.sub != leagueFound.idCreator) return res.status(500).send({ message: 'No tienes los permisos para ver esta liga.'})
        return res.status(200).send({ leagueFound })
    })
}

async function getLeaguesIdCreator(req,res){
    var idCreator = req.user.sub

    if(req.user.rol==="ROL_ADMIN"){
        League.find().populate('idCreator', 'name lastname username').exec((err,leaguesFound)=>{
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!leaguesFound) return res.status(500).send({ message: 'Error al encontrar las ligas'})
            return res.status(200).send( leaguesFound )
        })

    }else{
        League.find({idCreator: idCreator}).populate('idCreator', 'name lastname username').exec((err,leaguesFound) => {
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!leaguesFound) return res.status(500).send({ message: 'Error al encontrar las ligas'})
            return res.status(200).send( leaguesFound )
        })

    }

}

async function addTeam(req,res){
    var idLeague = req.params.idLeague
    var params = req.body;

    const file = req.files?.files;
    const type = file?.mimetype.split('/')[1] || '';
    const filename = `teamImg${new Date().getMilliseconds()}.${type}`;
    
    if( file ) await file.mv( `uploads/${filename}` );
    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para agregar equipos a esta liga.'})

    League.findById(idLeague, (err, leagueFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!leagueFound) return res.status(500).send({ message: 'Error al encontrar la liga'})

        if(req.user.sub != leagueFound.idCreator) return res.status(500).send({ message: 'No tienes los permisos para agregar equipos a esta liga.'})

        if(leagueFound.teams.length === 10) return res.status(500).send({ message: 'Ya no puedes agregar mas equipos a la liga'})

        let teamFile;
        if( file ) teamFile = filename;
        if( !file ) teamFile = 'defaultTeam.jpg';

        League.findByIdAndUpdate(idLeague, { $push: { teams: { name: params.name, coach: params.coach, emblem: teamFile, idLeague: idLeague } } }, { new: true, useFindAndModify: false}, (err, addedTeam) => {
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!addedTeam) return res.status(500).send({ message: 'No se ha podido agregar el equipo' })

            return res.status(200).send({ addedTeam })
        } )

    })
}

function getTeamsLeague(req,res){
    var idLeague = req.params.idLeague

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para ver los equipos de esta liga.'})

    League.findById(idLeague, (err, leagueFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición' })
        if(!leagueFound) return res.status(500).send({ message: 'Error al encontrar la liga'})
        
        return res.status(200).send({ TeamsFound: leagueFound.teams })
    })

}

function editTeam(req,res){
    var idLeague = req.params.idLeague
    var idTeam = req.params.idTeam
    var params = req.body

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para editar los equipos de esta liga.'})

    League.findById(idLeague, (err, leagueFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!leagueFound) return res.status(500).send({ message: 'Error al encontrar la liga'})

        if(req.user.sub != leagueFound.idCreator) return res.status(500).send({ message: 'No tienes los permisos para eliminar un equipo de esta liga.'})

        League.findOneAndUpdate({ _id: idLeague, "teams._id": idTeam }, {"teams.$.name": params.name, "teams.$.coach": params.coach}, {new: true, useFindAndModify: false}, (err, editedTeam) =>{
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!editedTeam) return res.status(500).send({ message: 'Error al editar el equipo.'})
            return res.status(200).send({ editedTeam })
        })
    })

}

function deleteTeam(req,res){
    var idLeague = req.params.idLeague
    var idTeam = req.params.idTeam

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para eliminar un equipo de esta liga.'})

    League.findById(idLeague, (err, leagueFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!leagueFound) return res.status(500).send({ message: 'Error al encontrar la liga'})

        if(req.user.sub != leagueFound.idCreator) return res.status(500).send({ message: 'No tienes los permisos para eliminar un equipo de esta liga.'})

        League.findOneAndUpdate({'teams._id': idTeam}, { $pull: { teams: { _id: idTeam } } }, { new: true, useFindAndModify: false}, (err, deletedTeam) =>{
            if(err) return res.status(500).send({ message: 'Error en la petición'})
            if(!deletedTeam) return res.status(500).send({ message: 'Error al eliminar el equipo'})
            return res.status(200).send({ deletedTeam })
        })
    })

}

function getTeamID(req,res){
    var idLeague = req.params.idLeague
    var idTeam = req.params.idTeam

    League.findOne({ _id: idLeague, "teams._id": idTeam }, {"teams.$":1}, (err, teamFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición'})
        if(!teamFound) return res.status(500).send({ message: 'Error al encontrar el equipo'})

        return res.status(200).send({ teamFound })
    })
}

async function getTeamImage( req, res ) {
    const file = req.params.file;

    try {
        await fs.access(`uploads/${file}`);
        res.download(`uploads/${file}`, (error) => {
            if( error ) return res.status(404).send({ error: error });
        })
    }catch (error) {
        res.download(`uploads/defaultTeam.png`, (error) => {
            if( error ) return res.status(404).send({ error: error });
        })
    }
    
}

/*function addPlayerToTeam(req,res){
    var idLeague = req.params.idLeague
    var idTeam = req.params.idTeam
    var params = req.body

    if(req.user.rol != 'ROL_USER') return res.status(500).send({ message: 'No tienes los permisos para eliminar un equipo de esta liga.'})

    League.findById(idLeague, (err, leagueFound) => {
        if(err) return res.status(500).send({ message: 'Erron en la petición'})
        if(!leagueFound) return res.status(500).send({ message: 'Error al encontrar la liga'})

        if(req.user.sub != leagueFound.idCreator) return res.status(500).send({ message: 'No tienes los permisos para eliminar un equipo de esta liga.'})

        League.findOneAndUpdate({idLeague, "teams._id": idTeam}, {$push: { teams: { players: { name: params.name, lastname: params.lastname, number: params.number } } } }, { new: true, useFindAndModify: false}, (err, addedPlayer) =>{
            if(err) return res.status(err).send({ message: 'Error en la petición'})
            if(!addedPlayer) return res.status(500).send({ message: 'Error al agregar el jugador' })
            return res.status(200).send({ addedPlayer })
        })
    })

}*/

module.exports = {
    createLeague,
    editLeague,
    deleteLeague,
    getLeagueID,
    getLeaguesIdCreator,
    addTeam,
    getTeamsLeague,
    deleteTeam,
    editTeam,
    getTeamID,
    getTeamImage
}