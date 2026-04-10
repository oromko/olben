# Family Medium Clinic System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Docker (Easiest)

```bash
# Clone and enter the project
cd clinic-system

# Copy environment file
cp .env.example .env

# Start everything with one command
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Option 2: Manual Setup

```bash
# Install backend
cd backend
npm install
npm start

# In a new terminal, install frontend
cd frontend
npm install
npm start
```

## 📋 Default Credentials

After setup, you can login with:
- Email: `admin@clinic.com`
- Password: Create your own via registration

## 🔧 Quick Configuration

Edit `.env` file to change:
- Database credentials
- Server port
- JWT secret

## 📖 Full Documentation

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🆘 Need Help?

Common issues:
1. Port already in use? Change PORT in `.env`
2. Database connection failed? Check MySQL is running
3. Frontend won't load? Clear browser cache

---

**Enjoy using Family Medium Clinic System!** 🏥
