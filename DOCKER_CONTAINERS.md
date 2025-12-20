# 🐳 Docker Containers - LMS Project

## Running Containers ✅

### 1. **PostgreSQL Database**
- **Container Name:** `lms-postgres`
- **Port:** `5432`
- **Connection String:** `postgresql://postgres:yourpassword@localhost:5432/lmsdb`
- **Status:** ✅ Running

### 2. **MongoDB Database**
- **Container Name:** `lms-mongodb`
- **Port:** `27017`
- **Connection String:** `mongodb://localhost:27017/lms`
- **Status:** ✅ Running

---

## Container Management Commands

### View Running Containers
```powershell
docker ps
```

### Stop Containers
```powershell
docker stop lms-postgres lms-mongodb
```

### Start Containers
```powershell
docker start lms-postgres lms-mongodb
```

### Remove Containers (⚠️ Deletes data!)
```powershell
docker rm -f lms-postgres lms-mongodb
```

### View Container Logs
```powershell
# PostgreSQL logs
docker logs lms-postgres

# MongoDB logs
docker logs lms-mongodb
```

### Access Container Shell
```powershell
# PostgreSQL
docker exec -it lms-postgres psql -U postgres -d lmsdb

# MongoDB
docker exec -it lms-mongodb mongosh
```

---

## Backup & Restore

### PostgreSQL Backup
```powershell
docker exec lms-postgres pg_dump -U postgres lmsdb > backup.sql
```

### MongoDB Backup
```powershell
docker exec lms-mongodb mongodump --db lms --out /backup
```

---

## Troubleshooting

### Port Already in Use
```powershell
# Check what's using the port
netstat -ano | findstr :5432
netstat -ano | findstr :27017

# Kill the process
taskkill /PID <PID_NUMBER> /F
```

### Container Won't Start
```powershell
# Check logs
docker logs lms-postgres
docker logs lms-mongodb

# Remove and recreate
docker rm -f lms-postgres
docker run --name lms-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=lmsdb -p 5432:5432 -d postgres
```

---

**Note:** These containers will persist data even after stopping. They will restart automatically unless explicitly removed.
