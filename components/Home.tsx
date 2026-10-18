import React from 'react';
import { CropSelector } from './CropSelector';
import { ImageUploader } from './ImageUploader';
import { AgriLensLogoIcon } from './Icons';

interface HomeProps {
  onImageAnalyze: (file: File) => void;
  onTextAnalyze: (cropName: string) => void;
  isLoading: boolean;
  isOfflineMode?: boolean;
}

export const Home: React.FC<HomeProps> = ({ 
  onImageAnalyze, 
  onTextAnalyze, 
  isLoading,
  isOfflineMode = false
}) => {
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Authentic AgriLens Eco Header */}
      <div className="text-center space-y-3">
        <div className="inline-block p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full ring-8 ring-emerald-50 dark:ring-emerald-900/20 shadow-md">
           <AgriLensLogoIcon className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-olive-900 dark:text-gray-100 tracking-tight inline-flex items-center justify-center">
          <span>Agri<span className="text-emerald-600 dark:text-emerald-400">Lens</span></span>
          <span className="ml-2 text-xs sm:text-sm bg-emerald-500 text-white font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm relative -top-3 sm:-top-4 select-none">
            ECO
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-base text-olive-700 dark:text-gray-400 font-medium">
          Hybrid Edge-to-Cloud AI Agritech & Anti-Smog Platform for Pakistani Farmers. On-device edge neural vision + Google Gemini Cloud Vision for full crop health, Mandi rates, and zero-burn residue guidance.
        </p>
      </div>

      {/* Main Analysis Input Box */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Column 1: Crop Selector */}
          <div>
            <h2 className="text-lg font-black text-center text-olive-800 dark:text-gray-200 mb-4 uppercase tracking-widest text-sm">
              Select Crop from Database
            </h2>
            <CropSelector onSelect={onTextAnalyze} disabled={isLoading} />
          </div>

          {/* Column 2: Image Uploader */}
          <div className="flex flex-col items-center">
            <div className="text-center w-full">
               <h2 className="text-lg font-black text-olive-800 dark:text-gray-200 mb-4 uppercase tracking-widest text-sm">
                 Or Scan / Upload Crop Photo
               </h2>
               <ImageUploader onImageUpload={onImageAnalyze} isLoading={isLoading} />
               <p className="text-[11px] text-gray-500 mt-2 font-medium">
                 {isOfflineMode 
                   ? '⚡ Zero Mobile Data: On-device Edge inference runs instantly offline on all agricultural crops' 
                   : '🔄 Smart Hybrid Pipeline: Runs on-device Edge Vision first, grounded with Gemini Cloud Vision'}
               </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
