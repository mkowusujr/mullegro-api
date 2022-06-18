const express = require('express')
const db = require('./app/models/index')

const app = express();

// middleware


// start db
db.sequelize
    .sync({ force: true })
    .then(() => {
        console.log('>> Database synchronized');
    })
    .catch((err) => {
        console.log(err)
    });

// setup routes
const homeRoute = require('./app/routes/home');
app.use('', homeRoute);

// start app
const PORT = 3000;
app.listen(
    PORT, () => console.log(`>> Server is live at http://localhost:${PORT}`)
);
