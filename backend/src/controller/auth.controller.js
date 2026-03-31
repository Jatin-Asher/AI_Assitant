const User = require('../../db/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const normalizeAnswer = (value = '') => value.trim().toLowerCase().replace(/\s+/g, ' ');

// REGISTER
exports.registerUser = async (req, res) => {
    try {
        let { name, email, password, securityQuestions } = req.body;

        // If data is sent via FormData, securityQuestions might be a string
        if (typeof securityQuestions === 'string') {
            try {
                securityQuestions = JSON.parse(securityQuestions);
            } catch (e) {
                return res.status(400).json({ message: "Invalid security questions format" });
            }
        }

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (!Array.isArray(securityQuestions) || securityQuestions.length !== 2) {
            return res.status(400).json({ message: "Please select and answer two security questions" });
        }

        const selectedQuestions = securityQuestions.map((item) => item.question);
        if (new Set(selectedQuestions).size !== selectedQuestions.length) {
            return res.status(400).json({ message: "Security questions must be different" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedSecurityQuestions = await Promise.all(
            securityQuestions.map(async (item) => ({
                question: item.question,
                answer: await bcrypt.hash(normalizeAnswer(item.answer), 10)
            }))
        );

        // handle avatar if uploaded
        const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : '';

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            securityQuestions: hashedSecurityQuestions,
            avatarUrl
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select('name email avatarUrl username bio preferredSubjects');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                username: user.username,
                bio: user.bio,
                preferredSubjects: user.preferredSubjects
            }
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// UPDATE USERNAME
exports.updateUsername = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email, password, and new username are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        user.name = name.trim();
        await user.save();

        res.status(200).json({
            message: "Username updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSecurityQuestions = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email }).select('securityQuestions');
        if (!user || !user.securityQuestions?.length) {
            return res.status(404).json({ message: "No recovery setup found for this email" });
        }

        return res.status(200).json({
            questions: user.securityQuestions.map((item, index) => ({
                index,
                question: item.question
            }))
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.verifySecurityAnswers = async (req, res) => {
    try {
        const { email, answers } = req.body;

        if (!email || !Array.isArray(answers) || answers.length !== 2) {
            return res.status(400).json({ message: "Email and both security answers are required" });
        }

        const user = await User.findOne({ email });
        if (!user || !user.securityQuestions?.length) {
            return res.status(400).json({ message: "Invalid recovery details" });
        }

        const comparisons = await Promise.all(
            user.securityQuestions.map((item, index) =>
                bcrypt.compare(normalizeAnswer(answers[index]?.answer || ''), item.answer)
            )
        );

        if (comparisons.includes(false)) {
            return res.status(400).json({ message: "Security answers did not match" });
        }

        const resetToken = jwt.sign(
            { id: user._id, purpose: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        return res.status(200).json({
            message: "Security answers verified",
            resetToken
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.resetPasswordWithSecurityQuestions = async (req, res) => {
    try {
        const { resetToken, password } = req.body;

        if (!resetToken || !password) {
            return res.status(400).json({ message: "Reset token and new password are required" });
        }

        const payload = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (payload.purpose !== 'password-reset') {
            return res.status(400).json({ message: "Invalid reset token" });
        }

        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(400).json({ message: "Invalid reset token" });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Reset token expired or invalid" });
    }
};
