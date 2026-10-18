import React from 'react';
import { Menu, Wind, Wifi, WifiOff } from 'lucide-react';
import { AgriLensLogoIcon } from './Icons';

interface HeaderProps {
  onGoHome: () => void;
  onOpenDrawer: () => void;
  onOpenSmog?: () => void;
  onOpenStatus?: () => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onGoHome, 
  onOpenDrawer, 
  onOpenSmog,
  onOpenStatus,
  isOffline = false,
  onToggleOffline
}) => {
  return (
    <header className="glass sticky top-0 z-30 border-b border-white/20 dark:border-gray-700/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenDrawer}
              className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors text-emerald-600 dark:text-emerald-400"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center cursor-pointer group" onClick={onGoHome}>
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-2 group-hover:scale-110 transition-transform">
                <AgriLensLogoIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-black text-olive-900 dark:text-gray-100 tracking-tighter inline-flex items-center">
                  Agri<span className="text-emerald-600 dark:text-emerald-400">Lens</span>
                  <span className="ml-1 text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm relative -top-2 select-none">
                    ECO
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sleek Wi-Fi Connectivity Status Pill */}
            <button
              type="button"
              onClick={onToggleOffline}
              title={
                isOffline 
                  ? "Offline Mode active • Click to reconnect to Cloud AI" 
                  : "Connected to Cloud AI • Click to test Offline Mode"
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm active:scale-95 ${
                isOffline
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
                  <span>Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Online</span>
                </>
              )}
            </button>

            {onOpenSmog && (
              <button
                onClick={onOpenSmog}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200/60 dark:border-teal-800/60 hover:bg-teal-100 transition-all active:scale-95 shadow-sm"
                title="EPCCD Punjab AQI Monitor"
              >
                <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">EPCCD AQI</span>
              </button>
            )}

            {onOpenStatus && (
              <button
                onClick={onOpenStatus}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
                title="System Status & Telemetry"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Status</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
