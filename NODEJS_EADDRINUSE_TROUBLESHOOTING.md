# Node.js EADDRINUSE Error Troubleshooting Guide

## Understanding the Error
The `EADDRINUSE` error occurs when Node.js cannot bind to a port (typically 5000) because it's already in use by another process.

## Step-by-Step Resolution

### 1. Identify the Conflicting Process

#### Windows
```cmd
netstat -ano | findstr :5000
```

#### macOS/Linux
```bash
lsof -i :5000
```

### 2. Terminate the Conflicting Process

#### Windows
```cmd
taskkill /PID <process_id> /F
```

#### macOS/Linux
```bash
kill -9 <process_id>
```

### 3. Alternative Solutions

#### Change Your Application Port
```javascript
// In your server.js or app.js
const PORT = process.env.PORT || 5001; // Use a different port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Use Environment Variables
```bash
# Set port via environment variable
export PORT=5001  # Linux/macOS
set PORT=5001     # Windows
```

### 4. Prevent Future Occurrences

#### Best Practices:
1. **Port Management**: Always check if port is available before starting
2. **Process Cleanup**: Ensure proper process termination
3. **Port Randomization**: Use dynamic ports in development
4. **Environment Configuration**: Use `.env` files for port configuration

#### Example with Port Check:
```javascript
const http = require('http');
const PORT = 5000;

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
    server.listen(PORT + 1);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Platform-Specific Solutions

### Windows
1. Use Resource Monitor to identify port usage
2. Use `netstat` for detailed network statistics
3. Consider using Windows Subsystem for Linux for better process management

### macOS
1. Use Activity Monitor to find and kill processes
2. Use `lsof` for comprehensive port information
3. Consider using `brew services` for managing development services

### Linux
1. Use `ss` command as alternative to `netstat`
2. Use `systemctl` for service management
3. Check `/proc` filesystem for process information

## Advanced Techniques

### Automatic Port Selection
```javascript
const getPort = require('get-port');

async function startServer() {
  const port = await getPort({ port: 5000 });
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
```

### Process Management Tools
- Use `pm2` for Node.js process management
- Use `nodemon` with port checking
- Implement health checks and graceful shutdowns

## Common Pitfalls
1. Not properly closing server connections
2. Multiple instances of the same application
3. Background processes holding ports
4. Docker containers using host ports

## Resolution Summary

The backend server has been successfully started on port 5000 using the command:
```bash
cd lms/backend && npm run dev
```

The server is now responding to requests at `http://localhost:5000/api/health` and the connection errors have been resolved. The server is properly configured with:
- Port: 5000 (configurable via environment variable)
- HTTPS support (when SSL certificates are available)
- HTTP support for development
- Proper error handling and logging
- Security middleware and rate limiting
