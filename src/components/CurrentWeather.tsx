import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  MapPin,
  Sunrise,
  Sunset
} from 'lucide-react';
import type { WeatherData, Location } from '../types/weather';
import { getWeatherCode, formatTemperature, formatWindSpeed, formatHumidity, formatPressure, getWindDirection } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  weather: WeatherData;
  location: Location;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, location }) => {
  const currentWeather = weather.current;
  const weatherCode = getWeatherCode(currentWeather.weather_code);

  const statsData = [
    {
      icon: Thermometer,
      label: 'Feels like',
      value: formatTemperature(currentWeather.apparent_temperature),
      color: 'text-orange-300'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: formatHumidity(currentWeather.relative_humidity_2m),
      color: 'text-blue-300'
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${formatWindSpeed(currentWeather.wind_speed_10m)} ${getWindDirection(currentWeather.wind_direction_10m)}`,
      color: 'text-gray-300'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${Math.round((100 - currentWeather.cloud_cover) / 10)}km`,
      color: 'text-purple-300'
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: formatPressure(currentWeather.pressure_msl),
      color: 'text-green-300'
    }
  ];  return (
    <div className="weather-card animate-fade-in">
      {/* Location */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center glass-card px-4 py-2 rounded-full">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 mr-2" />
          <span className="text-white text-base sm:text-lg font-medium">
            {location.city}, {location.country}
          </span>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="flex items-center justify-center mb-6 pulse-glow rounded-full w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-white/10">
          <WeatherIcon 
            code={currentWeather.weather_code} 
            isDay={currentWeather.is_day === 1}
            size="large"
          />
        </div>
        
        <div className="mb-4">
          <span className="text-5xl sm:text-6xl lg:text-7xl font-light text-white text-shadow-lg gradient-text block">
            {formatTemperature(currentWeather.temperature_2m)}
          </span>
        </div>
        
        <p className="text-white/90 text-xl sm:text-2xl capitalize mb-6 text-shadow">
          {weatherCode.description}
        </p>
        
        <div className="flex items-center justify-center space-x-6 text-sm sm:text-base text-white/80">
          <div className="flex items-center space-x-1">
            <span className="text-red-300">H:</span>
            <span className="font-semibold">{formatTemperature(Math.max(...weather.daily.temperature_2m_max.slice(0, 1)))}</span>
          </div>
          <div className="w-px h-4 bg-white/30"></div>
          <div className="flex items-center space-x-1">
            <span className="text-blue-300">L:</span>
            <span className="font-semibold">{formatTemperature(Math.min(...weather.daily.temperature_2m_min.slice(0, 1)))}</span>
          </div>
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statsData.map((stat, index) => (
          <div 
            key={stat.label}
            className="stat-card animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex-shrink-0">
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/60 text-xs uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
                <p className="text-white font-semibold text-sm sm:text-base truncate">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sun Times */}
      <div className="flex items-center justify-between pt-6 border-t border-white/20">
        <div className="flex items-center space-x-3 glass-card px-4 py-2 rounded-full">
          <Sunrise className="w-4 h-4 text-yellow-300" />
          <div>
            <p className="text-white/60 text-xs uppercase">Sunrise</p>
            <p className="text-white text-sm font-medium">6:32 AM</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 glass-card px-4 py-2 rounded-full">
          <Sunset className="w-4 h-4 text-orange-300" />
          <div>
            <p className="text-white/60 text-xs uppercase">Sunset</p>
            <p className="text-white text-sm font-medium">7:45 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};
