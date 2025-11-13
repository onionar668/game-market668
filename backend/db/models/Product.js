const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        price:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        img:{
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Product
}