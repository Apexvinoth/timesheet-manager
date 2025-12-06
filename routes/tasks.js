const express = require('express');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { runQuery, getOne, getAll } = require('../database/db');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all tasks (all authenticated users)
router.get('/', async (req, res) => {
    try {
        const tasks = await getAll(
            'SELECT * FROM tasks ORDER BY created_at DESC'
        );
        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create task (admin only)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { taskName, description, estimatedHours, status } = req.body;

        if (!taskName) {
            return res.status(400).json({ error: 'Task name required' });
        }

        const result = await runQuery(
            'INSERT INTO tasks (task_name, description, estimated_hours, status) VALUES (?, ?, ?, ?)',
            [taskName, description || '', estimatedHours || 0, status || 'active']
        );

        res.status(201).json({
            id: result.id,
            taskName,
            description,
            estimatedHours: estimatedHours || 0,
            status: status || 'active',
            message: 'Task created successfully'
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update task (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { taskName, description, estimatedHours, status } = req.body;

        const task = await getOne('SELECT * FROM tasks WHERE id = ?', [id]);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        let updateFields = [];
        let params = [];

        if (taskName) {
            updateFields.push('task_name = ?');
            params.push(taskName);
        }
        if (description !== undefined) {
            updateFields.push('description = ?');
            params.push(description);
        }
        if (estimatedHours !== undefined) {
            updateFields.push('estimated_hours = ?');
            params.push(estimatedHours);
        }
        if (status && ['active', 'inactive'].includes(status)) {
            updateFields.push('status = ?');
            params.push(status);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        params.push(id);
        await runQuery(
            `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete task (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await runQuery('DELETE FROM tasks WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
