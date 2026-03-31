const express = require('express');
const { protect } = require('../src/middleware/auth.middleware.js');
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
const { upload, uploadAvatar, updateProfile, deleteAccount } = require('../src/controller/user.controller.js');

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser);
router.patch('/username', updateUsername);
router.post('/forgot-password/questions', getSecurityQuestions);
router.post('/forgot-password/verify', verifySecurityAnswers);
router.post('/forgot-password/reset', resetPasswordWithSecurityQuestions);
router.post('/upload-avatar', protect, upload.single('file'), uploadAvatar);
router.put('/update', protect, updateProfile);
router.delete('/delete', protect, deleteAccount);

module.exports = router;
