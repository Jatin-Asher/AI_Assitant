const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/auth.routes.js');
const tutorRoutes = require('../routes/tutor.routes.js');
const sessionRoutes = require('../routes/session.routes.js');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: '12mb' }));

// test route
app.get('/', (req, res) => {
    res.send('API is running');
});
// routes
app.use('/api/auth', authRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/session', sessionRoutes);

module.exports = app;
