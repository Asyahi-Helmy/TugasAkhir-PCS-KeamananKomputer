// controllers/slipGajiController.js
const { SlipGaji, User } = require('../models');

// 1. CREATE: Tambah Slip Gaji (Hanya HRD)
const createSlipGaji = async (req, res) => {
    try {
        const { userId, periode_bulan, gaji_pokok, bonus, potongan_hutang, nomor_rekening } = req.body;
        const newSlip = await SlipGaji.create({
            userId, periode_bulan, gaji_pokok, bonus, potongan_hutang, nomor_rekening
        });
        res.status(201).json({ message: 'Slip Gaji berhasil dibuat!', data: newSlip });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

// 2. READ: Lihat Data Gaji (HRD lihat semua, Karyawan lihat miliknya sendiri)
const getSlipGaji = async (req, res) => {
    try {
        let slips;
        // Cek role dari token JWT yang udah di-decode sama middleware
        if (req.user.role === 'HRD') {
            // HRD bisa lihat semua slip gaji + nama pegawainya
            slips = await SlipGaji.findAll({ 
                include: [{ model: User, attributes: ['nama_pegawai', 'email'] }] 
            });
        } else {
            // Karyawan cuma bisa lihat slip gaji yang userId-nya sama dengan id dia di token
            slips = await SlipGaji.findAll({ 
                where: { userId: req.user.id },
                include: [{ model: User, attributes: ['nama_pegawai'] }]
            });
        }
        res.status(200).json({ data: slips });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

// 3. UPDATE: Edit Gaji (Hanya HRD)
const updateSlipGaji = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await SlipGaji.update(req.body, { where: { id } });
        
        if (updated[0] === 0) return res.status(404).json({ message: 'Slip Gaji tidak ditemukan' });
        res.status(200).json({ message: 'Slip Gaji berhasil diupdate!' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

// 4. DELETE: Hapus Gaji (Hanya HRD)
const deleteSlipGaji = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SlipGaji.destroy({ where: { id } });

        if (!deleted) return res.status(404).json({ message: 'Slip Gaji tidak ditemukan' });
        res.status(200).json({ message: 'Slip Gaji berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

module.exports = { createSlipGaji, getSlipGaji, updateSlipGaji, deleteSlipGaji };