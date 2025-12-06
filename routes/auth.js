const express = require('express');
const bcrypt = require('bcrypt');
const { getOne } = require('../database/db');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = await getOne(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set session
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.username = user.username;
        req.session.fullName = user.full_name;

        res.json({
            id: user.id,
            username: user.username,
            fullName: user.full_name,
            role: user.role
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Get current user
router.get('/me', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            id: req.session.userId,
            username: req.session.username,
            fullName: req.session.fullName,
            role: req.session.userRole
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

module.exports = router;
