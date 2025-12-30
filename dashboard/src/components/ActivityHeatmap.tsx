import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ActivityHeatmapProps {
  commitsByDayOfWeek: number[];
  commitsByHour: number[];
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ActivityHeatmap({ commitsByDayOfWeek, commitsByHour }: ActivityHeatmapProps) {
  const dayData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Commits',
        data: commitsByDayOfWeek,
        backgroundColor: commitsByDayOfWeek.map((_, i) =>
          i === 0 || i === 6 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(99, 102, 241, 0.7)'
        ),
        borderColor: commitsByDayOfWeek.map((_, i) =>
          i === 0 || i === 6 ? 'rgb(239, 68, 68)' : 'rgb(99, 102, 241)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const hourData = {
    labels: hourLabels,
    datasets: [
      {
        label: 'Commits',
        data: commitsByHour,
        backgroundColor: commitsByHour.map((_, i) =>
          i >= 9 && i <= 17 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(99, 102, 241, 0.7)'
        ),
        borderColor: commitsByHour.map((_, i) =>
          i >= 9 && i <= 17 ? 'rgb(34, 197, 94)' : 'rgb(99, 102, 241)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const dayOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Commits by Day of Week',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Commits',
        },
      },
    },
  };

  const hourOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Commits by Hour of Day',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Commits',
        },
      },
    },
  };

  return (
    <div className="activity-heatmap">
      <h3 className="heatmap-title">📅 Activity Patterns</h3>
      <div className="heatmap-charts">
        <div className="heatmap-chart" style={{ height: '250px' }}>
          <Bar data={dayData} options={dayOptions} />
        </div>
        <div className="heatmap-chart" style={{ height: '250px' }}>
          <Bar data={hourData} options={hourOptions} />
        </div>
      </div>
      <div className="heatmap-legend">
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'rgba(239, 68, 68, 0.7)' }}></span>
          Weekend
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'rgba(34, 197, 94, 0.7)' }}></span>
          Business Hours (9-17)
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'rgba(99, 102, 241, 0.7)' }}></span>
          Other
        </span>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
