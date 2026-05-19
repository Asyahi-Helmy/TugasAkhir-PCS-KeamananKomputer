const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_pegawai: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('HRD', 'Karyawan'),
        defaultValue: 'Karyawan'
    }
}, {
    freezeTableName: true, // Biar nama tabelnya tetap 'User', nggak di-plural jadi 'Users'
    timestamps: true
});

module.exports = User;