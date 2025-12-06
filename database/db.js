const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'timesheet.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        
        db.exec(schema, (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            // Create default admin user if not exists
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            db.run(
                `INSERT OR IGNORE INTO users (username, password, full_name, role) 
                 VALUES (?, ?, ?, ?)`,
                ['admin', hashedPassword, 'Administrator', 'admin'],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Database initialized successfully');
                        resolve();
                    }
                }
            );
        });
    });
}

// Helper function to run queries
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

// Helper function to get single row
function getOne(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Helper function to get all rows
function getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

module.exports = {
    db,
    initializeDatabase,
    runQuery,
    getOne,
    getAll
};
