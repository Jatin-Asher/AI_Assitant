const User = require('../../db/user.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Session = require('../../db/session');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public/uploads/avatars');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (jpg/png/webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG and WEBP are allowed.'), false);
  }
};

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter
});

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id; // From auth middleware
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      url: avatarUrl,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, bio, preferredSubjects } = req.body;

    // Check if username is taken (if changed)
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        username, 
        bio, 
        preferredSubjects 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
/**
 * @desc    Delete user account and all associated data
 * @route   DELETE /api/auth/delete
 * @access  Private
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Delete all user sessions
    await Session.deleteMany({ user: userId });

    // 2. Delete user profile photo if exists
    const user = await User.findById(userId);
    if (user && user.avatarUrl) {
      const filePath = path.join(__dirname, '../../public', user.avatarUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 3. Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account and all associated data have been permanently deleted.'
    });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account.',
      error: error.message
    });
  }
};
