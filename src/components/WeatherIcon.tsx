import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle, 
  HelpCircle,
  CloudSun,
  CloudFog,
  CloudLightning,
  Snowflake,
  CloudHail,
  Moon,
  CloudMoon,
  Droplets,
  Wind,
  Umbrella
} from 'lucide-react';
import { getWeatherCode } from '../utils/weatherUtils';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  code, 
  isDay = true, 
  size = 'medium',
  className = '' 
}) => {
  const weatherCode = getWeatherCode(code);
  
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-16 h-16'
  };

  const iconSize = sizeClasses[size];
  const baseClass = `${iconSize} drop-shadow-lg`;
  const getIcon = () => {
    switch (weatherCode.icon) {
      case 'sun':
        return isDay 
          ? <Sun className={`${baseClass} text-yellow-300 animate-pulse-slow`} /> 
          : <Moon className={`${baseClass} text-blue-100`} />;
      case 'cloud-sun':
        return isDay
          ? <CloudSun className={`${baseClass} text-yellow-200`} />
          : <CloudMoon className={`${baseClass} text-blue-100`} />;
      case 'cloud':
        return <Cloud className={`${baseClass} text-gray-300`} />;
      case 'cloud-rain-light':
        return <CloudRain className={`${baseClass} text-blue-200`} />;
      case 'cloud-rain':
        return <CloudRain className={`${baseClass} text-blue-300`} />;
      case 'cloud-rain-heavy':
        return (
          <div className="relative">
            <CloudRain className={`${baseClass} text-blue-400`} />
            <Droplets className="absolute bottom-0 right-0 w-4 h-4 text-blue-400 animate-bounce" />
          </div>
        );
      case 'cloud-drizzle':
        return <CloudDrizzle className={`${baseClass} text-blue-300`} />;
      case 'cloud-snow-light':
        return <CloudSnow className={`${baseClass} text-blue-100`} />;
      case 'cloud-snow':
        return <CloudSnow className={`${baseClass} text-blue-100`} />;
      case 'cloud-snow-heavy':
        return (
          <div className="relative">
            <CloudSnow className={`${baseClass} text-blue-100`} />
            <Snowflake className="absolute bottom-0 right-0 w-3 h-3 text-blue-100 animate-spin-slow" />
          </div>
        );
      case 'thunderstorm':
        return <CloudLightning className={`${baseClass} text-yellow-400`} />;
      case 'thunderstorm-hail':
        return (
          <div className="relative">
            <CloudLightning className={`${baseClass} text-yellow-400`} />
            <CloudHail className="absolute bottom-0 right-0 w-4 h-4 text-blue-200" />
          </div>
        );
      case 'cloud-fog':
        return <CloudFog className={`${baseClass} text-gray-400`} />;
      case 'shower':
        return <Umbrella className={`${baseClass} text-blue-300`} />;
      case 'windy':
        return <Wind className={`${baseClass} text-gray-400`} />;
      default:
        return <HelpCircle className={`${baseClass} text-gray-300`} />;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {getIcon()}
    </div>
  );
};
