// routes/absensiRoutes.js
const express = require('express');
const router = express.Router();
const { absenHariIni, getAbsensi } = require('../controllers/absensiController');
const { verifyToken } = require('../middleware/authMiddleware');

// Karyawan klik absen (POST)
router.post('/', verifyToken, absenHariIni);

// Tarik data riwayat absen (GET)
router.get('/', verifyToken, getAbsensi);

module.exports = router;