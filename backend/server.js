require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./db/connect.js');

const startServer = async () => {
    await connectDB();
    
    const PORT = process.env.PORT || 5001;
    console.log('[DEBUG] process.env.PORT:', process.env.PORT);
    console.log('[DEBUG] Final PORT:', PORT);
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});