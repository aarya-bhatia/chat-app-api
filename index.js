const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const port = process.env.PORT || 3000
const mongodbConnectionUrl = `mongodb+srv://admin-aarya:${process.env.MNG_PASSWORD}@cluster0-tq3ny.mongodb.net/ChatApp`

const userRouter = require('./routes/users')
const roomRouter = require('./routes/rooms')
const messageRouter = require('./routes/messages')
const friendRouter = require('./routes/friends')

const app = express()

app.use(cors({ origin: true }))
app.use(express.static('public'))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/rooms', roomRouter)
app.use('/api/v1/messages', messageRouter)
app.use('/api/v1/friends', friendRouter)

app.set('view enging', 'ejs')

const connectToDb = async () => {
    try {
        await mongoose.connect(mongodbConnectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        console.log("Db connection success");
    } catch (err) {
        console.log(err.message);
        process.exit(1)
    }
}

app.listen(port, () => {
    console.log('Server running on port: ', port);
})

connectToDb()