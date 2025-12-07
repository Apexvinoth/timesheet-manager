# 🚀 Quick Render Deployment Guide

Your timesheet app is ready to deploy to Render!

## ✅ What's Ready

I've prepared everything for you:
- ✅ `render.yaml` - Automatic configuration file
- ✅ `package.json` - Updated with migrate script
- ✅ GitHub repository - Already pushed

---

## 🎯 Deploy in 5 Minutes

### Step 1: Go to Render
Visit: **https://render.com**

### Step 2: Sign Up
- Click **"Get Started"**
- Sign up with your **GitHub account**
- Authorize Render

### Step 3: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Find and connect: `Apexvinoth/timesheet-manager`
3. Render will **auto-detect** the `render.yaml` file!

### Step 4: Deploy
- Click **"Create Web Service"**
- Wait 2-3 minutes
- Done! ✅

---

## 🌐 Your App Will Be Live At

```
https://timesheet-manager.onrender.com
```

---

## 🔑 First Login

After deployment:
- Username: `admin`
- Password: `admin123`

**⚠️ Change the password immediately!**

---

## ⚠️ Important: Database Note

Your app uses **SQLite**. On Render's free tier:
- ⚠️ Data is **temporary** (lost on restart)
- ✅ Good for **testing** and **small teams**
- 💡 For production, consider:
  - Upgrading to paid tier ($7/month) for persistent storage
  - Or switching to PostgreSQL (free tier available)

---

## 💡 Keep Your App Awake (Optional)

Free tier apps sleep after 15 minutes. To keep it active:

1. **Use UptimeRobot** (free):
   - Go to: https://uptimerobot.com
   - Add your Render URL
   - Set to ping every 5 minutes

---

## 🔄 Auto-Deploy from GitHub

Render automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin master
```

Render detects the change and deploys automatically! 🎉

---

## 📊 Monitor Your App

In Render dashboard:
- **Logs**: View application logs
- **Metrics**: CPU, memory, requests
- **Events**: Deployment history

---

## 🆙 When to Upgrade

Consider upgrading to **Starter plan ($7/month)** when:
- ✅ You need persistent data storage
- ✅ App should be always-on (no sleep)
- ✅ Team grows beyond 5-10 people

---

## ✅ Deployment Checklist

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Deploy web service
- [ ] Test the app
- [ ] Change admin password
- [ ] Add team members
- [ ] Set up uptime monitoring (optional)

---

## 🎉 That's It!

Your timesheet application will be live and accessible to your team in minutes!

**Need help?** Check the full deployment guide in the artifacts.
