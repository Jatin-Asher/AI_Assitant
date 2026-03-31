const express = require('express');
const { endSession, getProgress, updateWeeklyGoal, getAllSessions } = require('../src/controller/session.controller.js');

const router = express.Router();

router.post('/end', endSession);
router.get('/progress', getProgress);
router.patch('/goal', updateWeeklyGoal);
router.get('/all', getAllSessions);

module.exports = router;
