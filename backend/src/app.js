const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/auth.routes.js');
const tutorRoutes = require('../routes/tutor.routes.js');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
    res.send('API is running');
});
// routes
app.use('/api/auth', authRoutes);
app.use('/api/tutor', tutorRoutes);

module.exports = app;
