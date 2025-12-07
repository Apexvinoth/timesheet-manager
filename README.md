# Timesheet Manager

A modern, full-featured timesheet management application built with Node.js, Express, and SQLite. Designed for teams to track time spent on tasks with separate dashboards for employees and administrators.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## 🌟 Features

### For Employees
- ✅ **Time Entry Management**: Add, edit, and delete timesheet entries
- 📊 **Personal Dashboard**: View your own time entries and statistics
- 📈 **Weekly Summary**: See total hours worked per week
- 🎯 **Task Selection**: Choose from active tasks assigned by admins

### For Administrators
- 👥 **User Management**: Create, edit, and delete user accounts
- 📋 **Task Management**: Manage tasks with estimated hours
- 📊 **Analytics Dashboard**: 
  - View total hours across all employees
  - Hours by employee (bar chart)
  - Hours by task (doughnut chart)
  - Daily hours trend (line chart - last 14 days)
- ⏱️ **Time Tracking**: Compare estimated vs actual hours with variance indicators
- 🔍 **Timesheet Overview**: Filter and view all employee timesheets

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Apexvinoth/timesheet-manager.git
   cd timesheet-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run migrate
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Default admin credentials:
     - Username: `admin`
     - Password: `admin123`

## 📁 Project Structure

```
timesheet-app/
├── database/
│   ├── db.js              # Database connection and query helpers
│   ├── migrate.js         # Database migration script
│   └── schema.sql         # Database schema definition
├── middleware/
│   ├── admin.js           # Admin authorization middleware
│   └── auth.js            # Authentication middleware
├── public/
│   ├── css/
│   │   └── style.css      # Application styles
│   ├── js/
│   │   └── app.js         # Shared frontend utilities
│   ├── admin.html         # Admin dashboard
│   ├── dashboard.html     # Employee dashboard
│   └── index.html         # Login page
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── tasks.js           # Task management routes
│   ├── timesheet.js       # Timesheet routes
│   └── users.js           # User management routes
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies
├── README.md              # This file
└── server.js              # Express server entry point
```

## 🎨 Screenshots

### Employee Dashboard
Track your time entries and view personal statistics.

### Admin Dashboard
Comprehensive analytics and management tools for administrators.

## 🔧 Configuration

### Database
The application uses SQLite for data storage. The database file is created automatically at `database/timesheet.db` when you run the migration.

### Port Configuration
By default, the server runs on port 3000. You can change this in `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

## 📊 Database Schema

### Tables
- **users**: User accounts (employees and admins)
- **tasks**: Available tasks with estimated hours
- **timesheet_entries**: Individual time entries by employees

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tasks
- `GET /api/tasks` - List all tasks (with actual hours)
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/:id` - Update task (admin only)
- `DELETE /api/tasks/:id` - Delete task (admin only)

### Timesheets
- `GET /api/timesheet` - Get timesheet entries (filtered by user role)
- `POST /api/timesheet` - Create timesheet entry
- `PUT /api/timesheet/:id` - Update timesheet entry
- `DELETE /api/timesheet/:id` - Delete timesheet entry
- `GET /api/timesheet/analytics` - Get analytics data (admin only)

## 🎯 Key Features Explained

### Time Tracking with Variance
Admins can set **estimated hours** for each task. The system automatically calculates **actual hours** from employee entries and displays:
- 🔴 **Red ▲**: Over estimated (actual > estimated)
- 🟢 **Green ▼**: Under estimated (actual < estimated)
- ⚪ **Gray ●**: On track (actual = estimated)

### Role-Based Access Control
- **Employees**: Can only view and manage their own timesheet entries
- **Admins**: Full access to all features including user management, task management, and analytics

### Real-time Analytics
The admin dashboard provides real-time insights with interactive charts powered by Chart.js.

## 🔐 Security Features

- Password hashing with bcrypt
- Session-based authentication
- Role-based authorization middleware
- SQL injection prevention with parameterized queries

## 🚀 Deployment

### Deploy to Production

1. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

2. **Run migration**
   ```bash
   npm run migrate
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Deploy to Cloud Platforms

#### Heroku
```bash
heroku create your-app-name
git push heroku master
heroku run npm run migrate
```

#### Railway / Render
- Connect your GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`
- Add migration as a one-time job: `npm run migrate`

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vinoth**
- GitHub: [@Apexvinoth](https://github.com/Apexvinoth)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using Node.js, Express, and SQLite**
