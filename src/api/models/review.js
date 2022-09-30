module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define('review', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    dateString: {
      type: Sequelize.STRING,
      allowNull: false
    },
    rating: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return Review;
};
