import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import type { WeatherData, Location, AirQuality, MoonPhase } from './types/weather';
import { WeatherService } from './services/weatherService';
import { CurrentWeather } from './components/CurrentWeather';
import { TemperatureChart } from './components/TemperatureChart';
import { PrecipitationChart } from './components/PrecipitationChart';
import { WeeklyForecast } from './components/WeeklyForecast';
import { EnvironmentalData } from './components/EnvironmentalData';
import { WindTracking } from './components/WindTracking';
import { AstronomicalData } from './components/AstronomicalData';
import { HealthComfort } from './components/HealthComfort';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user location
      const userLocation = await WeatherService.getCurrentLocation();
      setLocation(userLocation);

      // Fetch weather data
      const weatherData = await WeatherService.getCurrentWeather(userLocation);
      setWeather(weatherData);

      // Fetch air quality data
      const airQualityData = await WeatherService.getAirQuality(userLocation);
      setAirQuality(airQualityData);

      // Get moon phase data
      const moonPhaseData = WeatherService.getMoonPhase();
      setMoonPhase(moonPhaseData);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleRefresh = () => {
    fetchWeatherData();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  if (!weather || !location || !airQuality || !moonPhase) {
    return <ErrorMessage message="No weather data available" onRetry={handleRefresh} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 animate-slide-in-up">
          <div>
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold text-shadow-lg gradient-text">
              Weather Dashboard
            </h1>
            {lastUpdated && (
              <p className="text-white/70 text-sm sm:text-base mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-glass group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-5 h-5 text-white transition-transform ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Current Weather */}
          <div className="animate-fade-in-scale">
            <CurrentWeather weather={weather} location={location} />
          </div>

          {/* Environmental & Air Quality Data */}
          <div className="animate-slide-in-up">
            <EnvironmentalData weather={weather} airQuality={airQuality} />
          </div>

          {/* Health & Comfort Index */}
          <div className="animate-slide-in-up">
            <HealthComfort weather={weather} airQuality={airQuality} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="animate-slide-in-left">
              <TemperatureChart weather={weather} />
            </div>
            <div className="animate-slide-in-right">
              <PrecipitationChart weather={weather} />
            </div>
          </div>

          {/* Wind and Astronomical Data */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="animate-slide-in-left">
              <WindTracking weather={weather} />
            </div>
            <div className="animate-slide-in-right">
              <AstronomicalData weather={weather} moonPhase={moonPhase} />
            </div>
          </div>

          {/* Weekly Forecast */}
          <div className="animate-slide-in-up">
            <WeeklyForecast weather={weather} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center animate-fade-in-scale">
          <div className="glass-card inline-block px-6 py-3">
            <p className="text-white/70 text-xs sm:text-sm">
              Weather data provided by{' '}
              <a 
                href="https://open-meteo.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/90 transition-colors underline underline-offset-2"
              >
                Open-Meteo API
              </a>
              {' • '}
              <a 
                href="https://air-quality-api.open-meteo.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/90 transition-colors underline underline-offset-2"
              >
                Air Quality API
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
