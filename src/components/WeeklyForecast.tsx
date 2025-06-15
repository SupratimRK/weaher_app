import React from 'react';
import type { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatDate, formatTemperature } from '../utils/weatherUtils';

interface WeeklyForecastProps {
  weather: WeatherData;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ weather }) => {
  const dailyData = weather.daily;
  return (
    <div className="weather-card">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-white font-bold text-xl sm:text-2xl text-shadow">7-Day Forecast</h3>
        <p className="text-white/70 text-sm sm:text-base">Daily weather outlook</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {dailyData.time.map((date, index) => {
          const isToday = index === 0;
          const dayLabel = isToday ? 'Today' : formatDate(date);

          return (
            <div 
              key={date}
              className="forecast-item animate-slide-in-up group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                {/* Day */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm sm:text-base truncate ${isToday ? 'text-white text-shadow' : 'text-white/90'}`}>
                    {dayLabel}
                  </p>
                  {isToday && (
                    <p className="text-white/60 text-xs">Current day</p>
                  )}
                </div>

                {/* Weather Icon */}
                <div className="flex-shrink-0 mx-3 sm:mx-4">
                  <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <WeatherIcon 
                      code={dailyData.weather_code[index]}
                      size="small"
                    />
                  </div>
                </div>

                {/* Precipitation - Hidden on very small screens */}
                <div className="hidden sm:flex flex-shrink-0 text-center min-w-[70px] mx-2">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">
                      {dailyData.precipitation_probability_max[index]}%
                    </p>
                    <p className="text-white/60 text-xs">
                      {dailyData.precipitation_sum[index].toFixed(1)}mm
                    </p>
                  </div>
                </div>

                {/* Temperature */}
                <div className="flex-shrink-0 text-right min-w-[80px] sm:min-w-[100px]">
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                    <span className="text-white font-bold text-sm sm:text-base">
                      {formatTemperature(dailyData.temperature_2m_max[index])}
                    </span>
                    <span className="text-white/60 text-sm">
                      {formatTemperature(dailyData.temperature_2m_min[index])}
                    </span>
                  </div>
                  {/* Precipitation info for mobile */}
                  <div className="sm:hidden mt-1">
                    <p className="text-blue-300 text-xs">
                      {dailyData.precipitation_probability_max[index]}% • {dailyData.precipitation_sum[index].toFixed(1)}mm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Summary */}
      <div className="mt-6 sm:mt-8 pt-6 border-t border-white/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="stat-card">
            <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-2">
              Avg High
            </p>
            <p className="text-white font-bold text-lg sm:text-xl text-shadow">
              {formatTemperature(
                dailyData.temperature_2m_max.reduce((a, b) => a + b, 0) / dailyData.temperature_2m_max.length
              )}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-2">
              Avg Low
            </p>
            <p className="text-white font-bold text-lg sm:text-xl text-shadow">
              {formatTemperature(
                dailyData.temperature_2m_min.reduce((a, b) => a + b, 0) / dailyData.temperature_2m_min.length
              )}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-2">
              Total Rain
            </p>
            <p className="text-white font-bold text-lg sm:text-xl text-shadow">
              {dailyData.precipitation_sum.reduce((a, b) => a + b, 0).toFixed(1)}mm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
