import React from 'react';
import { CloudSun, Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 glass-card p-8 sm:p-12 text-center max-w-md animate-fade-in-scale">
        <div className="relative mb-6">
          <CloudSun className="w-16 h-16 sm:w-20 sm:h-20 text-white/80 mx-auto pulse-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
          </div>
        </div>
        
        <h2 className="text-white font-bold text-xl sm:text-2xl mb-2 text-shadow">
          Loading Weather
        </h2>
        <p className="text-white/70 font-medium mb-4">Getting your location and forecast</p>
        
        <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 animate-pulse shimmer">
      <div className="space-y-4">
        <div className="h-4 bg-white/20 rounded-xl w-3/4"></div>
        <div className="h-8 bg-white/20 rounded-xl w-1/2"></div>
        <div className="space-y-3">
          <div className="h-3 bg-white/20 rounded-lg w-full"></div>
          <div className="h-3 bg-white/20 rounded-lg w-2/3"></div>
          <div className="h-3 bg-white/20 rounded-lg w-4/5"></div>
        </div>
      </div>
    </div>
  );
};
