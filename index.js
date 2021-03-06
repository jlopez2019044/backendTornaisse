'use strict'

const mongoose = require("mongoose")
const app = require('./app')

mongoose.Promise = global.Promise;

const URL = 'mongodb+srv://root:root@tornaisse.j89lr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';


mongoose.connect( URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log('Successful database connection')

    app.listen(process.env.PORT || 3000, function () {
        console.log('Server running on port 3000')
    })
}).catch(err => console.log(err))