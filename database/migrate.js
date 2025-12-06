const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'timesheet.db');
const db = new sqlite3.Database(dbPath);

// Add estimated_hours column to tasks table
db.run(`ALTER TABLE tasks ADD COLUMN estimated_hours REAL DEFAULT 0`, (err) => {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('Column estimated_hours already exists');
        } else {
            console.error('Error adding column:', err.message);
        }
    } else {
        console.log('Successfully added estimated_hours column to tasks table');
    }
    db.close();
});
