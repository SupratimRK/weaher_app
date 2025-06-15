import type { WeatherData, Location } from '../types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1';

export class WeatherService {
  static async getCurrentWeather(location: Location): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'cloud_cover',
        'wind_speed_10m'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'precipitation_sum',
        'rain_sum',
        'showers_sum',
        'snowfall_sum',
        'precipitation_hours',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant'
      ].join(','),
      timezone: 'auto',
      forecast_days: '7'
    });

    const response = await fetch(`${BASE_URL}/forecast?${params}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    return response.json();
  }

  static async getLocationFromCoords(latitude: number, longitude: number): Promise<Location> {
    try {
      // Using a simple geocoding API for location names
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get location name');
      }

      const data = await response.json();
      
      return {
        latitude,
        longitude,
        city: data.city || data.locality || 'Unknown City',
        country: data.countryName || 'Unknown Country'
      };
    } catch (error) {
      console.error('Error getting location name:', error);
      return {
        latitude,
        longitude,
        city: 'Unknown City',
        country: 'Unknown Country'
      };
    }
  }

  static getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = await this.getLocationFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(location);
        },
        (error) => {
          // Fallback to a default location (New York City)
          console.error('Geolocation error:', error);
          resolve({
            latitude: 40.7128,
            longitude: -74.0060,
            city: 'New York',
            country: 'United States'
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}
