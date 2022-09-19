module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define('cart', {
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
  return Cart;
};
