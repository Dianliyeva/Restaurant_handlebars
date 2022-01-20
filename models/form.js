const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Form extends Model {}

Form.init({
    name: DataTypes.STRING,
}, {
    sequelize: db,
    timestamps: false,
});

module.exports = Form;