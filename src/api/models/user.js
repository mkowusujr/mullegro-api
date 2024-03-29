/**
 * @typedef {Object} User The User data object
 * @property {string} name The user's name
 */

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.STRING(),
      allowNull: true
    },
    profilePicture: {
      type: Sequelize.STRING(),
      allowNull: true
    }
  });
  return User;
};
