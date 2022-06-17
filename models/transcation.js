const Sequelize = require('sequelize');
const db = require('../util/database');

const Transcation = db.define('transcation', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Transcation;