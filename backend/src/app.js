const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('../routes/auth.routes.js');
const tutorRoutes = require('../routes/tutor.routes.js');
const sessionRoutes = require('../routes/session.routes.js');
const app = express();

// middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// test route
app.get('/', (req, res) => {
    res.send('API is running');
});
// routes
app.use('/api/auth', authRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/session', sessionRoutes);

app.use((err, req, res, next) => {
    console.error('[SERVER ERROR]', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
