require('dotenv').config()
global.__basedir = __dirname; // root directory 

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/routes')

const port = process.env.PORT || 3000
const mongodbConnectionUrl = `mongodb+srv://admin-aarya:${process.env.MNG_PASSWORD}@cluster0-tq3ny.mongodb.net/ChatApp`

const app = express()

app.use(cors({ origin: true }))
app.use(express.static('public'))

app.use('/', routes.auth)
app.use('/users', routes.users)
app.use('chats', routes.rooms)
app.use('/network', routes.network)

app.use('*', (err, req, res, next) => {
    res.status(500).send('Oops, something went wrong!')
})

async function connectToDb() {
    try {
        await mongoose.connect(mongodbConnectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })

        console.log("Db connection success")

    } catch (err) {
        console.log(err.message);
        process.exit(1)
    }
}

connectToDb()

app.listen(port, () => {
    console.log('Server running on port: ', port);
})