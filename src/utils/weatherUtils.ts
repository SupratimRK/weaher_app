import type { WeatherCode } from '../types/weather';

export const weatherCodes: Record<number, WeatherCode> = {
  0: { code: 0, description: 'Clear sky', icon: 'sun' },
  1: { code: 1, description: 'Mainly clear', icon: 'sun' },
  2: { code: 2, description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { code: 3, description: 'Overcast', icon: 'cloud' },
  45: { code: 45, description: 'Fog', icon: 'cloud-fog' },
  48: { code: 48, description: 'Depositing rime fog', icon: 'cloud-fog' },
  51: { code: 51, description: 'Light drizzle', icon: 'cloud-drizzle' },
  53: { code: 53, description: 'Moderate drizzle', icon: 'cloud-drizzle' },
  55: { code: 55, description: 'Dense drizzle', icon: 'cloud-drizzle' },
  56: { code: 56, description: 'Light freezing drizzle', icon: 'cloud-drizzle' },
  57: { code: 57, description: 'Dense freezing drizzle', icon: 'cloud-drizzle' },
  61: { code: 61, description: 'Slight rain', icon: 'cloud-rain-light' },
  63: { code: 63, description: 'Moderate rain', icon: 'cloud-rain' },
  65: { code: 65, description: 'Heavy rain', icon: 'cloud-rain-heavy' },
  66: { code: 66, description: 'Light freezing rain', icon: 'cloud-rain-light' },
  67: { code: 67, description: 'Heavy freezing rain', icon: 'cloud-rain-heavy' },
  71: { code: 71, description: 'Slight snow fall', icon: 'cloud-snow-light' },
  73: { code: 73, description: 'Moderate snow fall', icon: 'cloud-snow' },
  75: { code: 75, description: 'Heavy snow fall', icon: 'cloud-snow-heavy' },
  77: { code: 77, description: 'Snow grains', icon: 'cloud-snow-light' },
  80: { code: 80, description: 'Slight rain showers', icon: 'shower' },
  81: { code: 81, description: 'Moderate rain showers', icon: 'shower' },
  82: { code: 82, description: 'Violent rain showers', icon: 'shower' },
  85: { code: 85, description: 'Slight snow showers', icon: 'cloud-snow-light' },
  86: { code: 86, description: 'Heavy snow showers', icon: 'cloud-snow-heavy' },
  95: { code: 95, description: 'Thunderstorm', icon: 'thunderstorm' },
  96: { code: 96, description: 'Thunderstorm with slight hail', icon: 'thunderstorm-hail' },
  99: { code: 99, description: 'Thunderstorm with heavy hail', icon: 'thunderstorm-hail' },
};

export function getWeatherCode(code: number): WeatherCode {
  return weatherCodes[code] || { code, description: 'Unknown', icon: 'help-circle' };
}

export function formatTemperature(temp: number, unit: string = '°C'): string {
  return `${Math.round(temp)}${unit}`;
}

export function formatPressure(pressure: number): string {
  return `${Math.round(pressure)} hPa`;
}

export function formatWindSpeed(speed: number, unit: string = 'km/h'): string {
  return `${Math.round(speed)} ${unit}`;
}

export function formatHumidity(humidity: number): string {
  return `${Math.round(humidity)}%`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5));
  return directions[index % 16];
}

export function formatTime(timeString: string): string {
  return new Date(timeString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true
  });
}

export function formatDate(timeString: string): string {
  return new Date(timeString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export function calculateComfortIndex(temperature: number, humidity: number, windSpeed: number): {
  comfort_level: 'comfortable' | 'humid' | 'muggy' | 'dry' | 'cold' | 'hot';
  comfort_description: string;
} {
  const heatIndex = calculateHeatIndex(temperature, humidity);
  const windChill = calculateWindChill(temperature, windSpeed);
  
  if (temperature < 10) {
    return {
      comfort_level: 'cold',
      comfort_description: `Feels cold at ${Math.round(windChill)}°C due to wind chill`
    };
  } else if (temperature > 30) {
    if (humidity > 70) {
      return {
        comfort_level: 'muggy',
        comfort_description: `Muggy and uncomfortable, feels like ${Math.round(heatIndex)}°C`
      };
    } else if (humidity > 50) {
      return {
        comfort_level: 'humid',
        comfort_description: `Hot and humid, feels like ${Math.round(heatIndex)}°C`
      };
    } else {
      return {
        comfort_level: 'hot',
        comfort_description: `Hot but dry conditions`
      };
    }
  } else if (humidity < 30) {
    return {
      comfort_level: 'dry',
      comfort_description: `Dry conditions, low humidity at ${humidity}%`
    };
  } else {
    return {
      comfort_level: 'comfortable',
      comfort_description: `Pleasant and comfortable conditions`
    };
  }
}

export function calculateHeatIndex(temperature: number, humidity: number): number {
  const T = temperature;
  const RH = humidity;
  
  if (T < 27) return T;
  
  const c1 = -42.379;
  const c2 = 2.04901523;
  const c3 = 10.14333127;
  const c4 = -0.22475541;
  const c5 = -0.00683783;
  const c6 = -0.05481717;
  const c7 = 0.00122874;
  const c8 = 0.00085282;
  const c9 = -0.00000199;
  
  return c1 + (c2 * T) + (c3 * RH) + (c4 * T * RH) + (c5 * T * T) + 
         (c6 * RH * RH) + (c7 * T * T * RH) + (c8 * T * RH * RH) + (c9 * T * T * RH * RH);
}

export function calculateWindChill(temperature: number, windSpeed: number): number {
  if (temperature > 10 || windSpeed < 4.8) return temperature;
  
  const v = windSpeed;
  const T = temperature;
  
  return 13.12 + (0.6215 * T) - (11.37 * Math.pow(v, 0.16)) + (0.3965 * T * Math.pow(v, 0.16));
}

export function getUVIndexAdvice(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low - No protection needed';
  if (uvIndex <= 5) return 'Moderate - Some protection required';
  if (uvIndex <= 7) return 'High - Protection essential';
  if (uvIndex <= 10) return 'Very High - Extra protection needed';
  return 'Extreme - Avoid outdoor activities';
}

export function getVisibilityDescription(visibility: number): string {
  if (visibility >= 10) return 'Excellent visibility';
  if (visibility >= 5) return 'Good visibility';
  if (visibility >= 2) return 'Moderate visibility';
  if (visibility >= 1) return 'Poor visibility';
  return 'Very poor visibility';
}

export function getActivityRecommendations(temperature: number, humidity: number, uvIndex: number, aqi: number): string[] {
  const recommendations: string[] = [];
  
  if (temperature < 5) {
    recommendations.push('Dress in warm layers');
    recommendations.push('Limit outdoor exposure');
  } else if (temperature > 30) {
    recommendations.push('Stay hydrated');
    recommendations.push('Seek shade during peak hours');
  }
  
  if (humidity > 80) {
    recommendations.push('High humidity - expect to feel warmer');
    recommendations.push('Not ideal for strenuous outdoor activities');
  } else if (humidity < 30) {
    recommendations.push('Low humidity - use moisturizer');
    recommendations.push('Drink extra water');
  }
  
  if (uvIndex > 7) {
    recommendations.push('Use SPF 30+ sunscreen');
    recommendations.push('Wear protective clothing');
  }
  
  if (aqi > 100) {
    recommendations.push('Consider indoor activities');
    recommendations.push('Air quality is poor for sensitive individuals');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great conditions for outdoor activities!');
  }
  
  return recommendations;
}

export function getWindDirectionIcon(degrees: number): string {
  const directions = [
    { min: 0, max: 22.5, icon: '↑' },
    { min: 22.5, max: 67.5, icon: '↗' },
    { min: 67.5, max: 112.5, icon: '→' },
    { min: 112.5, max: 157.5, icon: '↘' },
    { min: 157.5, max: 202.5, icon: '↓' },
    { min: 202.5, max: 247.5, icon: '↙' },
    { min: 247.5, max: 292.5, icon: '←' },
    { min: 292.5, max: 337.5, icon: '↖' },
    { min: 337.5, max: 360, icon: '↑' }
  ];
  
  const direction = directions.find(d => degrees >= d.min && degrees < d.max);
  return direction?.icon || '↑';
}
