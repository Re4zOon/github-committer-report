import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { BackendApiService } from '../services/backendApi.service';

vi.mock('axios');

describe('BackendApiService', () => {
  let service: BackendApiService;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
    };

    (axios.create as any) = vi.fn(() => mockAxiosInstance);
    service = new BackendApiService();
  });

  describe('syncData', () => {
    it('should send sync request with config', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });

      const config = {
        baseUrl: 'https://gitlab.com',
        privateToken: 'test-token',
        groupId: 123,
      };

      await service.syncData(config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/sync', {
        baseUrl: config.baseUrl,
        privateToken: config.privateToken,
        groupId: config.groupId,
        projectId: undefined,
        since: undefined,
        until: undefined,
      });
    });

    it('should include date range when provided', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });

      const config = {
        baseUrl: 'https://gitlab.com',
        privateToken: 'test-token',
      };
      const since = new Date('2024-01-01');
      const until = new Date('2024-12-31');

      await service.syncData(config, since, until);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/sync', {
        baseUrl: config.baseUrl,
        privateToken: config.privateToken,
        groupId: undefined,
        projectId: undefined,
        since: since.toISOString(),
        until: until.toISOString(),
      });
    });
  });

  describe('getUsers', () => {
    it('should fetch users from API', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', name: 'User One' },
        { id: 2, username: 'user2', name: 'User Two' },
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockUsers });

      const users = await service.getUsers();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
      expect(users).toEqual(mockUsers);
    });
  });

  describe('getEvents', () => {
    it('should fetch events without filters', async () => {
      const mockEvents = [{ id: 1, action_name: 'pushed to' }];
      mockAxiosInstance.get.mockResolvedValue({ data: mockEvents });

      const events = await service.getEvents();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/events', { params: {} });
      expect(events).toEqual(mockEvents);
    });

    it('should fetch events with date filters', async () => {
      const mockEvents = [{ id: 1, action_name: 'pushed to' }];
      mockAxiosInstance.get.mockResolvedValue({ data: mockEvents });

      const since = new Date('2024-01-01');
      const until = new Date('2024-12-31');

      await service.getEvents(since, until);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/events', {
        params: {
          since: since.toISOString(),
          until: until.toISOString(),
        },
      });
    });

    it('should fetch events with userId filter', async () => {
      const mockEvents = [{ id: 1, action_name: 'pushed to' }];
      mockAxiosInstance.get.mockResolvedValue({ data: mockEvents });

      await service.getEvents(undefined, undefined, 123);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/events', {
        params: { userId: '123' },
      });
    });
  });

  describe('getStats', () => {
    it('should fetch statistics', async () => {
      const mockStats = {
        totalUsers: 10,
        totalCommits: 100,
        totalAdditions: 500,
        totalDeletions: 200,
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockStats });

      const stats = await service.getStats();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/stats', { params: {} });
      expect(stats).toEqual(mockStats);
    });
  });

  describe('getUserActivities', () => {
    it('should calculate user activities from users and events', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', name: 'User One' },
        { id: 2, username: 'user2', name: 'User Two' },
      ];
      const mockEvents = [
        {
          id: 1,
          author_id: 1,
          action_name: 'pushed to',
          push_data: { commit_count: 5 },
        },
        {
          id: 2,
          author_id: 1,
          action_name: 'pushed to',
          push_data: { commit_count: 3 },
        },
        {
          id: 3,
          author_id: 2,
          action_name: 'opened',
        },
      ];

      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: mockUsers })
        .mockResolvedValueOnce({ data: mockEvents });

      const activities = await service.getUserActivities();

      expect(activities).toHaveLength(2);
      expect(activities[0].user.id).toBe(1);
      expect(activities[0].totalCommits).toBe(8); // 5 + 3
      expect(activities[1].user.id).toBe(2);
      expect(activities[1].totalCommits).toBe(0);
    });
  });
});
