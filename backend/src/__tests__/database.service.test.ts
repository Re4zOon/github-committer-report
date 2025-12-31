import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseService } from '../services/database.service';

// Mock the pool module
vi.mock('../config/database.js', () => ({
  default: {
    query: vi.fn(),
  },
}));

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    service = new DatabaseService();
    vi.clearAllMocks();
  });

  describe('saveUser', () => {
    it('should insert or update a user', async () => {
      const pool = (await import('../config/database.js')).default;
      const mockUser = {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        state: 'active',
        avatar_url: 'https://example.com/avatar.jpg',
        web_url: 'https://gitlab.com/testuser',
        email: 'test@example.com',
      };

      await service.saveUser(mockUser);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([mockUser.id, mockUser.username, mockUser.name])
      );
    });
  });

  describe('saveUsers', () => {
    it('should save multiple users', async () => {
      const pool = (await import('../config/database.js')).default;
      const mockUsers = [
        { id: 1, username: 'user1', name: 'User 1', state: 'active', avatar_url: '', web_url: '', email: 'user1@example.com' },
        { id: 2, username: 'user2', name: 'User 2', state: 'active', avatar_url: '', web_url: '', email: 'user2@example.com' },
      ];

      await service.saveUsers(mockUsers);
      expect(pool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('getUsers', () => {
    it('should retrieve all users', async () => {
      const pool = (await import('../config/database.js')).default;
      const mockRows = [
        { id: 1, username: 'user1', name: 'User 1' },
        { id: 2, username: 'user2', name: 'User 2' },
      ];
      
      (pool.query as any).mockResolvedValue({ rows: mockRows });

      const users = await service.getUsers();
      expect(users).toEqual(mockRows);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users'));
    });
  });

  describe('saveEvent', () => {
    it('should insert an event', async () => {
      const pool = (await import('../config/database.js')).default;
      const mockEvent = {
        id: 1,
        author_id: 1,
        project_id: 100,
        action_name: 'pushed to',
        target_id: 1,
        target_type: 'MergeRequest',
        target_title: 'Test Commit',
        created_at: new Date().toISOString(),
        author: { id: 1, username: 'user1', name: 'User 1', avatar_url: '' },
        push_data: {
          commit_count: 3,
          action: 'pushed',
          ref_type: 'branch',
          ref: 'main',
          commit_from: null,
          commit_to: null,
        },
      };

      await service.saveEvent(mockEvent);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO events'),
        expect.any(Array)
      );
    });
  });

  describe('getEvents', () => {
    it('should retrieve events with date filters', async () => {
      const pool = (await import('../config/database.js')).default;
      const since = new Date('2024-01-01');
      const until = new Date('2024-12-31');
      
      const mockRows = [
        {
          id: 1,
          user_id: 1,
          project_id: 100,
          action_name: 'pushed to',
          created_at: '2024-06-15T10:00:00Z',
          push_commit_count: 3,
        },
      ];
      
      (pool.query as any).mockResolvedValue({ rows: mockRows });

      const events = await service.getEvents(since, until);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.arrayContaining([since.toISOString(), until.toISOString()])
      );
    });
  });

  describe('saveProject', () => {
    it('should insert or update a project', async () => {
      const pool = (await import('../config/database.js')).default;
      const mockProject = {
        id: 1,
        name: 'test-project',
        name_with_namespace: 'group/test-project',
        path: 'test-project',
        path_with_namespace: 'group/test-project',
        web_url: 'https://gitlab.com/group/test-project',
        avatar_url: '',
      };

      await service.saveProject(mockProject);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        expect.arrayContaining([mockProject.id, mockProject.name])
      );
    });
  });
});
