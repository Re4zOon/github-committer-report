import type { GitLabUser } from '../types/gitlab';

interface ContributorLeaderboardProps {
  topContributors: { user: GitLabUser; commits: number }[];
}

export function ContributorLeaderboard({ topContributors }: ContributorLeaderboardProps) {
  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  const maxCommits = topContributors[0]?.commits || 1;

  return (
    <div className="leaderboard">
      <h3 className="leaderboard-title">🏆 Top Contributors</h3>
      <div className="leaderboard-list">
        {topContributors.map((contributor, index) => (
          <div key={contributor.user.id} className="leaderboard-item">
            <div className="leaderboard-rank">{getMedalEmoji(index)}</div>
            <img
              src={contributor.user.avatar_url}
              alt={contributor.user.name}
              className="leaderboard-avatar"
            />
            <div className="leaderboard-info">
              <div className="leaderboard-name">{contributor.user.name}</div>
              <div className="leaderboard-username">@{contributor.user.username}</div>
            </div>
            <div className="leaderboard-stats">
              <div className="leaderboard-commits">{contributor.commits} commits</div>
              <div className="leaderboard-bar-container">
                <div
                  className="leaderboard-bar"
                  style={{
                    width: `${(contributor.commits / maxCommits) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContributorLeaderboard;
