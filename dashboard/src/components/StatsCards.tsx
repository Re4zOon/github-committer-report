interface StatsCardsProps {
  totalUsers: number;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
  avgCommitsPerWorkday: number;
}

export function StatsCards({
  totalUsers,
  totalCommits,
  totalAdditions,
  totalDeletions,
  avgCommitsPerWorkday,
}: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: '👥',
      color: '#6366f1',
    },
    {
      title: 'Total Commits',
      value: totalCommits,
      icon: '📝',
      color: '#10b981',
    },
    {
      title: 'Avg Commits/Workday',
      value: avgCommitsPerWorkday.toFixed(1),
      icon: '📊',
      color: '#f59e0b',
    },
    {
      title: 'Lines Added',
      value: totalAdditions.toLocaleString(),
      icon: '➕',
      color: '#22c55e',
    },
    {
      title: 'Lines Deleted',
      value: totalDeletions.toLocaleString(),
      icon: '➖',
      color: '#ef4444',
    },
  ];

  return (
    <div className="stats-cards">
      {cards.map((card) => (
        <div
          key={card.title}
          className="stat-card"
          style={{ borderLeftColor: card.color }}
        >
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-content">
            <h3 className="stat-value">{card.value}</h3>
            <p className="stat-title">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
