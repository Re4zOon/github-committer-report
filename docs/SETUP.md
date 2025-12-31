# Setup Guide

This guide will walk you through setting up the GitLab Activity Dashboard on your local machine or server.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** 9 or higher (comes with Node.js)
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))

### Optional (for Docker setup)
- **Docker** 20.10 or higher ([Download](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0 or higher (included with Docker Desktop)

### GitLab Requirements
- GitLab account (gitlab.com or self-hosted instance)
- Personal Access Token with `read_api` scope

## Quick Start with Docker

The fastest way to get started is using Docker Compose. This method automatically sets up PostgreSQL, the backend API, and the frontend dashboard.

### Step 1: Clone the Repository

```bash
git clone https://github.com/Re4zOon/github-committer-report.git
cd github-committer-report
```

### Step 2: Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

The default values should work for local development:

```env
# Backend environment variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gitlab_dashboard
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001

# Frontend environment variables  
VITE_API_URL=http://localhost:3001
```

### Step 3: Start All Services

```bash
docker-compose up -d
```

This command will:
- Download required Docker images
- Create a PostgreSQL database container
- Build and start the backend API container
- Build and start the frontend dashboard container

### Step 4: Access the Dashboard

Open your browser and navigate to:
```
http://localhost:5173
```

The dashboard should now be running! 🎉

### Step 5: Configure GitLab Connection

On the dashboard homepage:

1. **GitLab URL**: Enter your GitLab instance URL (default: `https://gitlab.com`)
2. **Private Token**: Enter your GitLab Personal Access Token
3. **Group ID** (optional): Enter a specific group ID to analyze
4. **Project ID** (optional): Enter a specific project ID to analyze
5. Click **Connect to GitLab**

### Stopping Services

To stop all services:

```bash
docker-compose down
```

To stop and remove all data (including database):

```bash
docker-compose down -v
```

## Manual Installation

If you prefer to run services manually without Docker:

### Step 1: Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE gitlab_dashboard;

# Exit
\q
```

### Step 3: Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp ../.env.example .env

# Edit .env with your PostgreSQL credentials
# Update DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD if needed

# Start backend in development mode
npm run dev
```

The backend will run on `http://localhost:3001` by default.

### Step 4: Set Up Frontend

Open a new terminal:

```bash
cd dashboard

# Install dependencies
npm install

# Start frontend in development mode
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

### Step 5: Verify Installation

1. Check backend health:
   ```bash
   curl http://localhost:3001/health
   ```
   
   Expected response:
   ```json
   {"status":"ok","timestamp":"2024-01-15T10:30:00.000Z"}
   ```

2. Open the frontend in your browser:
   ```
   http://localhost:5173
   ```

## Configuration

### GitLab Personal Access Token

To create a GitLab Personal Access Token:

1. Sign in to GitLab
2. Navigate to **Settings** → **Access Tokens**
3. Click **Add new token**
4. Name your token (e.g., "Dashboard Access")
5. Select the `read_api` scope
6. Set an expiration date (optional)
7. Click **Create personal access token**
8. Copy the token (you won't see it again!)

### Environment Variables

#### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `gitlab_dashboard` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `PORT` | Backend API port | `3001` |

#### Frontend (dashboard/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |

### Database Configuration

The database schema is automatically created when the backend starts. The schema includes:

- **users**: GitLab user information
- **events**: User events (pushes, commits, etc.)
- **commits**: Detailed commit information
- **projects**: GitLab projects/repositories

## Running Tests

### Backend Tests

```bash
cd backend

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Frontend Tests

```bash
cd dashboard

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### All Tests

To run all tests from the root directory:

```bash
# Backend tests
(cd backend && npm test)

# Frontend tests
(cd dashboard && npm test)
```

## Building for Production

### Backend

```bash
cd backend

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

The compiled files will be in the `dist/` directory.

### Frontend

```bash
cd dashboard

# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory, ready to be deployed to a static hosting service.

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## Next Steps

- Read the [API Documentation](./API.md) to understand available endpoints
- Check the [Architecture Guide](./ARCHITECTURE.md) to understand the system design
- See [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute to the project

## Support

If you encounter any issues not covered in this guide:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Search existing [GitHub Issues](https://github.com/Re4zOon/github-committer-report/issues)
3. Create a new issue with detailed information about your problem
