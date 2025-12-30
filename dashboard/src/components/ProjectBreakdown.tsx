import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProjectBreakdownProps {
  projectBreakdown: { project: string; commits: number }[];
}

const colors = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(34, 197, 94, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(168, 85, 247, 0.8)',
  'rgba(6, 182, 212, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(132, 204, 22, 0.8)',
  'rgba(251, 146, 60, 0.8)',
  'rgba(59, 130, 246, 0.8)',
];

const borderColors = colors.map((c) => c.replace('0.8', '1'));

export function ProjectBreakdown({ projectBreakdown }: ProjectBreakdownProps) {
  const data = {
    labels: projectBreakdown.map((p) => p.project),
    datasets: [
      {
        data: projectBreakdown.map((p) => p.commits),
        backgroundColor: colors.slice(0, projectBreakdown.length),
        borderColor: borderColors.slice(0, projectBreakdown.length),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Commits by Project',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
  };

  const totalCommits = projectBreakdown.reduce((sum, p) => sum + p.commits, 0);

  return (
    <div className="project-breakdown">
      <h3 className="breakdown-title">📁 Repository Breakdown</h3>
      <div className="breakdown-content">
        <div className="breakdown-chart" style={{ height: '300px' }}>
          <Doughnut data={data} options={options} />
        </div>
        <div className="breakdown-list">
          {projectBreakdown.map((p, index) => (
            <div key={p.project} className="breakdown-item">
              <span
                className="breakdown-color"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="breakdown-project">{p.project}</span>
              <span className="breakdown-commits">{p.commits}</span>
              <span className="breakdown-percent">
                ({((p.commits / totalCommits) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectBreakdown;
