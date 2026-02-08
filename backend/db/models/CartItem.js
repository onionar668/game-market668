const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      indexes: [{ unique: true, fields: ["userId", "productId"] }],
    }
  );

  CartItem.associate = (db) => {
    CartItem.belongsTo(db.User, { foreignKey: "userId" });
    CartItem.belongsTo(db.Product, { foreignKey: "productId" });
  };

  return CartItem;
};
