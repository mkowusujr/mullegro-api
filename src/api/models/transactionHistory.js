module.exports = (sequelize, Sequelize) => {
  const transactionHistory = sequelize.define('transactionHistory', {
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
    totalAmount: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    totalItems: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
  return transactionHistory;
};
