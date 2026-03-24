const express = require('express');
const { endSession, getProgress, updateWeeklyGoal } = require('../src/controller/session.controller.js');

const router = express.Router();

router.post('/end', endSession);
router.get('/progress', getProgress);
router.patch('/goal', updateWeeklyGoal);

module.exports = router;
