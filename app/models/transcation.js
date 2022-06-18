module.exports = (sequelize, Sequelize) => {
    const Transcation = sequelize.define('transcation', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Transcation;
};