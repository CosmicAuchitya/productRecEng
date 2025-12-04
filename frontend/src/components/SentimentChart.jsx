import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CONFIG } from '../config';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentChart({ positive, negative }) {
  const neutral = 100 - (positive + negative);
  
  const data = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [positive, negative, neutral],
        backgroundColor: [
          '#22c55e', // Green
          '#ef4444', // Red
          '#e5e7eb', // Gray
        ],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { 
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw.toFixed(1)}%`
        }
      }
    }
  };

  return (
    <div className="relative w-32 h-32">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
        <span className="text-xl font-bold text-gray-800">{positive.toFixed(0)}%</span>
        <span className="text-[10px] text-gray-400 uppercase">Positive</span>
      </div>
    </div>
  );
}