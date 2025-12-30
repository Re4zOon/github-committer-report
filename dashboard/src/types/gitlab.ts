// GitLab API Types

export interface GitLabUser {
  id: number;
  username: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
  email?: string;
}

export interface GitLabCommit {
  id: string;
  short_id: string;
  title: string;
  message: string;
  author_name: string;
  author_email: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
  web_url: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export interface GitLabEvent {
  id: number;
  project_id: number;
  action_name: string;
  target_id: number | null;
  target_type: string | null;
  author_id: number;
  target_title: string | null;
  created_at: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatar_url: string;
  };
  push_data?: {
    commit_count: number;
    action: string;
    ref_type: string;
    commit_from: string | null;
    commit_to: string | null;
    ref: string;
  };
}

export interface GitLabProject {
  id: number;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  web_url: string;
  avatar_url: string | null;
}

export interface UserActivity {
  user: GitLabUser;
  events: GitLabEvent[];
  commits: GitLabCommit[];
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
  avgCommitsPerWorkday: number;
  commitsByDay: { [date: string]: number };
  commitsByHour: number[];
  commitsByDayOfWeek: number[];
  topContributors: { user: GitLabUser; commits: number }[];
  projectBreakdown: { project: string; commits: number }[];
}

export interface GitLabConfig {
  baseUrl: string;
  privateToken: string;
  groupId?: string;
  projectId?: string;
}
