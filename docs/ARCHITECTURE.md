# GitLab Activity Dashboard - Architecture

## Overview

The GitLab Activity Dashboard is a full-stack web application that provides comprehensive analytics and visualization of GitLab activity. It follows a modern three-tier architecture with clear separation of concerns.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │   React Frontend (Dashboard)                           │    │
│  │   - Interactive Charts (Chart.js)                      │    │
│  │   - Real-time Data Visualization                       │    │
│  │   - Date Range Filtering                               │    │
│  │   - User Management                                    │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │   Express.js Backend API                               │    │
│  │   - GitLab API Integration                             │    │
│  │   - Data Synchronization                               │    │
│  │   - Statistics Calculation                             │    │
│  │   - RESTful Endpoints                                  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕ SQL Queries
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │   PostgreSQL Database                                  │    │
│  │   - Users Table                                        │    │
│  │   - Events Table                                       │    │
│  │   - Commits Table                                      │    │
│  │   - Projects Table                                     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### Frontend (Dashboard)

**Technology Stack:**
- React 19 with TypeScript
- Vite for build tooling
- Chart.js for data visualization
- Axios for API communication
- date-fns for date manipulation

**Key Features:**
- Server-side data fetching
- Interactive charts with zoom/pan
- Real-time loading indicators
- Responsive design
- Dark theme UI

**Directory Structure:**
```
dashboard/
├── src/
│   ├── components/        # React components
│   │   ├── ActivityHeatmap.tsx
│   │   ├── ConfigForm.tsx
│   │   ├── ContributorLeaderboard.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── ProjectBreakdown.tsx
│   │   ├── StatsCards.tsx
│   │   ├── TimelineChart.tsx
│   │   └── UserFilter.tsx
│   ├── services/          # API services
│   │   ├── backendApi.service.ts
│   │   ├── gitlabService.ts
│   │   └── mockData.ts
│   ├── types/             # TypeScript definitions
│   └── __tests__/         # Unit tests
├── public/                # Static assets
└── package.json
```

### Backend (API Server)

**Technology Stack:**
- Node.js with Express
- TypeScript for type safety
- PostgreSQL (via pg library)
- Axios for GitLab API calls
- dotenv for configuration

**Key Features:**
- RESTful API design
- GitLab API integration
- Data persistence
- Statistics calculation
- CORS support

**Directory Structure:**
```
backend/
├── src/
│   ├── config/            # Configuration
│   │   └── database.ts
│   ├── routes/            # API routes
│   │   └── api.ts
│   ├── services/          # Business logic
│   │   ├── database.service.ts
│   │   └── gitlab.service.ts
│   ├── types/             # TypeScript definitions
│   │   └── gitlab.ts
│   ├── __tests__/         # Unit tests
│   └── index.ts           # Application entry point
└── package.json
```

### Database (PostgreSQL)

**Schema Design:**

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  state VARCHAR(50),
  avatar_url TEXT,
  web_url TEXT,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Events Table
```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  project_id INTEGER,
  action_name VARCHAR(255),
  target_id INTEGER,
  target_type VARCHAR(100),
  target_title TEXT,
  created_at TIMESTAMP,
  push_commit_count INTEGER,
  push_action VARCHAR(50),
  push_ref_type VARCHAR(50),
  push_ref VARCHAR(255)
);
```

#### Commits Table
```sql
CREATE TABLE commits (
  id VARCHAR(255) PRIMARY KEY,
  short_id VARCHAR(50),
  title TEXT,
  message TEXT,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  authored_date TIMESTAMP,
  committer_name VARCHAR(255),
  committer_email VARCHAR(255),
  committed_date TIMESTAMP,
  web_url TEXT,
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  project_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Projects Table
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  name_with_namespace VARCHAR(255),
  path VARCHAR(255),
  path_with_namespace VARCHAR(255),
  web_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Data Flow

### 1. Initial Configuration
```
User → Frontend → ConfigForm
  ↓
  Enters GitLab credentials
  ↓
  Submits configuration
```

### 2. Data Synchronization
```
Frontend → Backend API (/api/sync)
  ↓
  GitLabService fetches data from GitLab API
  ↓
  DatabaseService stores data in PostgreSQL
  ↓
  Returns success response
```

### 3. Dashboard Display
```
Frontend → Backend API (/api/stats)
  ↓
  Retrieve data from PostgreSQL
  ↓
  Calculate statistics
  ↓
  Return aggregated data
  ↓
  Frontend renders charts
```

### 4. Date Range Filtering
```
User changes date range
  ↓
  Frontend → Backend API (/api/stats?since=...&until=...)
  ↓
  Query database with date filters
  ↓
  Return filtered statistics
  ↓
  Update charts
```

## API Endpoints

### POST /api/sync
Synchronize data from GitLab to database.

**Request:**
```json
{
  "baseUrl": "https://gitlab.com",
  "privateToken": "token",
  "groupId": 123,
  "projectId": 456,
  "since": "2024-01-01T00:00:00Z",
  "until": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data synced successfully",
  "usersCount": 10
}
```

### GET /api/users
Get all users from database.

**Response:**
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "avatar_url": "https://...",
    ...
  }
]
```

### GET /api/events
Get events with optional filters.

**Query Parameters:**
- `since` (optional): ISO 8601 timestamp
- `until` (optional): ISO 8601 timestamp
- `userId` (optional): User ID

**Response:**
```json
[
  {
    "id": 1,
    "author_id": 1,
    "action_name": "pushed to",
    "created_at": "2024-01-15T10:30:00Z",
    "push_data": {
      "commit_count": 5
    }
  }
]
```

### GET /api/projects
Get all projects from database.

**Response:**
```json
[
  {
    "id": 1,
    "name": "my-project",
    "web_url": "https://...",
    ...
  }
]
```

### GET /api/stats
Get dashboard statistics.

**Query Parameters:**
- `since` (optional): ISO 8601 timestamp
- `until` (optional): ISO 8601 timestamp

**Response:**
```json
{
  "totalUsers": 10,
  "totalCommits": 250,
  "totalAdditions": 5000,
  "totalDeletions": 1500,
  "avgCommitsPerWorkday": 12.5,
  "commitsByDay": {
    "2024-01-15": 10,
    "2024-01-16": 15
  },
  "commitsByHour": [0, 0, 0, 5, 10, ...],
  "commitsByDayOfWeek": [10, 50, 60, 45, 40, 30, 5],
  "topContributors": [...],
  "projectBreakdown": [...]
}
```

## Security Considerations

1. **GitLab Token Storage**: Private tokens are never stored in the database. They're only used during sync operations.

2. **CORS Configuration**: Backend uses CORS middleware to allow frontend access.

3. **SQL Injection Prevention**: All database queries use parameterized queries.

4. **Environment Variables**: Sensitive configuration stored in `.env` files (not committed to git).

5. **Database Credentials**: PostgreSQL credentials isolated in environment variables.

## Performance Optimization

1. **Database Indexing**: Tables indexed on frequently queried columns (user_id, created_at).

2. **Pagination**: GitLab API requests use pagination (100 items per page).

3. **Upsert Operations**: Use `ON CONFLICT` clauses to prevent duplicates.

4. **Client-Side Caching**: Frontend caches data during session.

5. **Efficient Queries**: Statistics calculated in single database pass where possible.

## Deployment Options

### Docker Compose (Recommended)
All services (PostgreSQL, Backend, Frontend) deployed as containers.

### Manual Deployment
- PostgreSQL: Self-hosted or managed service (AWS RDS, etc.)
- Backend: Node.js server (PM2, systemd)
- Frontend: Static hosting (Nginx, CDN)

## Monitoring & Debugging

1. **Health Check**: GET `/health` endpoint for monitoring
2. **Console Logging**: Backend logs all operations
3. **Error Handling**: Try-catch blocks with detailed error messages
4. **Database Connection**: Health checks on PostgreSQL connection

## Future Enhancements

1. **Real-time Updates**: WebSocket support for live data
2. **User Authentication**: Multi-user support with login
3. **Custom Dashboards**: User-configurable widgets
4. **Email Reports**: Scheduled email summaries
5. **Export Functionality**: CSV/PDF export of statistics
6. **Advanced Analytics**: ML-based insights and predictions
