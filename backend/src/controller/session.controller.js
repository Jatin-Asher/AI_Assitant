const jwt = require('jsonwebtoken');
const Session = require('../../db/session.js');
const User = require('../../db/user.js');

const SUBJECTS = ['Physics', 'Math', 'Chemistry', 'Biology'];

const getUserIdFromRequest = (req) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        throw new Error('Authorization token is required');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id;
};

const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
};

const calculateFocusStreak = (sessions) => {
    const sessionDays = new Set(
        sessions.map((session) => new Date(session.updatedAt).toISOString().slice(0, 10))
    );

    let streak = 0;
    const cursor = new Date();

    while (true) {
        const key = cursor.toISOString().slice(0, 10);
        if (!sessionDays.has(key)) {
            break;
        }

        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
};

const buildStudyHours = (sessions) => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const startOfWeek = getStartOfWeek();
    const hoursByDay = new Array(7).fill(0);

    sessions.forEach((session) => {
        const updatedAt = new Date(session.updatedAt);
        if (updatedAt < startOfWeek) {
            return;
        }

        const dayIndex = (updatedAt.getDay() + 6) % 7;
        hoursByDay[dayIndex] += session.timeSpent / 3600;
    });

    return labels.map((label, index) => ({
        label,
        hours: Number(hoursByDay[index].toFixed(1))
    }));
};

const buildSubjectMastery = (sessions) => {
    const totals = SUBJECTS.reduce((accumulator, subject) => {
        accumulator[subject] = 0;
        return accumulator;
    }, {});

    sessions.forEach((session) => {
        if (totals[session.subject] !== undefined) {
            totals[session.subject] += session.timeSpent;
        }
    });

    return SUBJECTS.map((subject) => {
        const hours = totals[subject] / 3600;
        const mastery = Math.min(95, Math.round(hours * 18) + (hours > 0 ? 20 : 0));
        return {
            subject,
            mastery
        };
    });
};

exports.endSession = async (req, res) => {
    try {
        const userId = getUserIdFromRequest(req);
        const {
            sessionId,
            timeSpent,
            subject,
            recentQuestion = '',
            preview = ''
        } = req.body || {};

        if (!sessionId || typeof timeSpent !== 'number' || !subject) {
            return res.status(400).json({ message: 'sessionId, subject, and numeric timeSpent are required.' });
        }

        const session = await Session.findOneAndUpdate(
            { user: userId, sessionId },
            {
                user: userId,
                sessionId,
                subject,
                timeSpent,
                recentQuestion,
                preview
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        return res.status(200).json({
            message: 'Session saved successfully.',
            session
        });
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Unable to save session.' });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const userId = getUserIdFromRequest(req);
        const user = await User.findById(userId).select('weeklyGoalHours').lean();
        const sessions = await Session.find({ user: userId }).sort({ updatedAt: -1 }).lean();

        const totalSessions = sessions.length;
        const totalSeconds = sessions.reduce((sum, session) => sum + session.timeSpent, 0);
        const weeklyHours = sessions
            .filter((session) => new Date(session.updatedAt) >= getStartOfWeek())
            .reduce((sum, session) => sum + session.timeSpent, 0) / 3600;
        const conceptsMastered = Math.max(0, Math.round(totalSeconds / 900));
        const focusStreak = calculateFocusStreak(sessions);
        const weeklyGoalHours = user?.weeklyGoalHours || 17;

        return res.status(200).json({
            summary: {
                totalSessions,
                weeklyGoal: `${weeklyHours.toFixed(1)}/${weeklyGoalHours}h`,
                weeklyGoalHours,
                conceptsMastered,
                focusStreak: `${focusStreak} Days`
            },
            studyHours: buildStudyHours(sessions),
            subjectMastery: buildSubjectMastery(sessions),
            insight: totalSeconds > 0
                ? "You're building strong momentum. Keep showing up for short focused sessions and your mastery bars will keep climbing."
                : "Start a guided study session to unlock your learning progress and subject mastery insights.",
            recentSessions: sessions.slice(0, 5)
        });
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Unable to load progress.' });
    }
};

exports.updateWeeklyGoal = async (req, res) => {
    try {
        const userId = getUserIdFromRequest(req);
        const { weeklyGoalHours } = req.body || {};

        if (typeof weeklyGoalHours !== 'number' || weeklyGoalHours <= 0) {
            return res.status(400).json({ message: 'Please provide a valid weekly goal in hours.' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { weeklyGoalHours },
            { new: true }
        ).select('weeklyGoalHours');

        return res.status(200).json({
            message: 'Weekly goal updated successfully.',
            weeklyGoalHours: user.weeklyGoalHours
        });
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Unable to update weekly goal.' });
    }
};
