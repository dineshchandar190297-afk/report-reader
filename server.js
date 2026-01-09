const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDb } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'healthcare-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Healthcare Imaging Explainer API is running' });
});

// Initialize database and start server
async function startServer() {
    try {
        // Initialize database
        await initDb();
        console.log('✅ Database ready');

        // Import routes after DB is initialized
        const authRoutes = require('./routes/auth');
        const uploadRoutes = require('./routes/upload');
        const analysisRoutes = require('./routes/analysis');
        const chatRoutes = require('./routes/chat');

        // Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/upload', uploadRoutes);
        app.use('/api/analysis', analysisRoutes);
        app.use('/api/chat', chatRoutes);

        // Serve main HTML for SPA
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Error handling
        app.use((err, req, res, next) => {
            console.error('Error:', err);
            res.status(500).json({
                success: false,
                message: 'An internal server error occurred'
            });
        });

        app.listen(PORT, () => {
            console.log(`🏥 Healthcare Imaging Explainer running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
