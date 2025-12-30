import axios, { type AxiosInstance } from 'axios';
import type {
  GitLabUser,
  GitLabEvent,
  GitLabCommit,
  GitLabProject,
  GitLabConfig,
  UserActivity,
  DashboardStats,
} from '../types/gitlab';

export class GitLabService {
  private client: AxiosInstance;
  private config: GitLabConfig;

  constructor(config: GitLabConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.baseUrl}/api/v4`,
      headers: {
        'PRIVATE-TOKEN': config.privateToken,
      },
    });
  }

  // Get all active users from a group or the entire instance
  async getActiveUsers(): Promise<GitLabUser[]> {
    const users: GitLabUser[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        let response;
        if (this.config.groupId) {
          // Get group members
          response = await this.client.get(`/groups/${this.config.groupId}/members`, {
            params: { page, per_page: perPage, state: 'active' },
          });
        } else {
          // Get all users (requires admin access)
          response = await this.client.get('/users', {
            params: { page, per_page: perPage, state: 'active' },
          });
        }

        const pageUsers = response.data as GitLabUser[];
        users.push(...pageUsers.filter((u) => u.state === 'active'));

        if (pageUsers.length < perPage) break;
        page++;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return users;
  }

  // Get events for a specific user
  async getUserEvents(userId: number, after?: Date, before?: Date): Promise<GitLabEvent[]> {
    const events: GitLabEvent[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        const params: Record<string, unknown> = { page, per_page: perPage };
        if (after) params.after = after.toISOString().split('T')[0];
        if (before) params.before = before.toISOString().split('T')[0];

        const response = await this.client.get(`/users/${userId}/events`, { params });
        const pageEvents = response.data as GitLabEvent[];
        events.push(...pageEvents);

        if (pageEvents.length < perPage) break;
        page++;
      }
    } catch (error) {
      console.error(`Error fetching events for user ${userId}:`, error);
    }

    return events;
  }

  // Get commits for a project
  async getProjectCommits(
    projectId: number,
    since?: Date,
    until?: Date
  ): Promise<GitLabCommit[]> {
    const commits: GitLabCommit[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        const params: Record<string, unknown> = { page, per_page: perPage, with_stats: true };
        if (since) params.since = since.toISOString();
        if (until) params.until = until.toISOString();

        const response = await this.client.get(`/projects/${projectId}/repository/commits`, {
          params,
        });
        const pageCommits = response.data as GitLabCommit[];
        commits.push(...pageCommits);

        if (pageCommits.length < perPage) break;
        page++;
      }
    } catch (error) {
      console.error(`Error fetching commits for project ${projectId}:`, error);
    }

    return commits;
  }

  // Get all projects in a group or accessible to the user
  async getProjects(): Promise<GitLabProject[]> {
    const projects: GitLabProject[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        let response;
        if (this.config.groupId) {
          response = await this.client.get(`/groups/${this.config.groupId}/projects`, {
            params: { page, per_page: perPage },
          });
        } else if (this.config.projectId) {
          response = await this.client.get(`/projects/${this.config.projectId}`);
          projects.push(response.data);
          break;
        } else {
          response = await this.client.get('/projects', {
            params: { page, per_page: perPage, membership: true },
          });
        }

        const pageProjects = response.data as GitLabProject[];
        projects.push(...pageProjects);

        if (pageProjects.length < perPage) break;
        page++;
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    return projects;
  }

  // Collect all activities for users
  async collectUserActivities(
    users: GitLabUser[],
    since?: Date,
    until?: Date
  ): Promise<UserActivity[]> {
    const activities: UserActivity[] = [];

    for (const user of users) {
      const events = await this.getUserEvents(user.id, since, until);
      const pushEvents = events.filter((e) => e.action_name === 'pushed to');
      const totalCommits = pushEvents.reduce(
        (sum, e) => sum + (e.push_data?.commit_count || 0),
        0
      );

      activities.push({
        user,
        events,
        commits: [],
        totalCommits,
        totalAdditions: 0,
        totalDeletions: 0,
      });
    }

    return activities;
  }

  // Calculate dashboard statistics
  calculateStats(
    activities: UserActivity[],
    since: Date,
    until: Date
  ): DashboardStats {
    const commitsByDay: { [date: string]: number } = {};
    const commitsByHour: number[] = new Array(24).fill(0);
    const commitsByDayOfWeek: number[] = new Array(7).fill(0);
    const projectCommits: { [project: string]: number } = {};

    let totalCommits = 0;
    let totalAdditions = 0;
    let totalDeletions = 0;

    for (const activity of activities) {
      totalCommits += activity.totalCommits;
      totalAdditions += activity.totalAdditions;
      totalDeletions += activity.totalDeletions;

      for (const event of activity.events) {
        if (event.action_name === 'pushed to') {
          const date = new Date(event.created_at);
          const dateStr = date.toISOString().split('T')[0];
          const hour = date.getHours();
          const dayOfWeek = date.getDay();

          commitsByDay[dateStr] = (commitsByDay[dateStr] || 0) + (event.push_data?.commit_count || 0);
          commitsByHour[hour] += event.push_data?.commit_count || 0;
          commitsByDayOfWeek[dayOfWeek] += event.push_data?.commit_count || 0;

          if (event.target_title) {
            projectCommits[event.target_title] =
              (projectCommits[event.target_title] || 0) + (event.push_data?.commit_count || 0);
          }
        }
      }
    }

    // Calculate workdays between dates
    let workdays = 0;
    const current = new Date(since);
    while (current <= until) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workdays++;
      }
      current.setDate(current.getDate() + 1);
    }

    const avgCommitsPerWorkday = workdays > 0 ? totalCommits / workdays : 0;

    // Sort contributors by commits
    const topContributors = activities
      .map((a) => ({ user: a.user, commits: a.totalCommits }))
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 10);

    // Sort project breakdown
    const projectBreakdown = Object.entries(projectCommits)
      .map(([project, commits]) => ({ project, commits }))
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 10);

    return {
      totalUsers: activities.length,
      totalCommits,
      totalAdditions,
      totalDeletions,
      avgCommitsPerWorkday,
      commitsByDay,
      commitsByHour,
      commitsByDayOfWeek,
      topContributors,
      projectBreakdown,
    };
  }
}

export default GitLabService;
