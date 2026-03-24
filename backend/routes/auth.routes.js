const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../src/controller/auth.controller.js');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;