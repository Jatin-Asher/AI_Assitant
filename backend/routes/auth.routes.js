const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUsername,
  getSecurityQuestions,
  verifySecurityAnswers,
  resetPasswordWithSecurityQuestions
} = require('../src/controller/auth.controller.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser);
router.patch('/username', updateUsername);
router.post('/forgot-password/questions', getSecurityQuestions);
router.post('/forgot-password/verify', verifySecurityAnswers);
router.post('/forgot-password/reset', resetPasswordWithSecurityQuestions);

module.exports = router;
