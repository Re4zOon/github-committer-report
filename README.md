# GitLab Activity Dashboard

> 🦊 An interactive analytics dashboard for visualizing GitLab activity with powerful insights and beautiful charts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0-blue.svg)

An interactive dashboard for GitLab activity statistics with PostgreSQL data storage. Connect to your GitLab instance to visualize user activity, commits, and more - all data is persisted in a PostgreSQL database for reliable storage and fast querying.

## ✨ Features

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
- **Demo Mode**: Try the dashboard with sample data

## 📸 Screenshots

_Dashboard with interactive charts and statistics_

> **Note**: Screenshots will be added in a future update. For now, you can try the demo mode to see the dashboard in action!

## 🎥 Demo

Try the live demo mode to explore the dashboard without configuring GitLab:

1. Visit the dashboard
2. Click "🎮 Launch Demo Mode"
3. Interact with charts and explore features

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Running Tests](#-running-tests)
- [Technology Stack](#-technology-stack)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The fastest way to get started. This will set up PostgreSQL, backend, and frontend automatically.

```bash
# Clone the repository
git clone https://github.com/Re4zOon/github-committer-report.git
cd github-committer-report

# Start all services
docker-compose up -d

# Access the dashboard
# Open http://localhost:5173 in your browser
```

That's it! The dashboard is now running. 🎉

### Option 2: Manual Setup

For development or customization:

1. **Install Prerequisites**
   - Node.js 18+
   - PostgreSQL 14+

2. **Setup Database**
   ```bash
   createdb gitlab_dashboard
   ```

3. **Install and Run Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Install and Run Frontend** (in a new terminal)
   ```bash
   cd dashboard
   npm install
   npm run dev
   ```

5. **Access Dashboard**
   - Open http://localhost:5173

### First-Time Configuration

When you open the dashboard:

1. Enter your **GitLab URL** (default: `https://gitlab.com`)
2. Enter your **Private Token** ([How to create one](./docs/SETUP.md#gitlab-personal-access-token))
3. Optionally specify **Group ID** or **Project ID**
4. Click **Connect to GitLab**

The dashboard will sync data from GitLab and display your analytics!

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- **[Setup Guide](./docs/SETUP.md)** - Detailed installation and configuration instructions
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and technical details
- **[API Documentation](./docs/API.md)** - Complete REST API reference
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

## 🧪 Running Tests

We have comprehensive test suites for both backend and frontend to ensure code quality.

### Backend Tests

```bash
cd backend

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Frontend Tests

```bash
cd dashboard

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### All Tests

Run all tests from the project root:

```bash
# Backend tests
(cd backend && npm test)

# Frontend tests
(cd dashboard && npm test)
```

**Test Coverage**: Our test suite covers:
- ✅ GitLab API integration
- ✅ Database operations
- ✅ API endpoints
- ✅ React components
- ✅ Service layer logic
- ✅ Date and statistics calculations

## 🛠 Technology Stack

### Backend
- **Node.js** with Express for REST API
- **PostgreSQL** for persistent data storage
- **TypeScript** for type safety
- **pg** (node-postgres) for database connectivity
- **Vitest** for testing

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Chart.js** with react-chartjs-2 for interactive charts
- **chartjs-plugin-zoom** for zoom/pan functionality
- **date-fns** for date manipulation
- **Axios** for API requests
- **Vitest** + React Testing Library for testing

## 📊 Architecture

The application follows a three-tier architecture:

```
┌─────────────┐      HTTP/REST      ┌─────────────┐      SQL       ┌──────────────┐
│   React     │ ◄──────────────────► │   Express   │ ◄─────────────►│  PostgreSQL  │
│  Dashboard  │                      │   Backend   │                │   Database   │
└─────────────┘                      └─────────────┘                └──────────────┘
```

1. **Frontend (React)**: User interface for visualizing GitLab data
2. **Backend (Express API)**: REST API for data synchronization and retrieval
3. **Database (PostgreSQL)**: Persistent storage for all GitLab data

See [Architecture Documentation](./docs/ARCHITECTURE.md) for detailed information.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report bugs**: [Create an issue](https://github.com/Re4zOon/github-committer-report/issues/new) with details
2. **Suggest features**: Share your ideas for improvements
3. **Submit PRs**: Fix bugs or add features

Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:
- Setting up the development environment
- Coding standards and best practices
- Testing requirements
- Submitting pull requests

### Quick Contribution Steps

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/github-committer-report.git
cd github-committer-report

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and test
cd backend && npm test
cd ../dashboard && npm test

# Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature

# Open a Pull Request on GitHub
```

## 📝 License

MIT

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Express](https://expressjs.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Database powered by [PostgreSQL](https://www.postgresql.org/)

## 📞 Support

- **Documentation**: Check the [`docs/`](./docs/) folder
- **Issues**: [GitHub Issues](https://github.com/Re4zOon/github-committer-report/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Re4zOon/github-committer-report/discussions)

## 🗺️ Roadmap

Future enhancements we're considering:

- [ ] Real-time updates via WebSockets
- [ ] Multi-user support with authentication
- [ ] Custom dashboard widgets
- [ ] Email report scheduling
- [ ] CSV/PDF export functionality
- [ ] Advanced analytics with ML insights
- [ ] Mobile app

---

**Made with ❤️ by the community**