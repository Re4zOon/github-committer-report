import pool from '../config/database.js';
import type { GitLabUser, GitLabEvent, GitLabCommit, GitLabProject } from '../types/gitlab.js';

export class DatabaseService {
  // Users
  async saveUser(user: GitLabUser): Promise<void> {
    await pool.query(
      `INSERT INTO users (id, username, name, state, avatar_url, web_url, email, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET
         username = EXCLUDED.username,
         name = EXCLUDED.name,
         state = EXCLUDED.state,
         avatar_url = EXCLUDED.avatar_url,
         web_url = EXCLUDED.web_url,
         email = EXCLUDED.email,
         updated_at = CURRENT_TIMESTAMP`,
      [user.id, user.username, user.name, user.state, user.avatar_url, user.web_url, user.email]
    );
  }

  async saveUsers(users: GitLabUser[]): Promise<void> {
    for (const user of users) {
      await this.saveUser(user);
    }
  }

  async getUsers(): Promise<GitLabUser[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY name');
    return result.rows;
  }

  // Events
  async saveEvent(event: GitLabEvent): Promise<void> {
    await pool.query(
      `INSERT INTO events (id, user_id, project_id, action_name, target_id, target_type, 
                           target_title, created_at, push_commit_count, push_action, 
                           push_ref_type, push_ref)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO NOTHING`,
      [
        event.id,
        event.author_id,
        event.project_id,
        event.action_name,
        event.target_id,
        event.target_type,
        event.target_title,
        event.created_at,
        event.push_data?.commit_count || null,
        event.push_data?.action || null,
        event.push_data?.ref_type || null,
        event.push_data?.ref || null,
      ]
    );
  }

  async saveEvents(events: GitLabEvent[]): Promise<void> {
    for (const event of events) {
      await this.saveEvent(event);
    }
  }

  async getEvents(since?: Date, until?: Date): Promise<GitLabEvent[]> {
    let query = 'SELECT * FROM events';
    const params: any[] = [];
    const conditions: string[] = [];

    if (since) {
      params.push(since.toISOString());
      conditions.push(`created_at >= $${params.length}`);
    }
    if (until) {
      params.push(until.toISOString());
      conditions.push(`created_at <= $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapEventRow(row));
  }

  async getUserEvents(userId: number, since?: Date, until?: Date): Promise<GitLabEvent[]> {
    let query = 'SELECT * FROM events WHERE user_id = $1';
    const params: any[] = [userId];

    if (since) {
      params.push(since.toISOString());
      query += ` AND created_at >= $${params.length}`;
    }
    if (until) {
      params.push(until.toISOString());
      query += ` AND created_at <= $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return result.rows.map(row => this.mapEventRow(row));
  }

  private mapEventRow(row: any): GitLabEvent {
    return {
      id: row.id,
      project_id: row.project_id,
      action_name: row.action_name,
      target_id: row.target_id,
      target_type: row.target_type,
      author_id: row.user_id,
      target_title: row.target_title,
      created_at: row.created_at,
      author: { id: row.user_id, username: '', name: '', avatar_url: '' },
      push_data: row.push_commit_count ? {
        commit_count: row.push_commit_count,
        action: row.push_action,
        ref_type: row.push_ref_type,
        commit_from: null,
        commit_to: null,
        ref: row.push_ref,
      } : undefined,
    };
  }

  // Commits
  async saveCommit(commit: GitLabCommit, projectId: number): Promise<void> {
    await pool.query(
      `INSERT INTO commits (id, short_id, title, message, author_name, author_email,
                            authored_date, committer_name, committer_email, committed_date,
                            web_url, additions, deletions, total, project_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       ON CONFLICT (id) DO NOTHING`,
      [
        commit.id,
        commit.short_id,
        commit.title,
        commit.message,
        commit.author_name,
        commit.author_email,
        commit.authored_date,
        commit.committer_name,
        commit.committer_email,
        commit.committed_date,
        commit.web_url,
        commit.stats?.additions || 0,
        commit.stats?.deletions || 0,
        commit.stats?.total || 0,
        projectId,
      ]
    );
  }

  async saveCommits(commits: GitLabCommit[], projectId: number): Promise<void> {
    for (const commit of commits) {
      await this.saveCommit(commit, projectId);
    }
  }

  // Projects
  async saveProject(project: GitLabProject): Promise<void> {
    await pool.query(
      `INSERT INTO projects (id, name, name_with_namespace, path, path_with_namespace, 
                             web_url, avatar_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         name_with_namespace = EXCLUDED.name_with_namespace,
         path = EXCLUDED.path,
         path_with_namespace = EXCLUDED.path_with_namespace,
         web_url = EXCLUDED.web_url,
         avatar_url = EXCLUDED.avatar_url,
         updated_at = CURRENT_TIMESTAMP`,
      [
        project.id,
        project.name,
        project.name_with_namespace,
        project.path,
        project.path_with_namespace,
        project.web_url,
        project.avatar_url,
      ]
    );
  }

  async saveProjects(projects: GitLabProject[]): Promise<void> {
    for (const project of projects) {
      await this.saveProject(project);
    }
  }

  async getProjects(): Promise<GitLabProject[]> {
    const result = await pool.query('SELECT * FROM projects ORDER BY name');
    return result.rows;
  }
}

export default new DatabaseService();
