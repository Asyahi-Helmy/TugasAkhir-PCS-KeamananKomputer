// controllers/authController.js
const { User } = require('../models');
const { Op } = require('sequelize');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { nama_pegawai, email, password, role } = req.body;
        const userExist = await User.findOne({ where: { email } });
        if (userExist) return res.status(400).json({ message: 'Email sudah digunakan!' });

        const hashedPassword = await argon2.hash(password);
        const newUser = await User.create({ nama_pegawai, email, password: hashedPassword, role: role || 'Karyawan' });

        res.status(201).json({ message: 'Register berhasil!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body; 
        const user = await User.findOne({ 
            where: { [Op.or]: [{ email: identifier }, { nama_pegawai: identifier }] } 
        });

        if (!user) return res.status(404).json({ message: 'Akun tidak ditemukan!' });
        
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) return res.status(401).json({ message: 'Password salah!' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, role: user.role, nama_pegawai: user.nama_pegawai });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };