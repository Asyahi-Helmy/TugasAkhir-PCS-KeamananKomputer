// controllers/absensiController.js
const Absensi = require('../models/Absensi');
const User = require('../models/User');

// Karyawan melakukan Absen harian
const absenHariIni = async (req, res) => {
    try {
        const userId = req.user.id; // Didapat dari token JWT
        
        // Ambil tanggal hari ini format YYYY-MM-DD
        const hariIni = new Date().toISOString().split('T')[0];

        // Cek apakah user udah absen hari ini?
        const cekAbsen = await Absensi.findOne({
            where: { userId: userId, tanggal: hariIni }
        });

        if (cekAbsen) {
            return res.status(400).json({ message: 'Anda sudah melakukan absensi hari ini!' });
        }

        // Kalau belum, simpan ke database
        await Absensi.create({ userId, tanggal: hariIni, status: 'Hadir' });
        res.status(201).json({ message: 'Absen Hadir berhasil dicatat!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// HRD atau Karyawan melihat riwayat absen
const getAbsensi = async (req, res) => {
    try {
        let dataAbsensi;
        if (req.user.role === 'HRD') {
            // HRD lihat semua absen pegawai
            dataAbsensi = await Absensi.findAll({
                include: [{ model: User, attributes: ['nama_pegawai'] }],
                order: [['tanggal', 'DESC']]
            });
        } else {
            // Karyawan cuma lihat absen dia sendiri
            dataAbsensi = await Absensi.findAll({
                where: { userId: req.user.id },
                order: [['tanggal', 'DESC']]
            });
        }
        res.status(200).json({ data: dataAbsensi });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { absenHariIni, getAbsensi };