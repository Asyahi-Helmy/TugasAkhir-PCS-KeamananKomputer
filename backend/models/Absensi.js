// models/Absensi.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Absensi = sequelize.define('Absensi', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Hadir', 'Izin', 'Sakit', 'Alpha'),
        defaultValue: 'Hadir'
    }
}, {
    freezeTableName: true,
    timestamps: true
});

// Relasi: 1 User bisa punya banyak data Absensi
User.hasMany(Absensi, { foreignKey: 'userId' });
Absensi.belongsTo(User, { foreignKey: 'userId' });

module.exports = Absensi;