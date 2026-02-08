const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Message.associate = (db) => {
    Message.belongsTo(db.User, { foreignKey: "senderId", as: "Sender" });
    Message.belongsTo(db.User, { foreignKey: "receiverId", as: "Receiver" });
    Message.belongsTo(db.Product, { foreignKey: "productId", as: "Product" });
  };

  return Message;
};
