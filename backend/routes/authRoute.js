// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Endpoint untuk registrasi: POST http://localhost:3000/auth/register
router.post('/register', register);

// Endpoint untuk login: POST http://localhost:3000/auth/login
router.post('/login', login);

module.exports = router;