module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define('transaction', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    totalAmount: {
      type: Sequelize.FLOAT
    },
    itemCount: {
      type: Sequelize.INTEGER
    }
  });
  return Transaction;
};
