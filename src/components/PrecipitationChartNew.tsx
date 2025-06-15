import React, { useState } from 'react';
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
import type { WeatherData } from '../types/weather';
import { formatTime } from '../utils/weatherUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PrecipitationChartProps {
  weather: WeatherData;
}

type TimePeriod = '24h' | '48h' | '72h';

export const PrecipitationChart: React.FC<PrecipitationChartProps> = ({ weather }) => {
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
  const precipitation = weather.hourly.precipitation.slice(0, hours);
  const precipitationProbability = weather.hourly.precipitation_probability.slice(0, hours);

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
        label: 'Precipitation (mm)',
        data: precipitation,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Probability (%)',
        data: precipitationProbability,
        backgroundColor: 'rgba(34, 197, 94, 0.4)',
        borderColor: 'rgba(34, 197, 94, 0.6)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'rect',
        }
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
            if (context.datasetIndex === 0) {
              return `Precipitation: ${context.parsed.y.toFixed(1)}mm`;
            } else {
              return `Probability: ${context.parsed.y}%`;
            }
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
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
            return `${value}mm`;
          }
        },
        title: {
          display: true,
          text: 'Precipitation (mm)',
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return `${value}%`;
          }
        },
        title: {
          display: true,
          text: 'Probability (%)',
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
          }
        },
        max: 100,
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-bold text-lg sm:text-xl text-shadow">Precipitation Forecast</h3>
          
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
           selectedPeriod === '48h' ? 'Next 48 hours' : 'Next 3 days'} rain forecast and probability
        </p>
      </div>
      <div className="h-48 sm:h-56 lg:h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
