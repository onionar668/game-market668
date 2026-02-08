const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Favorite = sequelize.define(
    "Favorite",
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
    },
    {
      indexes: [{ unique: true, fields: ["userId", "productId"] }],
    }
  );

  Favorite.associate = (db) => {
    Favorite.belongsTo(db.User, { foreignKey: "userId" });
    Favorite.belongsTo(db.Product, { foreignKey: "productId" });
  };

  return Favorite;
};
