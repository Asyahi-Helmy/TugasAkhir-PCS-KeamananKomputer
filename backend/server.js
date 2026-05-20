// server.js
const express = require('express');
const app = express();
const db = require('./config/database');
const cors = require('cors');
const { User, SlipGaji } = require('./models');
const absensiRoutes = require('./routes/absensiRoute');

// Routes
const authRoutes = require('./routes/authRoute');
const slipGajiRoutes = require('./routes/slipGajiRoute');
const Absensi = require('./models/Absensi');

// Middleware
app.use(express.json());
app.use(cors());

// --- DATABASE SYNC ---
(async () => {
    try {
        await db.sync({ alter: true });
        console.log(' Database Sync Berhasil');
    } catch (error) {
        console.error(' Database Sync Gagal:', error);
    }
})();

// Import middleware untuk proteksi route get users
const { verifyToken, isHRD } = require('./middleware/authMiddleware');

// Endpoint untuk mengambil daftar pegawai (Khusus HRD)
app.get('/users', verifyToken, isHRD, async (req, res) => {
    try {
        // Ambil semua user dari database
        const users = await User.findAll({ attributes: ['id', 'nama_pegawai', 'role'] });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- DAFTAR ROUTES ---
app.use('/auth', authRoutes);
app.use('/slip-gaji', slipGajiRoutes);
app.use('/absensi', absensiRoutes);

app.get('/', (req, res) => res.send('API HRD Payroll Ready!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di: http://localhost:${PORT}`));