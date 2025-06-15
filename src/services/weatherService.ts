import type { WeatherData, Location, AirQuality, MoonPhase } from '../types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1';

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
        'wind_gusts_10m',
        'uv_index',
        'visibility'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'cloud_cover',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
        'visibility'
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
        'wind_direction_10m_dominant',
        'sunrise',
        'sunset',
        'uv_index_max'
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

  static async getAirQuality(location: Location): Promise<AirQuality> {
    try {
      const params = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        current: [
          'us_aqi',
          'pm2_5',
          'pm10',
          'carbon_monoxide',
          'nitrogen_dioxide',
          'sulphur_dioxide',
          'ozone'
        ].join(','),
        hourly: 'us_aqi',
        forecast_days: '1'
      });

      const response = await fetch(`${AIR_QUALITY_URL}/air-quality?${params}`);
      
      if (!response.ok) {
        throw new Error(`Air Quality API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Calculate trend from hourly data
      const hourlyAqi = data.hourly?.us_aqi || [];
      const currentAqi = data.current?.us_aqi || 0;
      const previousAqi = hourlyAqi[Math.max(0, hourlyAqi.length - 3)] || currentAqi;
      
      let trend: 'improving' | 'worsening' | 'stable' = 'stable';
      if (currentAqi < previousAqi - 5) trend = 'improving';
      else if (currentAqi > previousAqi + 5) trend = 'worsening';

      return {
        aqi: currentAqi,
        pm2_5: data.current?.pm2_5 || 0,
        pm10: data.current?.pm10 || 0,
        carbon_monoxide: data.current?.carbon_monoxide || 0,
        nitrogen_dioxide: data.current?.nitrogen_dioxide || 0,
        sulphur_dioxide: data.current?.sulphur_dioxide || 0,
        ozone: data.current?.ozone || 0,
        health_advisory: this.getAirQualityAdvisory(currentAqi),
        trend
      };
    } catch (error) {
      console.error('Error fetching air quality:', error);
      return {
        aqi: 0,
        pm2_5: 0,
        pm10: 0,
        carbon_monoxide: 0,
        nitrogen_dioxide: 0,
        sulphur_dioxide: 0,
        ozone: 0,
        health_advisory: 'Data unavailable',
        trend: 'stable'
      };
    }
  }
  static getMoonPhase(date: Date = new Date()): MoonPhase {
    // Calculate moon phase using astronomical formula
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let c = 0;
    let e = 0;
    let jd = 0;
    let b = 0;
    let yearAdjusted = year;
    let monthAdjusted = month;

    if (month < 3) {
      yearAdjusted = year - 1;
      monthAdjusted = month + 12;
    }

    const a = Math.floor(yearAdjusted / 100);
    b = Math.floor(a / 4);
    c = 2 - a + b;
    e = Math.floor(365.25 * (yearAdjusted + 4716));
    const f = Math.floor(30.6001 * (monthAdjusted + 1));
    jd = c + day + e + f - 1524.5;

    // Days since known new moon
    const daysSinceNew = jd - 2451549.5;
    const newMoons = daysSinceNew / 29.53;
    const phase = (newMoons - Math.floor(newMoons));
    
    const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50);
    
    let phaseName = '';
    if (phase < 0.0625) phaseName = 'New Moon';
    else if (phase < 0.1875) phaseName = 'Waxing Crescent';
    else if (phase < 0.3125) phaseName = 'First Quarter';
    else if (phase < 0.4375) phaseName = 'Waxing Gibbous';
    else if (phase < 0.5625) phaseName = 'Full Moon';
    else if (phase < 0.6875) phaseName = 'Waning Gibbous';
    else if (phase < 0.8125) phaseName = 'Last Quarter';
    else phaseName = 'Waning Crescent';

    // Simplified moonrise/moonset calculation
    const moonrise = new Date(date);
    moonrise.setHours(Math.floor(phase * 24), Math.floor((phase * 24 % 1) * 60));
    
    const moonset = new Date(moonrise);
    moonset.setHours(moonset.getHours() + 12);

    return {
      phase,
      illumination,
      phase_name: phaseName,
      moonrise: moonrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      moonset: moonset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  }

  static getAirQualityAdvisory(aqi: number): string {
    if (aqi <= 50) return 'Good - Air quality is satisfactory';
    if (aqi <= 100) return 'Moderate - Acceptable for most people';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy - Everyone may experience problems';
    if (aqi <= 300) return 'Very Unhealthy - Health alert';
    return 'Hazardous - Emergency conditions';
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
