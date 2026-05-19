// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load password dari .env
// Buat instance Sequelize
const db = new Sequelize(
    process.env.DB_NAME, // Nama Database
    process.env.DB_USER, // User (root)
    process.env.DB_PASS, // Password
    {
        host: process.env.DB_HOST,
        dialect: 'mysql', // Tipe database (bisa postgres/sqlite/mssql)
        logging: false // Matikan log SQL di terminal agar bersih (opsional)
    }
);
// Cek koneksi
db.authenticate()
    .then(() => console.log(' Berhasil konek ke Database via Sequelize!'))
    .catch(err => console.error(' Gagal konek:', err));
module.exports = db;