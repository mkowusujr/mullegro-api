const express = require("express");
const cors = require("cors");
const db = require("./api/models/index");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// start db
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log(">> Database synchronized");
  })
  .catch((err) => {
    console.error(err);
  });

// setup api route controllers
const apiRoutes = require("./api/controllers/index");
app.use("/api", apiRoutes);

// start app
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`>> Server is live at http://localhost:${PORT}`)
);

module.exports = app;
