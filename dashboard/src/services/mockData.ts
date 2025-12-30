import type { DashboardStats, UserActivity, GitLabUser } from '../types/gitlab';

// Generate mock data for demonstration purposes
export function generateMockData(): { stats: DashboardStats; activities: UserActivity[] } {
  const mockUsers: GitLabUser[] = [
    { id: 1, username: 'john.doe', name: 'John Doe', state: 'active', avatar_url: 'https://www.gravatar.com/avatar/1?d=identicon', web_url: '' },
    { id: 2, username: 'jane.smith', name: 'Jane Smith', state: 'active', avatar_url: 'https://www.gravatar.com/avatar/2?d=identicon', web_url: '' },
    { id: 3, username: 'bob.wilson', name: 'Bob Wilson', state: 'active', avatar_url: 'https://www.gravatar.com/avatar/3?d=identicon', web_url: '' },
    { id: 4, username: 'alice.johnson', name: 'Alice Johnson', state: 'active', avatar_url: 'https://www.gravatar.com/avatar/4?d=identicon', web_url: '' },
    { id: 5, username: 'charlie.brown', name: 'Charlie Brown', state: 'active', avatar_url: 'https://www.gravatar.com/avatar/5?d=identicon', web_url: '' },
    { id: 6, username: 'diana.prince', name: 'Diana Prince', state: 'active', avatar_url: 'https://www.gravatar.com/avatar/6?d=identicon', web_url: '' },
    { id: 7, username: 'edward.chen', name: 'Edward Chen', state: 'active', avatar_url: 'https://www.gravatar.com/avatar/7?d=identicon', web_url: '' },
    { id: 8, username: 'fiona.garcia', name: 'Fiona Garcia', state: 'active', avatar_url: 'https://www.gravatar.com/avatar/8?d=identicon', web_url: '' },
  ];

  // Generate commits by day for the last 30 days
  const commitsByDay: { [date: string]: number } = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    // Less commits on weekends
    const baseCommits = dayOfWeek === 0 || dayOfWeek === 6 
      ? Math.floor(Math.random() * 5) 
      : Math.floor(Math.random() * 20) + 5;
    commitsByDay[dateStr] = baseCommits;
  }

  // Generate commits by hour (more during business hours)
  const commitsByHour: number[] = [];
  for (let i = 0; i < 24; i++) {
    if (i >= 9 && i <= 17) {
      commitsByHour.push(Math.floor(Math.random() * 50) + 30);
    } else if (i >= 6 && i <= 22) {
      commitsByHour.push(Math.floor(Math.random() * 20) + 5);
    } else {
      commitsByHour.push(Math.floor(Math.random() * 5));
    }
  }

  // Generate commits by day of week
  const commitsByDayOfWeek: number[] = [
    Math.floor(Math.random() * 20) + 5,   // Sunday
    Math.floor(Math.random() * 50) + 40,  // Monday
    Math.floor(Math.random() * 60) + 50,  // Tuesday
    Math.floor(Math.random() * 55) + 45,  // Wednesday
    Math.floor(Math.random() * 50) + 40,  // Thursday
    Math.floor(Math.random() * 45) + 35,  // Friday
    Math.floor(Math.random() * 15) + 5,   // Saturday
  ];

  const topContributors = mockUsers
    .map(user => ({
      user,
      commits: Math.floor(Math.random() * 100) + 20,
    }))
    .sort((a, b) => b.commits - a.commits);

  const projectBreakdown = [
    { project: 'frontend-app', commits: Math.floor(Math.random() * 80) + 40 },
    { project: 'backend-api', commits: Math.floor(Math.random() * 70) + 30 },
    { project: 'mobile-app', commits: Math.floor(Math.random() * 50) + 20 },
    { project: 'infrastructure', commits: Math.floor(Math.random() * 40) + 15 },
    { project: 'documentation', commits: Math.floor(Math.random() * 30) + 10 },
    { project: 'shared-libs', commits: Math.floor(Math.random() * 25) + 10 },
  ].sort((a, b) => b.commits - a.commits);

  const totalCommits = Object.values(commitsByDay).reduce((a, b) => a + b, 0);
  const totalAdditions = Math.floor(Math.random() * 10000) + 5000;
  const totalDeletions = Math.floor(Math.random() * 5000) + 2000;

  const stats: DashboardStats = {
    totalUsers: mockUsers.length,
    totalCommits,
    totalAdditions,
    totalDeletions,
    avgCommitsPerWorkday: totalCommits / 22, // ~22 workdays in 30 days
    commitsByDay,
    commitsByHour,
    commitsByDayOfWeek,
    topContributors,
    projectBreakdown,
  };

  const activities: UserActivity[] = mockUsers.map(user => ({
    user,
    events: [],
    commits: [],
    totalCommits: topContributors.find(c => c.user.id === user.id)?.commits || 0,
    totalAdditions: Math.floor(Math.random() * 2000),
    totalDeletions: Math.floor(Math.random() * 1000),
  }));

  return { stats, activities };
}
