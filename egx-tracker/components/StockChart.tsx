'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface StockChartProps {
  data: number[];
  isPositive: boolean;
}

export default function StockChart({ data, isPositive }: StockChartProps) {
  const chartData = {
    labels: data.map((_, i) => ''),
    datasets: [
      {
        data: data,
        borderColor: isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        backgroundColor: isPositive 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        borderWidth: 1,
        padding: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(2)} ج.م`,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="h-24">
      <Line data={chartData} options={options} />
    </div>
  );
}
