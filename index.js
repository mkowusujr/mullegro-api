const express = require('express')
const db = require('./util/database')


// start db
const User = require('./models/user')
const Post = require('./models/post')
const Cart = require('./models/cart')
const Transcation = require('./models/transcation')
db
    .sync({ force: true })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((err) => {
        console.log(err)
    });


// start app
const app = express();
const PORT = 3000;
app.listen(
    PORT, () => console.log(`Server is live at http://localhost:${PORT}`)
);


// setup routes
const homeRoute = require('./routes/home');
app.use('', homeRoute);


