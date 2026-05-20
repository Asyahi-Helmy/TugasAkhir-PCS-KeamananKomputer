// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Satpam Pintu Utama (Cek Token Valid/Tidak)
const verifyToken = (req, res, next) => {
    // Ngambil token dari header request
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format standar: "Bearer <token>"

    if (!token) {
        // jika tanpa token, tolak dengan status 401 [cite: 74, 75]
        return res.status(401).json({ message: 'Akses ditolak! Anda belum login (Token tidak ada).' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluarsa!' });
        }
        // Simpan data user (id & role) ke request biar bisa dipake di controller nanti
        req.user = decoded; 
        next();
    });
};

// 2. Satpam Ruang VIP (Cek Role HRD)
const isHRD = (req, res, next) => {
    if (req.user.role !== 'HRD') {
        return res.status(403).json({ message: 'Akses ditolak! Hanya Manager/HRD yang bisa melakukan aksi ini.' });
    }
    next();
};

module.exports = { verifyToken, isHRD };