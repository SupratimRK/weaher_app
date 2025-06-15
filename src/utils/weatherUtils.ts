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
