import React from 'react';
import { LayoutGrid, Store, CloudSun, Wind } from 'lucide-react';
import { AgriLensLogoIcon } from './Icons';

export type ActiveTab = 'analyze' | 'scan' | 'history' | 'settings' | 'mandi' | 'weather' | 'utilities' | 'schemes' | 'smog' | 'status';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-6 pt-2">
      <div className="max-w-md mx-auto glass rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl flex justify-around items-center p-1.5 sm:p-2">
        <button 
          onClick={() => setActiveTab('analyze')}
          className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'analyze' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="text-[9px] sm:text-[10px] font-bold mt-1 uppercase tracking-wider">Analyze</span>
        </button>

        <button 
          onClick={() => setActiveTab('mandi')}
          className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'mandi' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
        >
          <Store className="h-5 w-5" />
          <span className="text-[9px] sm:text-[10px] font-bold mt-1 uppercase tracking-wider">Market</span>
        </button>

        <button 
          onClick={() => setActiveTab('smog')}
          className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'smog' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 dark:shadow-none scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-teal-900/20'}`}
        >
          <Wind className="h-5 w-5" />
          <span className="text-[9px] sm:text-[10px] font-bold mt-1 uppercase tracking-wider">ECO</span>
        </button>

        <button 
          onClick={() => setActiveTab('weather')}
          className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 ${activeTab === 'weather' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
        >
          <CloudSun className="h-5 w-5" />
          <span className="text-[9px] sm:text-[10px] font-bold mt-1 uppercase tracking-wider">Weather</span>
        </button>

        <button 
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center p-3 sm:p-3.5 rounded-full transition-all duration-300 -mt-10 border-4 border-emerald-500 bg-white dark:bg-gray-800 shadow-xl ${activeTab === 'scan' ? 'scale-125 shadow-emerald-200 dark:shadow-none' : 'hover:scale-110'}`}
          title="Scan Crop / Plant"
        >
          <AgriLensLogoIcon className="h-8 w-8 sm:h-9 sm:w-9" />
        </button>
      </div>
    </nav>
  );
};
