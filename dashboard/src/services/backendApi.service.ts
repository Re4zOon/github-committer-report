import axios, { type AxiosInstance } from 'axios';
import type {
  GitLabUser,
  GitLabEvent,
  GitLabConfig,
  DashboardStats,
} from '../types/gitlab';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class BackendApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Sync data from GitLab to database
  async syncData(config: GitLabConfig, since?: Date, until?: Date): Promise<void> {
    await this.client.post('/sync', {
      baseUrl: config.baseUrl,
      privateToken: config.privateToken,
      groupId: config.groupId,
      projectId: config.projectId,
      since: since?.toISOString(),
      until: until?.toISOString(),
    });
  }

  // Get users from database
  async getUsers(): Promise<GitLabUser[]> {
    const response = await this.client.get('/users');
    return response.data;
  }

  // Get events from database
  async getEvents(since?: Date, until?: Date, userId?: number): Promise<GitLabEvent[]> {
    const params: Record<string, string> = {};
    if (since) params.since = since.toISOString();
    if (until) params.until = until.toISOString();
    if (userId) params.userId = userId.toString();

    const response = await this.client.get('/events', { params });
    return response.data;
  }

  // Get dashboard statistics
  async getStats(since?: Date, until?: Date): Promise<DashboardStats> {
    const params: Record<string, string> = {};
    if (since) params.since = since.toISOString();
    if (until) params.until = until.toISOString();

    const response = await this.client.get('/stats', { params });
    return response.data;
  }

  // Get user activities (calculated from events)
  async getUserActivities(since?: Date, until?: Date): Promise<any[]> {
    const users = await this.getUsers();
    const events = await this.getEvents(since, until);

    // Group events by user
    const userEventsMap = new Map<number, GitLabEvent[]>();
    for (const event of events) {
      if (!userEventsMap.has(event.author_id)) {
        userEventsMap.set(event.author_id, []);
      }
      userEventsMap.get(event.author_id)!.push(event);
    }

    // Calculate activities
    const activities = users.map(user => {
      const userEvents = userEventsMap.get(user.id) || [];
      const pushEvents = userEvents.filter(e => e.action_name === 'pushed to');
      const totalCommits = pushEvents.reduce(
        (sum, e) => sum + (e.push_data?.commit_count || 0),
        0
      );

      return {
        user,
        events: userEvents,
        commits: [],
        totalCommits,
        totalAdditions: 0,
        totalDeletions: 0,
      };
    });

    return activities;
  }
}

export default new BackendApiService();
