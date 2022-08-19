module.exports = (sequelize, Sequelize) => {
  const transactionHistories = sequelize.define('transaction', {
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
  return transactionHistories;
};
