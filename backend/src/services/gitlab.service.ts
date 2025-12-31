import axios, { type AxiosInstance } from 'axios';
import type { GitLabUser, GitLabEvent, GitLabCommit, GitLabProject, GitLabConfig } from '../types/gitlab.js';
import databaseService from './database.service.js';

const MAX_PAGES = 100;

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

  async getActiveUsers(): Promise<GitLabUser[]> {
    const users: GitLabUser[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (page <= MAX_PAGES) {
        let response;
        if (this.config.groupId) {
          response = await this.client.get(`/groups/${this.config.groupId}/members`, {
            params: { page, per_page: perPage, state: 'active' },
          });
        } else {
          response = await this.client.get('/users', {
            params: { page, per_page: perPage, state: 'active' },
          });
        }

        const pageUsers = response.data as GitLabUser[];
        users.push(...pageUsers.filter((u) => u.state === 'active'));

        if (pageUsers.length < perPage) break;
        page++;
      }

      // Save users to database
      await databaseService.saveUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return users;
  }

  async getUserEvents(userId: number, after?: Date, before?: Date): Promise<GitLabEvent[]> {
    const events: GitLabEvent[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (page <= MAX_PAGES) {
        const params: Record<string, unknown> = { page, per_page: perPage };
        if (after) params.after = after.toISOString().split('T')[0];
        if (before) params.before = before.toISOString().split('T')[0];

        const response = await this.client.get(`/users/${userId}/events`, { params });
        const pageEvents = response.data as GitLabEvent[];
        events.push(...pageEvents);

        if (pageEvents.length < perPage) break;
        page++;
      }

      // Save events to database
      await databaseService.saveEvents(events);
    } catch (error) {
      console.error(`Error fetching events for user ${userId}:`, error);
    }

    return events;
  }

  async getProjectCommits(projectId: number, since?: Date, until?: Date): Promise<GitLabCommit[]> {
    const commits: GitLabCommit[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (page <= MAX_PAGES) {
        const params: Record<string, unknown> = { page, per_page: perPage, with_stats: true };
        if (since) params.since = since.toISOString();
        if (until) params.until = until.toISOString();

        const response = await this.client.get(`/projects/${projectId}/repository/commits`, { params });
        const pageCommits = response.data as GitLabCommit[];
        commits.push(...pageCommits);

        if (pageCommits.length < perPage) break;
        page++;
      }

      // Save commits to database
      await databaseService.saveCommits(commits, projectId);
    } catch (error) {
      console.error(`Error fetching commits for project ${projectId}:`, error);
    }

    return commits;
  }

  async getProjects(): Promise<GitLabProject[]> {
    const projects: GitLabProject[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (page <= MAX_PAGES) {
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

      // Save projects to database
      await databaseService.saveProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    return projects;
  }

  async collectUserActivities(users: GitLabUser[], since?: Date, until?: Date): Promise<any[]> {
    const activities: any[] = [];

    for (const user of users) {
      const events = await this.getUserEvents(user.id, since, until);
      const pushEvents = events.filter((e) => e.action_name === 'pushed to');
      const totalCommits = pushEvents.reduce((sum, e) => sum + (e.push_data?.commit_count || 0), 0);

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
}
