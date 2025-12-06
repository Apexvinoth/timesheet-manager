# Timesheet Application - Setup Instructions

## Prerequisites

Node.js is required to run this application. The installation failed because Node.js is not installed on your system.

## Installation Steps

1. **Install Node.js**:
   - Download Node.js from: https://nodejs.org/
   - Install the LTS (Long Term Support) version
   - This will also install npm (Node Package Manager)

2. **Install Dependencies**:
   ```bash
   cd C:\Users\Vinoth\.gemini\antigravity\scratch\timesheet-app
   npm install
   ```

3. **Start the Application**:
   ```bash
   npm start
   ```

4. **Access the Application**:
   - Open your browser and go to: http://localhost:3000
   - Login with default admin credentials:
     - Username: `admin`
     - Password: `admin123`

## Features

### For Employees:
- Log time entries for tasks
- View personal timesheet history
- View performance analytics with charts
- Track hours by task and date

### For Admins:
- Manage users (create, edit, delete)
- Configure tasks (create, edit, delete)
- View all employee timesheets
- Analyze team performance with charts:
  - Hours by employee
  - Hours by task
  - Daily hours trend
- Filter and export timesheet data

## Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Important:** Change the admin password after first login!

## Project Structure

```
timesheet-app/
├── database/
│   ├── schema.sql          # Database schema
│   ├── db.js              # Database connection
│   └── timesheet.db       # SQLite database (created on first run)
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── admin.js           # Admin authorization middleware
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── users.js           # User management routes
│   ├── tasks.js           # Task management routes
│   └── timesheet.js       # Timesheet and analytics routes
├── public/
│   ├── css/
│   │   └── style.css      # Design system and styles
│   ├── js/
│   │   └── app.js         # Shared JavaScript utilities
│   ├── index.html         # Login page
│   ├── dashboard.html     # Employee dashboard
│   └── admin.html         # Admin dashboard
├── server.js              # Main server file
└── package.json           # Dependencies and scripts
```

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite
- **Frontend**: HTML, CSS, JavaScript
- **Charts**: Chart.js
- **Authentication**: Session-based with bcrypt password hashing

## Support

For issues or questions, please refer to the implementation plan or contact your system administrator.
