module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define('post', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    condition: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(10),
      allowNull: false
    }
  });
  return Post;
};
