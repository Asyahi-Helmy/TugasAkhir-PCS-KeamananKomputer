const { DataTypes } = require('sequelize');
const db = require('../config/database');

const SlipGaji = db.define('Slip_Gaji', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    periode_bulan: {
        type: DataTypes.STRING,
        allowNull: false // Contoh isian: "Januari 2026"
    },
    gaji_pokok: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    bonus: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    potongan_hutang: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    nomor_rekening: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = SlipGaji;