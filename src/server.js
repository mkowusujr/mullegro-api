const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('./api/middlewares/swaggerSetup');
const db = require('./api/models/index');

const app = express();
const mockDataService = require('../mock-data-services/index');

// middleware
app.use(express.json());
app.use(cors());

// start db
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log('>> Database synchronized');
    mockDataService
      .createMockData()
      .then(() => console.log('>> Mock data created'))
      .catch(err => console.error(err));
  })
  .catch(err => {
    console.error(err);
  });

// setup api route controllers
const apiRoutes = require('./api/controllers/index');
app.use('/api', apiRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// start app
const PORT = 3000;

app.listen(PORT, () =>
  console.log(`>> Server is live at http://localhost:${PORT}`)
);

module.exports = app;
