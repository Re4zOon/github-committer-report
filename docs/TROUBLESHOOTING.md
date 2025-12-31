# Troubleshooting Guide

Common issues and their solutions for the GitLab Activity Dashboard.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database Issues](#database-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [GitLab Connection Issues](#gitlab-connection-issues)
- [Docker Issues](#docker-issues)

## Installation Issues

### npm install fails

**Problem**: Dependencies fail to install

**Solutions**:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check Node.js version:
   ```bash
   node --version  # Should be 18 or higher
   ```

4. Try using npm's legacy peer deps flag:
   ```bash
   npm install --legacy-peer-deps
   ```

### Build fails with TypeScript errors

**Problem**: `tsc` compilation errors

**Solutions**:

1. Ensure TypeScript is installed:
   ```bash
   npm install -g typescript
   ```

2. Clean build artifacts:
   ```bash
   cd backend
   rm -rf dist
   npm run build
   ```

3. Check tsconfig.json is valid:
   ```bash
   npx tsc --noEmit
   ```

## Database Issues

### Cannot connect to PostgreSQL

**Problem**: Backend fails with "ECONNREFUSED" or "connection refused"

**Solutions**:

1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows
   sc query postgresql
   ```

2. Start PostgreSQL if not running:
   ```bash
   # macOS
   brew services start postgresql@16
   
   # Linux
   sudo systemctl start postgresql
   
   # Windows
   net start postgresql-x64-16
   ```

3. Verify connection settings in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

4. Test connection manually:
   ```bash
   psql -h localhost -U postgres -d gitlab_dashboard
   ```

### Database does not exist

**Problem**: Error "database 'gitlab_dashboard' does not exist"

**Solution**: Create the database:
```bash
psql -U postgres -c "CREATE DATABASE gitlab_dashboard;"
```

### Authentication failed for user

**Problem**: Password authentication fails

**Solutions**:

1. Reset PostgreSQL password:
   ```bash
   psql -U postgres
   ALTER USER postgres PASSWORD 'postgres';
   ```

2. Update `.env` with correct password

3. Check `pg_hba.conf` authentication method (should be `md5` or `scram-sha-256`)

### Tables not created

**Problem**: Database exists but tables are missing

**Solution**: The backend automatically creates tables on startup. Check backend logs for errors:
```bash
cd backend
npm run dev
# Look for "Database initialized" message
```

## Backend Issues

### Port 3001 already in use

**Problem**: Error "EADDRINUSE: address already in use"

**Solutions**:

1. Find and kill process using port 3001:
   ```bash
   # macOS/Linux
   lsof -ti:3001 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

2. Use a different port in `.env`:
   ```env
   PORT=3002
   ```

### Module not found errors

**Problem**: "Cannot find module" errors

**Solutions**:

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Check imports use `.js` extension for local files:
   ```typescript
   import { something } from './file.js';  // Correct
   import { something } from './file';      // Wrong
   ```

### TypeScript path issues

**Problem**: Module resolution fails

**Solution**: Ensure `tsconfig.json` has correct settings:
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## Frontend Issues

### White screen / blank page

**Problem**: Frontend loads but shows nothing

**Solutions**:

1. Check browser console for errors (F12)

2. Verify backend is running:
   ```bash
   curl http://localhost:3001/health
   ```

3. Check VITE_API_URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Clear browser cache and reload

### Charts not displaying

**Problem**: Dashboard loads but charts are missing

**Solutions**:

1. Verify data is being fetched:
   - Open browser DevTools → Network tab
   - Look for requests to `/api/stats`
   - Check response contains data

2. Check for Chart.js errors in console

3. Ensure date range contains data

### CORS errors

**Problem**: "Access-Control-Allow-Origin" errors in browser console

**Solutions**:

1. Verify backend CORS middleware is configured:
   ```typescript
   app.use(cors());
   ```

2. Start backend before frontend

3. Check VITE_API_URL matches backend URL exactly

### Build fails

**Problem**: `npm run build` fails

**Solutions**:

1. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

2. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

## GitLab Connection Issues

### Invalid token error

**Problem**: "Failed to sync data from GitLab"

**Solutions**:

1. Verify token has `read_api` scope
2. Check token hasn't expired
3. Regenerate token in GitLab settings
4. Ensure no extra spaces in token

### 401 Unauthorized

**Problem**: GitLab API returns 401

**Solutions**:

1. Token is invalid or expired - create new token
2. Check GitLab URL is correct
3. For self-hosted GitLab, ensure URL is accessible

### Rate limiting

**Problem**: "429 Too Many Requests" from GitLab API

**Solutions**:

1. Wait a few minutes before retrying
2. Reduce the number of users/projects being synced
3. Use Group ID to limit scope
4. Check GitLab rate limit documentation

### No data displayed

**Problem**: Sync succeeds but dashboard shows no data

**Solutions**:

1. Check date range - ensure it covers period with activity
2. Verify users have actual commits in the period
3. Check database tables contain data:
   ```bash
   psql -U postgres -d gitlab_dashboard -c "SELECT COUNT(*) FROM events;"
   ```

4. Look at browser console and network tab for errors

## Docker Issues

### Docker containers won't start

**Problem**: `docker-compose up` fails

**Solutions**:

1. Check Docker is running:
   ```bash
   docker info
   ```

2. Rebuild containers:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

3. Check logs:
   ```bash
   docker-compose logs
   ```

### Port conflicts

**Problem**: Ports already in use

**Solutions**:

1. Change ports in `docker-compose.yml`:
   ```yaml
   services:
     frontend:
       ports:
         - "5174:5173"  # Use different external port
   ```

2. Stop conflicting services:
   ```bash
   docker ps
   docker stop <container_id>
   ```

### Database connection fails in Docker

**Problem**: Backend can't connect to PostgreSQL

**Solutions**:

1. Ensure backend waits for database:
   ```yaml
   depends_on:
     postgres:
       condition: service_healthy
   ```

2. Use service name as host in backend environment:
   ```yaml
   environment:
     DB_HOST: postgres  # Not localhost
   ```

### Volumes permission issues

**Problem**: Permission denied errors

**Solutions**:

1. On Linux, check file ownership:
   ```bash
   sudo chown -R $USER:$USER .
   ```

2. Remove volumes and recreate:
   ```bash
   docker-compose down -v
   docker-compose up
   ```

## Performance Issues

### Slow data loading

**Problem**: Dashboard takes long time to load

**Solutions**:

1. Reduce date range
2. Filter by specific users
3. Check database has indexes
4. Monitor network tab for slow requests

### High memory usage

**Problem**: Application uses too much memory

**Solutions**:

1. Limit data being fetched (smaller date range)
2. Reduce number of users being tracked
3. Clear old data from database
4. Restart application

## Getting Help

If none of these solutions work:

1. **Check logs**: Look at backend and frontend console output
2. **Enable debug mode**: Set `DEBUG=*` environment variable
3. **Browser DevTools**: Check Network and Console tabs
4. **Database queries**: Use `psql` to inspect data directly
5. **Create an issue**: [GitHub Issues](https://github.com/Re4zOon/github-committer-report/issues) with:
   - Error messages
   - Steps to reproduce
   - System information (OS, Node version, etc.)
   - Relevant logs

## Additional Resources

- [Setup Guide](./SETUP.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Contributing Guide](../CONTRIBUTING.md)
