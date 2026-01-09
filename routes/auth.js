const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');

// Password validation
const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 8;

    return {
        valid: hasUppercase && hasNumber && hasSpecial && minLength,
        errors: { hasUppercase, hasNumber, hasSpecial, minLength }
    };
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, mobile, dateOfBirth, gender, password, confirmPassword, role } = req.body;
        const db = getDb();

        if (!username || !email || !mobile || !dateOfBirth || !gender || !password || !role) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ success: false, message: 'Password does not meet requirements' });
        }

        if (!['patient', 'clinician'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role selected' });
        }

        const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const userId = uuidv4();

        db.prepare(`INSERT INTO users (id, username, email, mobile, date_of_birth, gender, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(userId, username, email, mobile, dateOfBirth, gender, hashedPassword, role);

        res.status(201).json({ success: true, message: 'Account created successfully', userId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Failed to create account' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDb();

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const sessionToken = uuidv4();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        db.prepare(`INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`).run(uuidv4(), user.id, sessionToken, expiresAt);

        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.token = sessionToken;

        res.json({
            success: true,
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email, role: user.role, preferredLanguage: user.preferred_language },
            token: sessionToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    try {
        const db = getDb();
        if (req.session.token) {
            db.prepare('DELETE FROM sessions WHERE token = ?').run(req.session.token);
        }
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
            res.json({ success: true, message: 'Logged out successfully' });
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Logout failed' });
    }
});

// Get current user
router.get('/me', (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const db = getDb();
        const user = db.prepare('SELECT id, username, email, role, preferred_language FROM users WHERE id = ?').get(req.session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role, preferredLanguage: user.preferred_language } });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Failed to get user' });
    }
});

// Update language preference
router.put('/language', (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const { language } = req.body;
        if (!['english', 'tamil', 'hindi'].includes(language)) {
            return res.status(400).json({ success: false, message: 'Invalid language' });
        }
        const db = getDb();
        db.prepare('UPDATE users SET preferred_language = ? WHERE id = ?').run(language, req.session.userId);
        res.json({ success: true, message: 'Language preference updated' });
    } catch (error) {
        console.error('Update language error:', error);
        res.status(500).json({ success: false, message: 'Failed to update language' });
    }
});

// Forgot password
router.post('/forgot-password', (req, res) => {
    res.json({ success: true, message: 'If an account exists with this email, a password reset link will be sent.' });
});

module.exports = router;
