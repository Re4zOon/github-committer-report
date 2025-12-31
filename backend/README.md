# GitLab Dashboard Backend

Backend API server for the GitLab Activity Dashboard. Provides REST API endpoints for syncing GitLab data to PostgreSQL and retrieving dashboard statistics.

## Features

- RESTful API for GitLab data synchronization
- PostgreSQL integration for persistent storage
- Automatic database schema initialization
- User, event, commit, and project data management

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the backend directory:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gitlab_dashboard
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
```

## Running

### Development Mode

```bash
npm run dev
```

This starts the server with hot-reload using tsx.

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/sync

Sync data from GitLab to the database.

**Request Body:**
```json
{
  "baseUrl": "https://gitlab.com",
  "privateToken": "your-token",
  "groupId": "optional-group-id",
  "projectId": "optional-project-id",
  "since": "2024-01-01T00:00:00Z",
  "until": "2024-12-31T23:59:59Z"
}
```

### GET /api/users

Get all users from the database.

### GET /api/events

Get events with optional filters.

**Query Parameters:**
- `since`: ISO date string
- `until`: ISO date string
- `userId`: User ID

### GET /api/projects

Get all projects from the database.

### GET /api/stats

Get dashboard statistics.

**Query Parameters:**
- `since`: ISO date string (default: 30 days ago)
- `until`: ISO date string (default: now)

### GET /health

Health check endpoint.

## Database Schema

The backend automatically creates the following tables on startup:

- **users**: GitLab user information
- **events**: User events (pushes, etc.)
- **commits**: Commit details with stats
- **projects**: Project/repository information

All tables include appropriate indexes for query performance.

## Technologies

- Node.js
- Express
- TypeScript
- PostgreSQL (pg)
- Axios (for GitLab API calls)
