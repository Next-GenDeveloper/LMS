# 🚀 How to Start & Stop LMS Project

## ✅ Starting the Project

### **Method 1: Start Everything Together (Recommended)**
```powershell
# Root directory se run karo
npm run dev
```

This will start:
- 🔵 Backend on http://localhost:5000
- 🟣 Frontend on http://localhost:3000

---

## ❌ Stopping the Project (IMPORTANT!)

### **Method 1: Ctrl + C (Best Way)**
Terminal mein jahan `npm run dev` chal raha hai, `Ctrl + C` press karo.

### **Method 2: Kill All Node Processes**
```powershell
Get-Process -Name node | Stop-Process -Force
```

### **Method 3: Kill Specific Ports**
```powershell
# Find process using port
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

# Kill processes
Stop-Process -Id $port3000.OwningProcess -Force
Stop-Process -Id $port5000.OwningProcess -Force
```

---

## 🔧 Troubleshooting: Port Already in Use

### **Complete Clean Start Process:**

```powershell
# Step 1: Kill all node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Step 2: Wait 2 seconds
Start-Sleep -Seconds 2

# Step 3: Verify ports are free
Test-NetConnection localhost -Port 3000
Test-NetConnection localhost -Port 5000

# Step 4: Clean Next.js cache
Remove-Item -Path "lms/.next" -Recurse -Force -ErrorAction SilentlyContinue

# Step 5: Start fresh
npm run dev
```

---

## 📋 Quick Check Commands

### Check if Servers are Running
```powershell
# Check ports
Test-NetConnection localhost -Port 3000
Test-NetConnection localhost -Port 5000

# Check node processes
Get-Process -Name node

# Check what's using ports
netstat -ano | findstr ":3000 :5000"
```

### Test Backend API
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/health -UseBasicParsing
```

### Test Frontend
Open browser: http://localhost:3000

---

## 🐳 Docker Containers

### Check Docker Status
```powershell
docker ps
```

### Start Docker Containers (if stopped)
```powershell
docker start lms-postgres lms-mongodb
```

### Stop Docker Containers
```powershell
docker stop lms-postgres lms-mongodb
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Port 3000/5000 Already in Use
**Solution:**
```powershell
Get-Process -Name node | Stop-Process -Force
Remove-Item -Path "lms/.next" -Recurse -Force
npm run dev
```

### Issue 2: Lock File Exists (.next/dev/lock)
**Solution:**
```powershell
Remove-Item -Path "lms/.next" -Recurse -Force
npm run dev
```

### Issue 3: Database Connection Error
**Solution:**
```powershell
# Check Docker containers are running
docker ps

# If not running, start them
docker start lms-postgres lms-mongodb
```

### Issue 4: Multiple Node Processes
**Solution:**
```powershell
# View all node processes
Get-Process -Name node

# Kill all
Get-Process -Name node | Stop-Process -Force
```

---

## 📝 Daily Workflow

### Morning - Start Work
```powershell
# 1. Start Docker containers (if not auto-started)
docker start lms-postgres lms-mongodb

# 2. Start dev servers
npm run dev

# 3. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api/health
```

### Evening - Stop Work
```powershell
# 1. Stop dev servers (Ctrl + C in terminal)

# 2. Optional: Stop Docker containers (saves resources)
docker stop lms-postgres lms-mongodb
```

---

## 🎯 Pro Tips

1. **Always use Ctrl + C to stop servers** - cleanest way
2. **If stuck, kill all node processes** - fresh start
3. **Clean .next cache** if frontend behaves weird
4. **Check Docker first** if database errors occur
5. **Use separate terminals** for better log visibility

---

## 🚨 Emergency Reset (Nuclear Option)

If nothing works:
```powershell
# 1. Kill everything
Get-Process -Name node | Stop-Process -Force

# 2. Clean all caches
Remove-Item -Path "lms/.next" -Recurse -Force
Remove-Item -Path "lms/node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Restart Docker containers
docker restart lms-postgres lms-mongodb

# 4. Fresh start
npm run dev
```

---

**Remember:** `Ctrl + C` is your friend! ✨
