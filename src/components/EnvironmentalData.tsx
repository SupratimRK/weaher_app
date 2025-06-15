import React from 'react';
import {
  Droplets,
  Wind,
  Eye,
  Sun,
  Gauge,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import type { WeatherData, AirQuality } from '../types/weather';
import { 
  formatHumidity, 
  formatPressure, 
  getUVIndexAdvice, 
  getVisibilityDescription 
} from '../utils/weatherUtils';

interface EnvironmentalDataProps {
  weather: WeatherData;
  airQuality: AirQuality;
}

export const EnvironmentalData: React.FC<EnvironmentalDataProps> = ({ 
  weather, 
  airQuality 
}) => {
  const currentWeather = weather.current;

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    if (aqi <= 300) return 'text-purple-400';
    return 'text-red-600';
  };

  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'text-green-400';
    if (uv <= 5) return 'text-yellow-400';
    if (uv <= 7) return 'text-orange-400';
    if (uv <= 10) return 'text-red-400';
    return 'text-purple-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'worsening': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const environmentalData = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: formatHumidity(currentWeather.relative_humidity_2m),
      description: currentWeather.relative_humidity_2m > 70 ? 'High humidity' : 
                   currentWeather.relative_humidity_2m < 30 ? 'Low humidity' : 'Comfortable',
      color: 'text-blue-300'
    },
    {
      icon: Activity,
      label: 'Air Quality',
      value: `${airQuality.aqi} AQI`,
      description: airQuality.health_advisory,
      color: getAQIColor(airQuality.aqi),
      trend: getTrendIcon(airQuality.trend)
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: currentWeather.uv_index?.toString() || 'N/A',
      description: getUVIndexAdvice(currentWeather.uv_index || 0),
      color: getUVColor(currentWeather.uv_index || 0)
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: formatPressure(currentWeather.pressure_msl),
      description: currentWeather.pressure_msl > 1020 ? 'High pressure' : 
                   currentWeather.pressure_msl < 1000 ? 'Low pressure' : 'Normal',
      color: 'text-green-300'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${(currentWeather.visibility || 10).toFixed(1)}km`,
      description: getVisibilityDescription(currentWeather.visibility || 10),
      color: 'text-purple-300'
    },
    {
      icon: Wind,
      label: 'Wind Quality',
      value: `${Math.round(currentWeather.wind_speed_10m)} km/h`,
      description: currentWeather.wind_speed_10m > 20 ? 'Windy conditions' : 
                   currentWeather.wind_speed_10m < 5 ? 'Calm' : 'Light breeze',
      color: 'text-gray-300'
    }
  ];

  return (
    <div className="weather-card animate-slide-in-up">
      <div className="mb-6">
        <h3 className="text-white font-bold text-xl sm:text-2xl text-shadow mb-2">
          💨 Environmental & Air Quality
        </h3>
        <p className="text-white/70 text-sm sm:text-base">
          Current environmental conditions and air quality metrics
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {environmentalData.map((item, index) => (
          <div 
            key={item.label}
            className="stat-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-white/80 text-sm font-medium">
                  {item.label}
                </span>
              </div>
              {item.trend && item.trend}
            </div>
            
            <div className="text-white font-bold text-lg mb-1">
              {item.value}
            </div>
            
            <p className="text-white/60 text-xs leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Air Quality Details */}
      {airQuality.aqi > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
            Air Quality Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-white/60">PM2.5:</span>
              <span className="text-white ml-1">{airQuality.pm2_5.toFixed(1)}μg/m³</span>
            </div>
            <div>
              <span className="text-white/60">PM10:</span>
              <span className="text-white ml-1">{airQuality.pm10.toFixed(1)}μg/m³</span>
            </div>
            <div>
              <span className="text-white/60">O₃:</span>
              <span className="text-white ml-1">{airQuality.ozone.toFixed(1)}μg/m³</span>
            </div>
            <div>
              <span className="text-white/60">NO₂:</span>
              <span className="text-white ml-1">{airQuality.nitrogen_dioxide.toFixed(1)}μg/m³</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
