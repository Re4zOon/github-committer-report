import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import 'hammerjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
  zoomPlugin
);

interface TimelineChartProps {
  commitsByDay: { [date: string]: number };
  title?: string;
}

export function TimelineChart({ commitsByDay, title = 'Commits Timeline' }: TimelineChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const sortedDates = Object.keys(commitsByDay).sort();
  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Commits',
        data: sortedDates.map((date) => commitsByDay[date]),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x' as const,
          modifierKey: undefined,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1,
          },
          mode: 'x' as const,
        },
      },
      tooltip: {
        callbacks: {
          title: (context: { label: string }[]) => {
            const date = new Date(context[0].label);
            return date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Commits',
        },
      },
    },
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  useEffect(() => {
    const chart = chartRef.current;
    // Cleanup on unmount
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return (
    <div className="timeline-chart-container">
      <div className="chart-controls">
        <button onClick={resetZoom} className="reset-zoom-btn">
          Reset Zoom
        </button>
        <span className="chart-hint">
          🖱️ Scroll to zoom • Drag to pan • Shift+Drag to select range
        </span>
      </div>
      <div className="chart-wrapper" style={{ height: '400px' }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}

export default TimelineChart;
