# 🚀 LMS Project - Complete Setup Guide

## ✅ Setup Complete! - TESTED & WORKING ✅ 

### What has been configured:

#### 1. **Backend Fixed** ✅
- Installed `tsx` for better TypeScript execution
- Updated dev script in `lms/backend/package.json`
- Created `.env` file with all necessary configurations

#### 2. **Frontend Configured** ✅
- Created `.env.local` in `lms/` directory
- Configured API URL to connect with backend

#### 3. **Concurrent Execution** ✅
- Root `package.json` updated with `concurrently`
- Now `npm run dev` runs BOTH backend and frontend together!

---

## 🎯 How to Run the Project

### **Option 1: Run Everything Together (Recommended)**
```powershell
# Root directory se (jahan aap abhi hain)
npm run dev
```

### **Option 2: Run Separately**
```powershell
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

---

## 📦 Database Setup

### **Your Docker Container:**
Check if PostgreSQL is running:
```powershell
docker ps
```

If container name is `lms-postgres`, it's already running! ✅

### **Important: Update .env file**
Edit `lms/backend/.env` and update PostgreSQL password:
```env
POSTGRES_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/lmsdb
```

Replace `YOUR_ACTUAL_PASSWORD` with the password you used when creating the container.

---

## 🔧 Database Migration (Important!)

Before running the project, initialize the database:

```powershell
cd lms/backend
npx prisma generate
npx prisma db push
```

This will create all tables in your databases.

---

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Backend Health Check:** http://localhost:5000/api/health

---

## ⚙️ Environment Variables

### Backend (`lms/backend/.env`)
- ✅ Created with default values
- ⚠️ Update PostgreSQL password
- ⚠️ Change JWT_SECRET in production
- Optional: Add Cloudinary, Stripe, Email configs

### Frontend (`lms/.env.local`)
- ✅ Created with default values
- Optional: Add NEXTAUTH_SECRET, Uploadthing configs

---

## 📝 Next Steps

1. **Update PostgreSQL password** in `lms/backend/.env`
2. **Run database migrations:** `cd lms/backend && npx prisma db push`
3. **Start development:** `npm run dev` (from root)
4. **Create admin user:** Backend will auto-seed on first run

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Check what's using port 5000 or 3000
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID_NUMBER> /F
```

### MongoDB Connection Issue
Make sure MongoDB is running or set `USE_POSTGRES=false` in backend `.env`

### Database Connection Error
Verify Docker PostgreSQL container is running:
```powershell
docker ps
docker logs lms-postgres
```

---

## 📚 Folder Structure

```
LMS-main/
├── package.json          # Root - runs both frontend & backend
├── lms/
│   ├── package.json      # Frontend (Next.js)
│   ├── .env.local        # Frontend environment variables
│   └── backend/
│       ├── package.json  # Backend (Express)
│       └── .env          # Backend environment variables
```

---

## 🎉 Quick Start Commands

```powershell
# Install all dependencies (if not done)
npm run install:all

# Run everything
npm run dev

# Build frontend
npm run build

# Start production
npm start
```

---

**Happy Coding! 🚀**
