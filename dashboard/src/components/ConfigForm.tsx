import { useState } from 'react';
import type { GitLabConfig } from '../types/gitlab';

interface ConfigFormProps {
  onSubmit: (config: GitLabConfig) => void;
  isLoading: boolean;
}

export function ConfigForm({ onSubmit, isLoading }: ConfigFormProps) {
  const [baseUrl, setBaseUrl] = useState('https://gitlab.com');
  const [privateToken, setPrivateToken] = useState('');
  const [groupId, setGroupId] = useState('');
  const [projectId, setProjectId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      baseUrl: baseUrl.replace(/\/$/, ''),
      privateToken,
      groupId: groupId || undefined,
      projectId: projectId || undefined,
    });
  };

  return (
    <form className="config-form" onSubmit={handleSubmit}>
      <h2 className="config-title">🦊 GitLab Configuration</h2>
      <p className="config-description">
        Connect to your GitLab instance to view activity statistics.
      </p>

      <div className="form-group">
        <label htmlFor="baseUrl">GitLab URL</label>
        <input
          id="baseUrl"
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://gitlab.com"
          required
        />
        <span className="form-hint">Your GitLab instance URL (e.g., https://gitlab.com or self-hosted)</span>
      </div>

      <div className="form-group">
        <label htmlFor="privateToken">Private Token</label>
        <input
          id="privateToken"
          type="password"
          value={privateToken}
          onChange={(e) => setPrivateToken(e.target.value)}
          placeholder="glpat-xxxxxxxxxxxx"
          required
        />
        <span className="form-hint">
          Generate a token with <code>read_api</code> scope from Settings → Access Tokens
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="groupId">Group ID (optional)</label>
        <input
          id="groupId"
          type="text"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="my-group or 12345"
        />
        <span className="form-hint">Enter a group ID or path to analyze group members</span>
      </div>

      <div className="form-group">
        <label htmlFor="projectId">Project ID (optional)</label>
        <input
          id="projectId"
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="my-group/my-project or 12345"
        />
        <span className="form-hint">Enter a project ID or path to analyze a specific project</span>
      </div>

      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Loading...
          </>
        ) : (
          'Connect to GitLab'
        )}
      </button>
    </form>
  );
}

export default ConfigForm;
