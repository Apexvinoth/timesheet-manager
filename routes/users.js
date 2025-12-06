const express = require('express');
const bcrypt = require('bcrypt');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { runQuery, getOne, getAll } = require('../database/db');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
    try {
        const users = await getAll(
            'SELECT id, username, full_name, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create user (admin only)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { username, password, fullName, role } = req.body;

        if (!username || !password || !fullName || !role) {
            return res.status(400).json({ error: 'All fields required' });
        }

        if (!['admin', 'employee'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Check if username exists
        const existing = await getOne('SELECT id FROM users WHERE username = ?', [username]);
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await runQuery(
            'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, fullName, role]
        );

        res.status(201).json({
            id: result.id,
            username,
            fullName,
            role,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, fullName, role } = req.body;

        const user = await getOne('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let updateFields = [];
        let params = [];

        if (username) {
            updateFields.push('username = ?');
            params.push(username);
        }
        if (fullName) {
            updateFields.push('full_name = ?');
            params.push(fullName);
        }
        if (role && ['admin', 'employee'].includes(role)) {
            updateFields.push('role = ?');
            params.push(role);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            params.push(hashedPassword);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        params.push(id);
        await runQuery(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (parseInt(id) === req.session.userId) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const result = await runQuery('DELETE FROM users WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
