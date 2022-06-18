const express = require('express')
const db = require('./api/models/index')

const app = express();

// middleware
const logger = require('./api/middlewares/logger');
app.use(logger.logger);
app.use(express.json());

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
const apiRoutes = require('./api/routes/index');
app.use('', apiRoutes);

// start app
const PORT = 3000;
app.listen(
    PORT, () => console.log(`>> Server is live at http://localhost:${PORT}`)
);
