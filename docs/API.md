# API Documentation

Complete reference for the GitLab Activity Dashboard REST API.

## Base URL

```
http://localhost:3001/api
```

## Authentication

The API does not require authentication for local development. GitLab credentials are passed in request bodies when needed.

## Endpoints

### Health Check

Check if the server is running.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes**:
- `200 OK`: Server is healthy

---

### Sync Data

Synchronize data from GitLab to the database.

**Endpoint**: `POST /api/sync`

**Request Body**:
```json
{
  "baseUrl": "https://gitlab.com",
  "privateToken": "glpat-xxxxxxxxxxxxxxxxxxxx",
  "groupId": 123,
  "projectId": 456,
  "since": "2024-01-01T00:00:00Z",
  "until": "2024-12-31T23:59:59Z"
}
```

**Parameters**:
- `baseUrl` (required): GitLab instance URL
- `privateToken` (required): GitLab Personal Access Token with `read_api` scope
- `groupId` (optional): Limit to specific group members
- `projectId` (optional): Limit to specific project
- `since` (optional): ISO 8601 timestamp for start date
- `until` (optional): ISO 8601 timestamp for end date

**Response**:
```json
{
  "success": true,
  "message": "Data synced successfully",
  "usersCount": 10
}
```

**Status Codes**:
- `200 OK`: Data synced successfully
- `400 Bad Request`: Missing required parameters
- `500 Internal Server Error`: GitLab API error or database error

**Example**:
```bash
curl -X POST http://localhost:3001/api/sync \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://gitlab.com",
    "privateToken": "glpat-xxxxxxxxxxxxxxxxxxxx"
  }'
```

---

### Get Users

Retrieve all users from the database.

**Endpoint**: `GET /api/users`

**Response**:
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "state": "active",
    "avatar_url": "https://gitlab.com/uploads/-/avatar.jpg",
    "web_url": "https://gitlab.com/johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Codes**:
- `200 OK`: Users retrieved successfully
- `500 Internal Server Error`: Database error

**Example**:
```bash
curl http://localhost:3001/api/users
```

---

### Get Events

Retrieve events from the database with optional filtering.

**Endpoint**: `GET /api/events`

**Query Parameters**:
- `since` (optional): ISO 8601 timestamp for start date
- `until` (optional): ISO 8601 timestamp for end date
- `userId` (optional): Filter by specific user ID

**Response**:
```json
[
  {
    "id": 12345,
    "author_id": 1,
    "project_id": 100,
    "action_name": "pushed to",
    "target_id": 200,
    "target_type": "MergeRequest",
    "target_title": "Feature: Add new dashboard",
    "created_at": "2024-01-15T10:30:00.000Z",
    "push_data": {
      "commit_count": 3,
      "action": "pushed",
      "ref_type": "branch",
      "ref": "main",
      "commit_from": null,
      "commit_to": null
    }
  }
]
```

**Status Codes**:
- `200 OK`: Events retrieved successfully
- `500 Internal Server Error`: Database error

**Examples**:
```bash
# Get all events
curl http://localhost:3001/api/events

# Get events in date range
curl "http://localhost:3001/api/events?since=2024-01-01T00:00:00Z&until=2024-01-31T23:59:59Z"

# Get events for specific user
curl "http://localhost:3001/api/events?userId=1"
```

---

### Get Projects

Retrieve all projects from the database.

**Endpoint**: `GET /api/projects`

**Response**:
```json
[
  {
    "id": 100,
    "name": "my-project",
    "name_with_namespace": "mygroup/my-project",
    "path": "my-project",
    "path_with_namespace": "mygroup/my-project",
    "web_url": "https://gitlab.com/mygroup/my-project",
    "avatar_url": "https://gitlab.com/uploads/-/avatar.jpg",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Codes**:
- `200 OK`: Projects retrieved successfully
- `500 Internal Server Error`: Database error

**Example**:
```bash
curl http://localhost:3001/api/projects
```

---

### Get Statistics

Get aggregated dashboard statistics.

**Endpoint**: `GET /api/stats`

**Query Parameters**:
- `since` (optional): ISO 8601 timestamp for start date (default: 30 days ago)
- `until` (optional): ISO 8601 timestamp for end date (default: now)

**Response**:
```json
{
  "totalUsers": 10,
  "totalCommits": 250,
  "totalAdditions": 5000,
  "totalDeletions": 1500,
  "avgCommitsPerWorkday": 12.5,
  "commitsByDay": {
    "2024-01-15": 10,
    "2024-01-16": 15,
    "2024-01-17": 20
  },
  "commitsByHour": [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 15, 20, 18, 12, 10, 8,
    6, 4, 2, 1, 0, 0, 0, 0
  ],
  "commitsByDayOfWeek": [
    5, 50, 60, 55, 45, 30, 5
  ],
  "topContributors": [
    {
      "user": {
        "id": 1,
        "username": "johndoe",
        "name": "John Doe",
        "avatar_url": "https://...",
        "state": "active",
        "web_url": "https://..."
      },
      "commits": 100
    }
  ],
  "projectBreakdown": [
    {
      "project": "my-project",
      "commits": 80
    },
    {
      "project": "another-project",
      "commits": 50
    }
  ]
}
```

**Field Descriptions**:
- `totalUsers`: Total number of users in database
- `totalCommits`: Total commits in date range
- `totalAdditions`: Total lines added (currently always 0)
- `totalDeletions`: Total lines deleted (currently always 0)
- `avgCommitsPerWorkday`: Average commits per weekday (Monday-Friday)
- `commitsByDay`: Object mapping date strings to commit counts
- `commitsByHour`: Array of 24 numbers (commits by hour of day, 0-23)
- `commitsByDayOfWeek`: Array of 7 numbers (commits by day, Sunday=0, Saturday=6)
- `topContributors`: Top 10 contributors with most commits
- `projectBreakdown`: Top 10 projects with most commits

**Status Codes**:
- `200 OK`: Statistics calculated successfully
- `500 Internal Server Error`: Database error

**Examples**:
```bash
# Get stats for last 30 days (default)
curl http://localhost:3001/api/stats

# Get stats for specific date range
curl "http://localhost:3001/api/stats?since=2024-01-01T00:00:00Z&until=2024-01-31T23:59:59Z"

# Get stats for last 7 days
curl "http://localhost:3001/api/stats?since=$(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%SZ)"
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Error Status Codes**:
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server-side error (database, GitLab API, etc.)

## Rate Limiting

The API does not implement rate limiting. However, GitLab API has its own rate limits:
- **gitlab.com**: 300 requests per minute per user
- **Self-hosted**: Configured by administrator

When syncing large amounts of data, the API automatically paginates requests to stay within limits.

## Data Persistence

All data is stored in PostgreSQL and persists between server restarts. The sync endpoint can be called multiple times - it will update existing records and add new ones.

## Best Practices

1. **Use date ranges**: Always specify `since` and `until` for better performance
2. **Sync before querying**: Call `/api/sync` before fetching statistics
3. **Handle errors**: Check status codes and handle errors gracefully
4. **Monitor progress**: Check backend logs during sync operations
5. **Validate tokens**: Ensure GitLab tokens are valid before syncing

## Example Workflow

```bash
# 1. Sync data from GitLab
curl -X POST http://localhost:3001/api/sync \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://gitlab.com",
    "privateToken": "glpat-xxxxxxxxxxxxxxxxxxxx",
    "since": "2024-01-01T00:00:00Z",
    "until": "2024-01-31T23:59:59Z"
  }'

# 2. Get statistics
curl "http://localhost:3001/api/stats?since=2024-01-01T00:00:00Z&until=2024-01-31T23:59:59Z"

# 3. Get user list
curl http://localhost:3001/api/users

# 4. Get events for specific user
curl "http://localhost:3001/api/events?userId=1&since=2024-01-01T00:00:00Z"
```

## Additional Resources

- [Setup Guide](./SETUP.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
