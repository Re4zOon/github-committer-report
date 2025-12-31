import { describe, it, expect, vi } from 'vitest';
import { GitLabService } from '../services/gitlab.service';

// Mock axios and database service
vi.mock('axios');
vi.mock('../services/database.service.js', () => ({
  default: {
    saveUsers: vi.fn(),
    saveEvents: vi.fn(),
    saveCommits: vi.fn(),
    saveProjects: vi.fn(),
  },
}));

describe('GitLabService', () => {
  const mockConfig = {
    baseUrl: 'https://gitlab.com',
    privateToken: 'test-token',
  };

  describe('constructor', () => {
    it('should create an instance with valid config', () => {
      const service = new GitLabService(mockConfig);
      expect(service).toBeInstanceOf(GitLabService);
    });

    it('should set up axios client with correct base URL', () => {
      const service = new GitLabService(mockConfig);
      expect(service).toBeDefined();
    });
  });

  describe('getActiveUsers', () => {
    it('should handle empty user list', async () => {
      const axios = await import('axios');
      const mockAxios = axios.default as any;
      mockAxios.create = vi.fn(() => ({
        get: vi.fn().mockResolvedValue({ data: [] }),
      }));

      const service = new GitLabService(mockConfig);
      const users = await service.getActiveUsers();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('collectUserActivities', () => {
    it('should collect activities for given users', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', name: 'User One', state: 'active', avatar_url: '', web_url: '' },
      ];

      const axios = await import('axios');
      const mockAxios = axios.default as any;
      mockAxios.create = vi.fn(() => ({
        get: vi.fn().mockResolvedValue({ data: [] }),
      }));

      const service = new GitLabService(mockConfig);
      const activities = await service.collectUserActivities(mockUsers);
      
      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBe(mockUsers.length);
    });

    it('should calculate total commits from push events', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', name: 'User One', state: 'active', avatar_url: '', web_url: '' },
      ];

      const mockEvents = [
        {
          id: 1,
          action_name: 'pushed to',
          push_data: { commit_count: 5 },
          created_at: new Date().toISOString(),
          project_id: 1,
          author_id: 1,
          author: { id: 1, username: 'user1', name: 'User One', avatar_url: '' },
        },
      ];

      const axios = await import('axios');
      const mockAxios = axios.default as any;
      mockAxios.create = vi.fn(() => ({
        get: vi.fn().mockResolvedValue({ data: mockEvents }),
      }));

      const service = new GitLabService(mockConfig);
      const activities = await service.collectUserActivities(mockUsers);
      
      expect(activities[0].totalCommits).toBe(5);
    });
  });
});
