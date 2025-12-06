const express = require('express');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { runQuery, getOne, getAll } = require('../database/db');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get timesheet entries
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.query;

        let query = `
            SELECT 
                te.id,
                te.user_id,
                te.task_id,
                te.hours_spent,
                te.entry_date,
                te.notes,
                te.created_at,
                u.username,
                u.full_name,
                t.task_name
            FROM timesheet_entries te
            JOIN users u ON te.user_id = u.id
            JOIN tasks t ON te.task_id = t.id
            WHERE 1=1
        `;

        const params = [];

        // If not admin, only show own entries
        if (req.session.userRole !== 'admin') {
            query += ' AND te.user_id = ?';
            params.push(req.session.userId);
        } else if (userId) {
            // Admin can filter by user
            query += ' AND te.user_id = ?';
            params.push(userId);
        }

        if (startDate) {
            query += ' AND te.entry_date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND te.entry_date <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY te.entry_date DESC, te.created_at DESC';

        const entries = await getAll(query, params);
        res.json(entries);
    } catch (error) {
        console.error('Get timesheet error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get performance analytics
router.get('/analytics', async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;

        // Base query for analytics
        let userFilter = '';
        const params = [];

        if (req.session.userRole !== 'admin') {
            userFilter = 'AND te.user_id = ?';
            params.push(req.session.userId);
        } else if (userId) {
            userFilter = 'AND te.user_id = ?';
            params.push(userId);
        }

        // Add date filters
        let dateFilter = '';
        if (startDate) {
            dateFilter += ' AND te.entry_date >= ?';
            params.push(startDate);
        }
        if (endDate) {
            dateFilter += ' AND te.entry_date <= ?';
            params.push(endDate);
        }

        // Hours by task
        const hoursByTask = await getAll(`
            SELECT 
                t.task_name,
                SUM(te.hours_spent) as total_hours,
                COUNT(te.id) as entry_count
            FROM timesheet_entries te
            JOIN tasks t ON te.task_id = t.id
            WHERE 1=1 ${userFilter} ${dateFilter}
            GROUP BY t.id, t.task_name
            ORDER BY total_hours DESC
        `, params);

        // Hours by date
        const hoursByDate = await getAll(`
            SELECT 
                te.entry_date,
                SUM(te.hours_spent) as total_hours
            FROM timesheet_entries te
            WHERE 1=1 ${userFilter} ${dateFilter}
            GROUP BY te.entry_date
            ORDER BY te.entry_date ASC
        `, params);

        // Hours by user (admin only)
        let hoursByUser = [];
        if (req.session.userRole === 'admin') {
            const userParams = [];
            let userDateFilter = '';
            if (startDate) {
                userDateFilter += ' AND te.entry_date >= ?';
                userParams.push(startDate);
            }
            if (endDate) {
                userDateFilter += ' AND te.entry_date <= ?';
                userParams.push(endDate);
            }

            hoursByUser = await getAll(`
                SELECT 
                    u.full_name,
                    u.username,
                    SUM(te.hours_spent) as total_hours,
                    COUNT(DISTINCT te.entry_date) as days_worked,
                    COUNT(te.id) as entry_count
                FROM users u
                LEFT JOIN timesheet_entries te ON u.id = te.user_id ${userDateFilter}
                WHERE u.role = 'employee'
                GROUP BY u.id, u.full_name, u.username
                ORDER BY total_hours DESC
            `, userParams);
        }

        // Summary stats
        const summaryParams = [...params];
        const summary = await getOne(`
            SELECT 
                SUM(te.hours_spent) as total_hours,
                COUNT(te.id) as total_entries,
                COUNT(DISTINCT te.entry_date) as days_logged,
                COUNT(DISTINCT te.task_id) as tasks_worked
            FROM timesheet_entries te
            WHERE 1=1 ${userFilter} ${dateFilter}
        `, summaryParams);

        res.json({
            summary: summary || { total_hours: 0, total_entries: 0, days_logged: 0, tasks_worked: 0 },
            hoursByTask,
            hoursByDate,
            hoursByUser
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create timesheet entry
router.post('/', async (req, res) => {
    try {
        const { taskId, hoursSpent, entryDate, notes } = req.body;

        if (!taskId || !hoursSpent || !entryDate) {
            return res.status(400).json({ error: 'Task, hours, and date required' });
        }

        if (hoursSpent <= 0 || hoursSpent > 24) {
            return res.status(400).json({ error: 'Hours must be between 0 and 24' });
        }

        // Verify task exists
        const task = await getOne('SELECT id FROM tasks WHERE id = ?', [taskId]);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const result = await runQuery(
            'INSERT INTO timesheet_entries (user_id, task_id, hours_spent, entry_date, notes) VALUES (?, ?, ?, ?, ?)',
            [req.session.userId, taskId, hoursSpent, entryDate, notes || '']
        );

        res.status(201).json({
            id: result.id,
            message: 'Timesheet entry created successfully'
        });
    } catch (error) {
        console.error('Create timesheet error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update timesheet entry
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { taskId, hoursSpent, entryDate, notes } = req.body;

        const entry = await getOne('SELECT * FROM timesheet_entries WHERE id = ?', [id]);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        // Only allow editing own entries (unless admin)
        if (req.session.userRole !== 'admin' && entry.user_id !== req.session.userId) {
            return res.status(403).json({ error: 'Cannot edit other users entries' });
        }

        let updateFields = [];
        let params = [];

        if (taskId) {
            const task = await getOne('SELECT id FROM tasks WHERE id = ?', [taskId]);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            updateFields.push('task_id = ?');
            params.push(taskId);
        }

        if (hoursSpent !== undefined) {
            if (hoursSpent <= 0 || hoursSpent > 24) {
                return res.status(400).json({ error: 'Hours must be between 0 and 24' });
            }
            updateFields.push('hours_spent = ?');
            params.push(hoursSpent);
        }

        if (entryDate) {
            updateFields.push('entry_date = ?');
            params.push(entryDate);
        }

        if (notes !== undefined) {
            updateFields.push('notes = ?');
            params.push(notes);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        params.push(id);
        await runQuery(
            `UPDATE timesheet_entries SET ${updateFields.join(', ')} WHERE id = ?`,
            params
        );

        res.json({ message: 'Entry updated successfully' });
    } catch (error) {
        console.error('Update timesheet error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete timesheet entry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const entry = await getOne('SELECT * FROM timesheet_entries WHERE id = ?', [id]);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        // Only allow deleting own entries (unless admin)
        if (req.session.userRole !== 'admin' && entry.user_id !== req.session.userId) {
            return res.status(403).json({ error: 'Cannot delete other users entries' });
        }

        await runQuery('DELETE FROM timesheet_entries WHERE id = ?', [id]);

        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Delete timesheet error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
