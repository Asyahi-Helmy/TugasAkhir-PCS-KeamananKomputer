// routes/slipGajiRoutes.js
const express = require('express');
const router = express.Router();
const { createSlipGaji, getSlipGaji, updateSlipGaji, deleteSlipGaji } = require('../controllers/slipGajiController');
const { verifyToken, isHRD } = require('../middleware/authMiddleware');

// CREATE: Tambah gaji (Wajib Login + Wajib HRD)
router.post('/', verifyToken, isHRD, createSlipGaji);

// READ: Lihat gaji (Wajib Login, akses dibedain di controller)
router.get('/', verifyToken, getSlipGaji);

// UPDATE: Edit gaji (Wajib Login + Wajib HRD)
router.put('/:id', verifyToken, isHRD, updateSlipGaji);

// DELETE: Hapus gaji (Wajib Login + Wajib HRD)
router.delete('/:id', verifyToken, isHRD, deleteSlipGaji);

module.exports = router;