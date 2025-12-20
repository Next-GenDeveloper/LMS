# 🚀 Quick Start Guide - LMS Project

## ✅ Everything is Ready!

Your LMS project is fully configured and tested. Both frontend and backend are working perfectly!

---

## 🎯 Start Development (Single Command)

### **From Root Directory:**
```powershell
npm run dev
```

This will start:
- 🔵 **Backend** on `http://localhost:5000`
- 🟣 **Frontend** on `http://localhost:3000`

Both will run simultaneously with colored logs!

---

## 🌐 Access URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | ✅ Working |
| **Backend API** | http://localhost:5000 | ✅ Working |
| **Health Check** | http://localhost:5000/api/health | ✅ Working |

---

## 🐳 Docker Containers

| Database | Container Name | Port | Status |
|----------|---------------|------|--------|
| **PostgreSQL** | `lms-postgres` | 5432 | ✅ Running |
| **MongoDB** | `lms-mongodb` | 27017 | ✅ Running |

Check containers: `docker ps`

---

## 📂 Project Structure

```
LMS-main/
├── package.json              # ⭐ Run "npm run dev" here
├── lms/
│   ├── .env.local           # Frontend environment variables
│   ├── package.json         # Frontend (Next.js)
│   └── backend/
│       ├── .env             # Backend environment variables
│       └── package.json     # Backend (Express + TypeScript)
```

---

## ⚡ Individual Commands

### Backend Only
```powershell
npm run dev:backend
# or
cd lms/backend
npm run dev
```

### Frontend Only
```powershell
npm run dev:frontend
# or
cd lms
npm run dev
```

---

## 🛠️ Useful Commands

### Stop All Servers
Press `Ctrl + C` in terminal or:
```powershell
Get-Process -Name node | Stop-Process -Force
```

### View Docker Containers
```powershell
docker ps
```

### Stop Docker Containers
```powershell
docker stop lms-postgres lms-mongodb
```

### Start Docker Containers
```powershell
docker start lms-postgres lms-mongodb
```

---

## 📝 Environment Variables

### Backend (`.env` in `lms/backend/`)
- ✅ MongoDB: `mongodb://localhost:27017/lms`
- ✅ PostgreSQL: `postgresql://postgres:yourpassword@localhost:5432/lmsdb`
- ✅ JWT Secret: Configured
- ⚠️ **Update PostgreSQL password if different**

### Frontend (`.env.local` in `lms/`)
- ✅ API URL: `http://localhost:5000`
- Optional: Add NEXTAUTH_SECRET, Uploadthing keys

---

## 🎓 What's Configured?

✅ TypeScript backend with tsx (faster than ts-node)  
✅ MongoDB Docker container  
✅ PostgreSQL Docker container  
✅ Concurrent execution (both frontend & backend)  
✅ Environment variables  
✅ Health check endpoint  
✅ Proper folder structure  

---

## 📚 Additional Documentation

- `SETUP_GUIDE.md` - Detailed setup instructions
- `DOCKER_CONTAINERS.md` - Docker management guide
- `README.md` - Original project README

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Database Connection Error
```powershell
# Check Docker containers
docker ps

# View logs
docker logs lms-postgres
docker logs lms-mongodb
```

---

## 🎉 You're All Set!

Just run `npm run dev` from the root directory and start coding!

**Happy Development! 🚀**
