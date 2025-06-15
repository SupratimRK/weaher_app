export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    uv_index: number;
    visibility: number;
  };
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    is_day: string;
    precipitation: string;
    rain: string;
    showers: string;
    snowfall: string;
    weather_code: string;
    cloud_cover: string;
    pressure_msl: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    wind_gusts_10m: string;
    uv_index: string;
    visibility: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    surface_pressure: number[];
    cloud_cover: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    uv_index: number[];
    visibility: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface WeatherCode {
  code: number;
  description: string;
  icon: string;
}

export interface AirQuality {
  aqi: number;
  pm2_5: number;
  pm10: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  health_advisory: string;
  trend: 'improving' | 'worsening' | 'stable';
}

export interface MoonPhase {
  phase: number; // 0-1, where 0 = new moon, 0.5 = full moon
  illumination: number; // percentage
  phase_name: string;
  moonrise: string;
  moonset: string;
}

export interface ComfortIndex {
  feels_like: number;
  heat_index: number;
  wind_chill: number;
  comfort_level: 'comfortable' | 'humid' | 'muggy' | 'dry' | 'cold' | 'hot';
  comfort_description: string;
  activity_recommendations: string[];
}

export interface HealthAdvisory {
  uv_advisory: string;
  air_quality_advisory: string;
  comfort_advisory: string;
  outdoor_activity_rating: 'excellent' | 'good' | 'fair' | 'poor' | 'hazardous';
  general_tips: string[];
}
