import React from 'react';
import { AlertTriangle, RefreshCw, MapPin, Wifi } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-400/20 rounded-full blur-xl floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 glass-card p-8 sm:p-12 text-center max-w-md animate-fade-in-scale">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mx-auto pulse-glow" />
        </div>
        
        <h2 className="text-white font-bold text-xl sm:text-2xl mb-3 text-shadow">
          Oops! Something went wrong
        </h2>
        <p className="text-white/80 mb-6 sm:mb-8 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-glass group mb-6 sm:mb-8 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
        )}

        <div className="space-y-4">
          <p className="text-white/60 text-sm font-medium">
            Make sure you have:
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3 stat-card">
              <MapPin className="w-4 h-4 text-blue-300" />
              <span className="text-white/80 text-sm">Location services enabled</span>
            </div>
            <div className="flex items-center justify-center space-x-3 stat-card">
              <Wifi className="w-4 h-4 text-green-300" />
              <span className="text-white/80 text-sm">Internet connection</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center animate-slide-in-up" style={{animationDelay: '0.3s'}}>
        <p className="text-white/40 text-xs">
          Weather data provided by Open-Meteo API
        </p>
      </div>
    </div>
  );
};
