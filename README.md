# GitLab Activity Dashboard

An interactive dashboard for GitLab activity statistics. Connect to your GitLab instance to visualize user activity, commits, and more.

## Features

### Core Features
- **GitLab Integration**: Connect to any GitLab instance (gitlab.com or self-hosted) using a private token
- **Active Users**: Automatically fetches all active users from a group or the entire instance
- **Activity Collection**: Collects all activities (commits, pushes, events) for users

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
- GitLab private token with `read_api` scope

### Installation

```bash
cd dashboard
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Production Build

```bash
npm run build
```

The built files will be in the `dist` folder.

## Configuration

When you open the dashboard, you'll be prompted to enter:

1. **GitLab URL**: Your GitLab instance URL (default: `https://gitlab.com`)
2. **Private Token**: Generate from GitLab → Settings → Access Tokens with `read_api` scope
3. **Group ID** (optional): Specify a group to analyze group members
4. **Project ID** (optional): Specify a project to analyze a specific repository

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Chart.js** with react-chartjs-2 for interactive charts
- **chartjs-plugin-zoom** for zoom/pan functionality
- **date-fns** for date manipulation
- **Axios** for API requests

## License

MIT