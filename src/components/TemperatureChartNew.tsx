import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { WeatherData } from '../types/weather';
import { formatTime, formatTemperature } from '../utils/weatherUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TemperatureChartProps {
  weather: WeatherData;
}

type TimePeriod = '24h' | '48h' | '72h';

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ weather }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('24h');

  const getHoursCount = (period: TimePeriod) => {
    switch (period) {
      case '24h': return 24;
      case '48h': return 48;
      case '72h': return 72;
      default: return 24;
    }
  };

  const hours = getHoursCount(selectedPeriod);
  const timeData = weather.hourly.time.slice(0, hours);
  const temperatures = weather.hourly.temperature_2m.slice(0, hours);

  // Format labels based on period
  const formatLabel = (time: string, index: number) => {
    const date = new Date(time);
    if (selectedPeriod === '24h') {
      return formatTime(time);
    } else {
      // For longer periods, show hour for every 6th point, date for others
      if (index % 6 === 0) {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric'
        });
      } else if (index % 3 === 0) {
        return formatTime(time);
      }
      return '';
    }
  };

  const data = {
    labels: timeData.map((time, index) => formatLabel(time, index)),
    datasets: [
      {
        label: 'Temperature',
        data: temperatures,
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        pointBorderColor: 'rgba(59, 130, 246, 0.8)',
        pointBorderWidth: 2,
        pointRadius: selectedPeriod === '24h' ? 4 : 2,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const timeIndex = context[0].dataIndex;
            return new Date(timeData[timeIndex]).toLocaleString('en-US', {
              hour: 'numeric',
              hour12: true,
              month: 'short',
              day: 'numeric'
            });
          },
          label: (context: any) => {
            return `${formatTemperature(context.parsed.y)}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
          },
          maxTicksLimit: selectedPeriod === '24h' ? 8 : 12,
        },
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return formatTemperature(value);
          }
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="chart-container">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-bold text-lg sm:text-xl text-shadow">Temperature Forecast</h3>
          
          {/* Time Period Toggle */}
          <div className="flex items-center space-x-1 bg-white/10 rounded-xl p-1">
            {(['24h', '48h', '72h'] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <p className="text-white/70 text-sm">
          {selectedPeriod === '24h' ? 'Next 24 hours' : 
           selectedPeriod === '48h' ? 'Next 48 hours' : 'Next 3 days'} hourly forecast
        </p>
      </div>
      <div className="h-48 sm:h-56 lg:h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
