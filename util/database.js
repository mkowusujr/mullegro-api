const Sequelize = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: './util/mullegro.db'
});

module.exports = db;