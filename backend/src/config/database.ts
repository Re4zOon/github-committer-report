import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'gitlab_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function initDatabase() {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        state VARCHAR(50),
        avatar_url TEXT,
        web_url TEXT,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id BIGINT PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        project_id INTEGER,
        action_name VARCHAR(255),
        target_id INTEGER,
        target_type VARCHAR(100),
        target_title TEXT,
        created_at TIMESTAMP NOT NULL,
        push_commit_count INTEGER,
        push_action VARCHAR(50),
        push_ref_type VARCHAR(50),
        push_ref VARCHAR(255)
      )
    `);

    // Create commits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS commits (
        id VARCHAR(255) PRIMARY KEY,
        short_id VARCHAR(50),
        title TEXT,
        message TEXT,
        author_name VARCHAR(255),
        author_email VARCHAR(255),
        authored_date TIMESTAMP,
        committer_name VARCHAR(255),
        committer_email VARCHAR(255),
        committed_date TIMESTAMP,
        web_url TEXT,
        additions INTEGER DEFAULT 0,
        deletions INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0,
        project_id INTEGER
      )
    `);

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_with_namespace VARCHAR(500),
        path VARCHAR(255),
        path_with_namespace VARCHAR(500),
        web_url TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
      CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
      CREATE INDEX IF NOT EXISTS idx_events_project_id ON events(project_id);
      CREATE INDEX IF NOT EXISTS idx_commits_project_id ON commits(project_id);
      CREATE INDEX IF NOT EXISTS idx_commits_committed_date ON commits(committed_date);
      CREATE INDEX IF NOT EXISTS idx_commits_author_email ON commits(author_email);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
