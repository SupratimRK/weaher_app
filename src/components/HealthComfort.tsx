import React from 'react';
import {
  Heart,
  Thermometer,
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb
} from 'lucide-react';
import type { WeatherData, AirQuality } from '../types/weather';
import { 
  calculateComfortIndex,
  calculateHeatIndex,
  calculateWindChill,
  getActivityRecommendations,
  formatTemperature
} from '../utils/weatherUtils';

interface HealthComfortProps {
  weather: WeatherData;
  airQuality: AirQuality;
}

export const HealthComfort: React.FC<HealthComfortProps> = ({ 
  weather, 
  airQuality 
}) => {
  const currentWeather = weather.current;
  const comfort = calculateComfortIndex(
    currentWeather.temperature_2m,
    currentWeather.relative_humidity_2m,
    currentWeather.wind_speed_10m
  );

  const heatIndex = calculateHeatIndex(
    currentWeather.temperature_2m,
    currentWeather.relative_humidity_2m
  );

  const windChill = calculateWindChill(
    currentWeather.temperature_2m,
    currentWeather.wind_speed_10m
  );

  const recommendations = getActivityRecommendations(
    currentWeather.temperature_2m,
    currentWeather.relative_humidity_2m,
    currentWeather.uv_index || 0,
    airQuality.aqi
  );

  const getComfortColor = (level: string) => {
    switch (level) {
      case 'comfortable': return 'text-green-400';
      case 'humid': return 'text-yellow-400';
      case 'muggy': return 'text-orange-400';
      case 'dry': return 'text-blue-400';
      case 'cold': return 'text-blue-300';
      case 'hot': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getOutdoorRating = () => {
    let score = 100;
    
    // Temperature penalties
    if (currentWeather.temperature_2m < 0) score -= 30;
    else if (currentWeather.temperature_2m < 10) score -= 20;
    else if (currentWeather.temperature_2m > 35) score -= 25;
    else if (currentWeather.temperature_2m > 30) score -= 15;
    
    // Humidity penalties
    if (currentWeather.relative_humidity_2m > 80) score -= 15;
    else if (currentWeather.relative_humidity_2m < 20) score -= 10;
    
    // Wind penalties
    if (currentWeather.wind_speed_10m > 30) score -= 20;
    else if (currentWeather.wind_speed_10m > 20) score -= 10;
    
    // UV penalties
    const uvIndex = currentWeather.uv_index || 0;
    if (uvIndex > 8) score -= 15;
    else if (uvIndex > 6) score -= 10;
    
    // Air quality penalties
    if (airQuality.aqi > 150) score -= 30;
    else if (airQuality.aqi > 100) score -= 20;
    else if (airQuality.aqi > 50) score -= 10;
    
    score = Math.max(0, score);
    
    if (score >= 85) return { rating: 'excellent', color: 'text-green-400', description: 'Perfect for outdoor activities' };
    if (score >= 70) return { rating: 'good', color: 'text-green-300', description: 'Great for most outdoor activities' };
    if (score >= 55) return { rating: 'fair', color: 'text-yellow-400', description: 'Okay for light outdoor activities' };
    if (score >= 35) return { rating: 'poor', color: 'text-orange-400', description: 'Limited outdoor activities recommended' };
    return { rating: 'hazardous', color: 'text-red-400', description: 'Stay indoors if possible' };
  };

  const outdoorRating = getOutdoorRating();

  return (
    <div className="weather-card animate-slide-in-up">
      <div className="mb-6">
        <h3 className="text-white font-bold text-xl sm:text-2xl text-shadow mb-2">
          📊 Health & Comfort Index
        </h3>
        <p className="text-white/70 text-sm sm:text-base">
          Comfort analysis and health recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comfort Meter */}
        <div className="stat-card">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className={`w-6 h-6 ${getComfortColor(comfort.comfort_level)}`} />
            <span className="text-white font-semibold">Comfort Level</span>
          </div>

          <div className="text-center mb-4">
            <div className={`text-2xl font-bold mb-2 ${getComfortColor(comfort.comfort_level)}`}>
              {comfort.comfort_level.charAt(0).toUpperCase() + comfort.comfort_level.slice(1)}
            </div>
            <p className="text-white/80 text-sm">
              {comfort.comfort_description}
            </p>
          </div>

          <div className="space-y-3">
            {/* Feels Like Temperature */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-white/80 text-sm">Feels Like</span>
              </div>
              <span className="text-white font-semibold">
                {formatTemperature(currentWeather.apparent_temperature)}
              </span>
            </div>

            {/* Heat Index (if applicable) */}
            {currentWeather.temperature_2m >= 27 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <span className="text-white/80 text-sm">Heat Index</span>
                </div>
                <span className="text-white font-semibold">
                  {formatTemperature(heatIndex)}
                </span>
              </div>
            )}

            {/* Wind Chill (if applicable) */}
            {currentWeather.temperature_2m <= 10 && currentWeather.wind_speed_10m >= 4.8 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80 text-sm">Wind Chill</span>
                </div>
                <span className="text-white font-semibold">
                  {formatTemperature(windChill)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Outdoor Activity Rating */}
        <div className="stat-card">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className={`w-6 h-6 ${outdoorRating.color}`} />
            <span className="text-white font-semibold">Outdoor Activity Rating</span>
          </div>

          <div className="text-center mb-4">
            <div className={`text-2xl font-bold mb-2 ${outdoorRating.color}`}>
              {outdoorRating.rating.charAt(0).toUpperCase() + outdoorRating.rating.slice(1)}
            </div>
            <p className="text-white/80 text-sm">
              {outdoorRating.description}
            </p>
          </div>

          {/* Rating Indicators */}
          <div className="space-y-2">
            {outdoorRating.rating === 'excellent' && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Perfect conditions!</span>
              </div>
            )}
            {(outdoorRating.rating === 'poor' || outdoorRating.rating === 'hazardous') && (
              <div className="flex items-center space-x-2 text-orange-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Use caution outdoors</span>
              </div>
            )}
            {(outdoorRating.rating === 'good' || outdoorRating.rating === 'fair') && (
              <div className="flex items-center space-x-2 text-blue-400">
                <Info className="w-4 h-4" />
                <span className="text-sm">Generally suitable</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Recommendations */}
      <div className="mt-6">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
          Health & Activity Recommendations
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((recommendation, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-white/90 text-sm leading-relaxed">
                  {recommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <h4 className="text-white font-semibold mb-3">Today's Comfort Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Temperature</div>
            <div className="text-white font-semibold">{formatTemperature(currentWeather.temperature_2m)}</div>
          </div>
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Humidity</div>
            <div className="text-white font-semibold">{currentWeather.relative_humidity_2m}%</div>
          </div>
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">UV Index</div>
            <div className="text-white font-semibold">{currentWeather.uv_index || 'N/A'}</div>
          </div>
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Air Quality</div>
            <div className="text-white font-semibold">{airQuality.aqi} AQI</div>
          </div>
        </div>
      </div>
    </div>
  );
};
