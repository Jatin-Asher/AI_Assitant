const express = require('express');
const { endSession } = require('../src/controller/session.controller.js');

const router = express.Router();

router.post('/end', endSession);

module.exports = router;
