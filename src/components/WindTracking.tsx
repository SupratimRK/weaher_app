import React from 'react';
import { Wind, Navigation, Zap } from 'lucide-react';
import type { WeatherData } from '../types/weather';
import { formatWindSpeed, getWindDirection, getWindDirectionIcon } from '../utils/weatherUtils';

interface WindTrackingProps {
  weather: WeatherData;
}

export const WindTracking: React.FC<WindTrackingProps> = ({ weather }) => {
  const currentWeather = weather.current;
  const windDirection = getWindDirection(currentWeather.wind_direction_10m);
  const windIcon = getWindDirectionIcon(currentWeather.wind_direction_10m);

  const getWindIntensity = (speed: number) => {
    if (speed < 5) return { level: 'Calm', color: 'text-green-400', description: 'Little to no wind movement' };
    if (speed < 15) return { level: 'Light Breeze', color: 'text-blue-400', description: 'Gentle wind movement' };
    if (speed < 25) return { level: 'Moderate', color: 'text-yellow-400', description: 'Noticeable wind' };
    if (speed < 35) return { level: 'Strong', color: 'text-orange-400', description: 'Strong wind conditions' };
    return { level: 'Very Strong', color: 'text-red-400', description: 'Very strong winds - caution advised' };
  };

  const windIntensity = getWindIntensity(currentWeather.wind_speed_10m);
  const maxWindToday = Math.max(...weather.daily.wind_speed_10m_max.slice(0, 1));

  return (
    <div className="weather-card animate-slide-in-up">
      <div className="mb-6">
        <h3 className="text-white font-bold text-xl sm:text-2xl text-shadow mb-2">
          🌬️ Wind Tracking
        </h3>
        <p className="text-white/70 text-sm sm:text-base">
          Live wind conditions and directional data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wind Speed Meter */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wind className={`w-6 h-6 ${windIntensity.color}`} />
              <span className="text-white font-semibold">Current Wind</span>
            </div>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {formatWindSpeed(currentWeather.wind_speed_10m)}
            </div>
            <div className={`text-sm font-medium mb-2 ${windIntensity.color}`}>
              {windIntensity.level}
            </div>
            <p className="text-white/60 text-xs">
              {windIntensity.description}
            </p>
          </div>

          {/* Wind Speed Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>0</span>
              <span>50+ km/h</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${windIntensity.color.replace('text-', 'bg-')}`}
                style={{ width: `${Math.min((currentWeather.wind_speed_10m / 50) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Gusts Information */}
          <div className="mt-4 p-3 rounded-lg bg-white/5">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Wind Gusts</span>
              <span className="text-white font-semibold">
                {formatWindSpeed(currentWeather.wind_gusts_10m)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-white/80 text-sm">Max Today</span>
              <span className="text-white font-semibold">
                {formatWindSpeed(maxWindToday)}
              </span>
            </div>
          </div>
        </div>

        {/* Wind Direction Compass */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Navigation className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">Wind Direction</span>
            </div>
          </div>

          <div className="text-center">
            {/* Compass Circle */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
              
              {/* Compass Points */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute -top-2 text-white/60 text-xs font-bold">N</div>
                <div className="absolute -right-2 text-white/60 text-xs font-bold">E</div>
                <div className="absolute -bottom-2 text-white/60 text-xs font-bold">S</div>
                <div className="absolute -left-2 text-white/60 text-xs font-bold">W</div>
              </div>

              {/* Wind Direction Arrow */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-1000"
                style={{ transform: `rotate(${currentWeather.wind_direction_10m}deg)` }}
              >
                <div className="text-4xl text-blue-400 font-bold">
                  ↑
                </div>
              </div>

              {/* Center Dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {windDirection}
              </div>
              <div className="text-lg text-blue-400">
                {currentWeather.wind_direction_10m}°
              </div>
              <div className="text-4xl">
                {windIcon}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Wind Forecast */}
      <div className="mt-6">
        <h4 className="text-white font-semibold mb-3">Next 12 Hours Wind Forecast</h4>
        <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
          {weather.hourly.time.slice(0, 12).map((time, index) => {
            const hour = new Date(time).getHours();
            const windSpeed = weather.hourly.wind_speed_10m[index];
            const windDir = weather.hourly.wind_direction_10m?.[index] || 0;
            
            return (
              <div key={time} className="text-center p-2 rounded-lg bg-white/5">
                <div className="text-white/60 text-xs mb-1">
                  {hour === 0 ? '12AM' : hour > 12 ? `${hour-12}PM` : hour === 12 ? '12PM' : `${hour}AM`}
                </div>
                <div 
                  className="text-sm text-blue-400 mb-1"
                  style={{ transform: `rotate(${windDir}deg)` }}
                >
                  ↑
                </div>
                <div className="text-white text-xs font-semibold">
                  {Math.round(windSpeed)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
