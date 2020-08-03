require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: true }))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(function (err, req, res, next) {
    console.log(err)
    res.status(500).send('Oops, something went wrong!')
})


const db = require("./models")
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });


require("./routes/user.routes")(app)
require("./routes/post.routes")(app)
require("./routes/room.routes")(app)

const port = process.env.PORT || 3000

module.exports = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port: ${port}`);
})