import React from 'react';
import { 
  Sunrise, 
  Sunset, 
  Moon, 
  Star,
  Clock,
  Calendar
} from 'lucide-react';
import type { WeatherData, MoonPhase } from '../types/weather';

interface AstronomicalDataProps {
  weather: WeatherData;
  moonPhase: MoonPhase;
}

export const AstronomicalData: React.FC<AstronomicalDataProps> = ({ 
  weather, 
  moonPhase 
}) => {
  const todaySunrise = weather.daily.sunrise[0];
  const todaySunset = weather.daily.sunset[0];

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDayLength = () => {
    const sunrise = new Date(todaySunrise);
    const sunset = new Date(todaySunset);
    const diffMs = sunset.getTime() - sunrise.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getTimeUntilSunrise = () => {
    const now = new Date();
    const sunrise = new Date(todaySunrise);
    const diffMs = sunrise.getTime() - now.getTime();
    
    if (diffMs <= 0) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getTimeUntilSunset = () => {
    const now = new Date();
    const sunset = new Date(todaySunset);
    const diffMs = sunset.getTime() - now.getTime();
    
    if (diffMs <= 0) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getMoonIcon = () => {
    const phase = moonPhase.phase;
    if (phase < 0.1 || phase > 0.9) return '🌑'; // New Moon
    if (phase < 0.25) return '🌒'; // Waxing Crescent
    if (phase < 0.35) return '🌓'; // First Quarter
    if (phase < 0.65) return '🌔'; // Waxing Gibbous
    if (phase < 0.75) return '🌕'; // Full Moon
    if (phase < 0.85) return '🌖'; // Waning Gibbous
    return '🌗'; // Last Quarter
  };

  const timeUntilSunrise = getTimeUntilSunrise();
  const timeUntilSunset = getTimeUntilSunset();

  return (
    <div className="weather-card animate-slide-in-up">
      <div className="mb-6">
        <h3 className="text-white font-bold text-xl sm:text-2xl text-shadow mb-2">
          🌅 Astronomical Data
        </h3>
        <p className="text-white/70 text-sm sm:text-base">
          Sun and moon cycles for today
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sun Data */}
        <div className="stat-card">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold">Sun Information</span>
          </div>

          <div className="space-y-4">
            {/* Sunrise */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <Sunrise className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-white font-semibold">Sunrise</div>
                  <div className="text-white/60 text-sm">
                    {timeUntilSunrise ? `in ${timeUntilSunrise}` : 'Already up'}
                  </div>
                </div>
              </div>
              <div className="text-white font-bold text-lg">
                {formatTime(todaySunrise)}
              </div>
            </div>

            {/* Sunset */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <Sunset className="w-5 h-5 text-red-400" />
                <div>
                  <div className="text-white font-semibold">Sunset</div>
                  <div className="text-white/60 text-sm">
                    {timeUntilSunset ? `in ${timeUntilSunset}` : 'Already set'}
                  </div>
                </div>
              </div>
              <div className="text-white font-bold text-lg">
                {formatTime(todaySunset)}
              </div>
            </div>

            {/* Day Length */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-white font-semibold">Day Length</div>
                  <div className="text-white/60 text-sm">Total daylight</div>
                </div>
              </div>
              <div className="text-white font-bold text-lg">
                {calculateDayLength()}
              </div>
            </div>
          </div>
        </div>

        {/* Moon Data */}
        <div className="stat-card">
          <div className="flex items-center space-x-2 mb-4">
            <Moon className="w-6 h-6 text-blue-300" />
            <span className="text-white font-semibold">Moon Information</span>
          </div>

          <div className="text-center mb-4">
            <div className="text-6xl mb-2">
              {getMoonIcon()}
            </div>
            <div className="text-white font-bold text-lg mb-1">
              {moonPhase.phase_name}
            </div>
            <div className="text-white/60 text-sm">
              {moonPhase.illumination}% illuminated
            </div>
          </div>

          <div className="space-y-3">
            {/* Moonrise */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <Moon className="w-4 h-4 text-blue-300" />
                <span className="text-white text-sm">Moonrise</span>
              </div>
              <span className="text-white font-semibold">
                {moonPhase.moonrise}
              </span>
            </div>

            {/* Moonset */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <Moon className="w-4 h-4 text-blue-300 transform rotate-180" />
                <span className="text-white text-sm">Moonset</span>
              </div>
              <span className="text-white font-semibold">
                {moonPhase.moonset}
              </span>
            </div>

            {/* Moon Phase Progress */}
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>New</span>
                <span>Full</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-400 transition-all duration-1000"
                  style={{ width: `${moonPhase.illumination}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Sun Times */}
      <div className="mt-6">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          This Week's Sun Times
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
          {weather.daily.time.map((date, index) => {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            const isToday = index === 0;
            
            return (
              <div 
                key={date} 
                className={`p-3 rounded-lg text-center ${
                  isToday ? 'bg-white/10 border border-white/20' : 'bg-white/5'
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-white' : 'text-white/80'
                }`}>
                  {isToday ? 'Today' : dayName}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Sunrise className="w-3 h-3 text-orange-400" />
                    <span className="text-white/80 text-xs">
                      {formatTime(weather.daily.sunrise[index])}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Sunset className="w-3 h-3 text-red-400" />
                    <span className="text-white/80 text-xs">
                      {formatTime(weather.daily.sunset[index])}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
