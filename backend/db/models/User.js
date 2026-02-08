const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (db) => {
    User.hasMany(db.CartItem, { foreignKey: "userId" });
    User.hasMany(db.Favorite, { foreignKey: "userId" });
    User.hasMany(db.Product, { foreignKey: "userId", as: "Products" });
    User.hasMany(db.Message, { as: "sentMessages", foreignKey: "senderId" });
    User.hasMany(db.Message, { as: "receivedMessages", foreignKey: "receiverId" });
  };

  return User;
};
