# GitLab Activity Dashboard

An interactive dashboard for GitLab activity statistics with PostgreSQL data storage. Connect to your GitLab instance to visualize user activity, commits, and more - all data is persisted in a PostgreSQL database for reliable storage and fast querying.

## Features

### Core Features
- **GitLab Integration**: Connect to any GitLab instance (gitlab.com or self-hosted) using a private token
- **PostgreSQL Storage**: All GitLab data is stored in a PostgreSQL database for persistence and scalability
- **Active Users**: Automatically fetches all active users from a group or the entire instance
- **Activity Collection**: Collects all activities (commits, pushes, events) for users
- **Backend API**: RESTful API server for data synchronization and retrieval

### Interactive Dashboard
- **Timeline Graph**: Interactive chart showing commits over time with:
  - 🖱️ **Drag & Slide**: Pan across the timeline by dragging
  - 🔍 **Zoom In/Out**: Use mouse wheel or pinch gestures to zoom
  - 📊 **Range Selection**: Shift+drag to select a specific date range
  - 🔄 **Reset Zoom**: One-click button to reset the view

### Additional Metrics
1. **Average Commits per Workday**: Calculates productivity based on working days (Mon-Fri)
2. **Top Contributors Leaderboard**: Ranked list of most active contributors with medals (🥇🥈🥉)
3. **Activity Heatmap**: Visual breakdown of commits by:
   - Day of week (with weekend highlighting)
   - Hour of day (with business hours highlighting)
4. **Repository Breakdown**: Doughnut chart showing commit distribution across projects
5. **Lines Changed Stats**: Track total additions and deletions
6. **User Activity Table**: Detailed view of individual user statistics

### UI Features
- **Date Range Picker**: Quick presets (7d, 30d, 90d, This Month, Last Month) or custom range
- **Dark Theme**: Modern dark theme optimized for readability
- **Responsive Design**: Works on desktop and tablet devices
- **Real-time Loading**: Loading indicators while fetching data

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL 14+ (or use Docker)
- Docker and Docker Compose (optional, for easy setup)
- GitLab private token with `read_api` scope

### Quick Start with Docker (Recommended)

The easiest way to run the application with PostgreSQL is using Docker Compose:

1. **Clone the repository**
```bash
git clone <repository-url>
cd github-committer-report
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env if you want to customize database credentials
```

3. **Start all services**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API server on port 3001
- Frontend dashboard on port 5173

4. **Access the dashboard**

Open http://localhost:5173 in your browser.

### Manual Installation

If you prefer to run services manually:

#### 1. Setup PostgreSQL

Install PostgreSQL and create a database:
```bash
createdb gitlab_dashboard
```

#### 2. Setup Backend

```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your PostgreSQL credentials
npm run dev
```

The backend will run on http://localhost:3001

#### 3. Setup Frontend

```bash
cd dashboard
npm install
npm run dev
```

The frontend will run on http://localhost:5173

## Configuration

### Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to `.env` and customize:

**Backend (.env):**
```
DB_HOST=localhost           # PostgreSQL host
DB_PORT=5432               # PostgreSQL port
DB_NAME=gitlab_dashboard   # Database name
DB_USER=postgres           # Database user
DB_PASSWORD=postgres       # Database password
PORT=3001                  # Backend API port
```

**Frontend (.env or dashboard/.env):**
```
VITE_API_URL=http://localhost:3001  # Backend API URL
```

### GitLab Configuration

When you open the dashboard, you'll be prompted to enter:

1. **GitLab URL**: Your GitLab instance URL (default: `https://gitlab.com`)
2. **Private Token**: Generate from GitLab → Settings → Access Tokens with `read_api` scope
3. **Group ID** (optional): Specify a group to analyze group members
4. **Project ID** (optional): Specify a project to analyze a specific repository

## Technology Stack

### Backend
- **Node.js** with Express for REST API
- **PostgreSQL** for persistent data storage
- **TypeScript** for type safety
- **pg** (node-postgres) for database connectivity

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Chart.js** with react-chartjs-2 for interactive charts
- **chartjs-plugin-zoom** for zoom/pan functionality
- **date-fns** for date manipulation
- **Axios** for API requests

## Architecture

The application follows a three-tier architecture:

1. **Frontend (React)**: User interface for visualizing GitLab data
2. **Backend (Express API)**: REST API for data synchronization and retrieval
3. **Database (PostgreSQL)**: Persistent storage for all GitLab data

### Data Flow

1. User configures GitLab credentials in the frontend
2. Frontend sends sync request to backend API
3. Backend fetches data from GitLab API and stores it in PostgreSQL
4. Frontend queries backend API for dashboard statistics
5. Backend retrieves and aggregates data from PostgreSQL
6. Frontend displays the data in interactive charts and tables

### Database Schema

The PostgreSQL database contains four main tables:

- **users**: GitLab users information
- **events**: User events (pushes, commits, etc.)
- **commits**: Detailed commit information with stats
- **projects**: GitLab projects/repositories

All tables are indexed for optimal query performance.

## License

MIT