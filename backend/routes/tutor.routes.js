const express = require('express');
const { chatWithTutor, transcribeAudio } = require('../src/controller/tutor.controller.js');

const router = express.Router();

router.post('/chat', chatWithTutor);
router.post('/transcribe', transcribeAudio);

module.exports = router;
