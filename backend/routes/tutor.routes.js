const express = require('express');
const { chatWithTutor } = require('../src/controller/tutor.controller.js');

const router = express.Router();

router.post('/chat', chatWithTutor);

module.exports = router;
