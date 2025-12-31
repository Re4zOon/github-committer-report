import { useState, useCallback } from 'react';
import { subDays } from 'date-fns';
import './App.css';
import {
  TimelineChart,
  StatsCards,
  ContributorLeaderboard,
  ActivityHeatmap,
  ProjectBreakdown,
  ConfigForm,
  DateRangePicker,
} from './components';
import { GitLabService } from './services/gitlabService';
import backendApiService from './services/backendApi.service';
import { generateMockData } from './services/mockData';
import type { GitLabConfig, DashboardStats, UserActivity } from './types/gitlab';

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gitlabConfig, setGitlabConfig] = useState<GitLabConfig | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [dateRange, setDateRange] = useState({
    since: subDays(new Date(), 30),
    until: new Date(),
  });

  const fetchData = useCallback(
    async (config: GitLabConfig, since: Date, until: Date) => {
      setIsLoading(true);
      setError(null);
      try {
        // Sync data from GitLab to backend database
        await backendApiService.syncData(config, since, until);
        
        // Fetch data from backend database
        const userActivities = await backendApiService.getUserActivities(since, until);
        const dashboardStats = await backendApiService.getStats(since, until);
        setActivities(userActivities);
        setStats(dashboardStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data from backend');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleConfigSubmit = async (config: GitLabConfig) => {
    setGitlabConfig(config);
    setIsConfigured(true);
    setIsDemo(false);
    await fetchData(config, dateRange.since, dateRange.until);
  };

  const handleDemoMode = () => {
    const { stats: mockStats, activities: mockActivities } = generateMockData();
    setStats(mockStats);
    setActivities(mockActivities);
    setIsConfigured(true);
    setIsDemo(true);
  };

  const handleDateRangeChange = async (since: Date, until: Date) => {
    setDateRange({ since, until });
    if (isDemo) {
      // In demo mode, regenerate mock data
      const { stats: mockStats, activities: mockActivities } = generateMockData();
      setStats(mockStats);
      setActivities(mockActivities);
    } else if (gitlabConfig) {
      // Fetch data from backend database for the new date range
      setIsLoading(true);
      setError(null);
      try {
        const userActivities = await backendApiService.getUserActivities(since, until);
        const dashboardStats = await backendApiService.getStats(since, until);
        setActivities(userActivities);
        setStats(dashboardStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data from backend');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDisconnect = () => {
    setIsConfigured(false);
    setGitlabConfig(null);
    setStats(null);
    setActivities([]);
    setError(null);
    setIsDemo(false);
  };

  if (!isConfigured) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🦊 GitLab Activity Dashboard</h1>
          <p>Interactive analytics for your GitLab instance</p>
        </header>
        <main className="app-main config-view">
          <ConfigForm onSubmit={handleConfigSubmit} isLoading={isLoading} />
          <div className="demo-section">
            <p>Or try the demo with sample data:</p>
            <button onClick={handleDemoMode} className="demo-btn">
              🎮 Launch Demo Mode
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🦊 GitLab Activity Dashboard {isDemo && <span className="demo-badge">DEMO</span>}</h1>
          <button onClick={handleDisconnect} className="disconnect-btn">
            {isDemo ? 'Exit Demo' : 'Disconnect'}
          </button>
        </div>
        <DateRangePicker onRangeChange={handleDateRangeChange} />
      </header>

      <main className="app-main dashboard-view">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Fetching data from GitLab...</p>
          </div>
        )}

        {stats && (
          <>
            <section className="dashboard-section">
              <StatsCards
                totalUsers={stats.totalUsers}
                totalCommits={stats.totalCommits}
                totalAdditions={stats.totalAdditions}
                totalDeletions={stats.totalDeletions}
                avgCommitsPerWorkday={stats.avgCommitsPerWorkday}
              />
            </section>

            <section className="dashboard-section">
              <TimelineChart commitsByDay={stats.commitsByDay} />
            </section>

            <section className="dashboard-section grid-2">
              <ContributorLeaderboard topContributors={stats.topContributors} />
              <ProjectBreakdown projectBreakdown={stats.projectBreakdown} />
            </section>

            <section className="dashboard-section">
              <ActivityHeatmap
                commitsByDayOfWeek={stats.commitsByDayOfWeek}
                commitsByHour={stats.commitsByHour}
              />
            </section>

            <section className="dashboard-section">
              <div className="activity-list">
                <h3>👤 User Activity Summary</h3>
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Commits</th>
                      <th>Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities
                      .sort((a, b) => b.totalCommits - a.totalCommits)
                      .slice(0, 20)
                      .map((activity) => (
                        <tr key={activity.user.id}>
                          <td>
                            <div className="user-cell">
                              <img
                                src={activity.user.avatar_url}
                                alt={activity.user.name}
                                className="user-avatar"
                              />
                              <div>
                                <div className="user-name">{activity.user.name}</div>
                                <div className="user-username">@{activity.user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td>{activity.totalCommits}</td>
                          <td>{activity.events.length}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>GitLab Activity Dashboard • Built with React & Chart.js</p>
      </footer>
    </div>
  );
}

export default App;
