import React, { useState, useMemo } from 'react';
import { crops } from '../data/crops';
import { Loader2, Search } from 'lucide-react';

interface CropSelectorProps {
  onSelect: (cropName: string) => void;
  disabled: boolean;
}

const CropImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const [error, setError] = useState(false);

    const fallbackColor = useMemo(() => {
        const colors = ['bg-emerald-100', 'bg-amber-100', 'bg-blue-100', 'bg-purple-100', 'bg-rose-100'];
        const charCode = alt.charCodeAt(0) || 0;
        return colors[charCode % colors.length];
    }, [alt]);

    if (error || !src) {
        return (
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-lg ${fallbackColor} dark:bg-opacity-50`}>
                {alt.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            onError={() => setError(true)}
            referrerPolicy="no-referrer"
        />
    );
};

export const CropSelector: React.FC<CropSelectorProps> = ({ onSelect, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const filteredCrops = useMemo(() => {
    return crops.filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  
  const handleSelect = (cropName: string) => {
    setSelectedCrop(cropName);
    onSelect(cropName);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a crop..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white"
          disabled={disabled}
        />
      </div>
      <div className="max-h-64 overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-2 custom-scrollbar">
        <div className="space-y-1">
            {filteredCrops.map(crop => (
            <button
                key={crop.name}
                onClick={() => handleSelect(crop.name)}
                disabled={disabled}
                className="w-full flex items-center p-2 rounded-xl text-left transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-wait group"
            >
                <div className="mr-4 flex-shrink-0 transition-transform group-hover:scale-110">
                    <CropImage src={crop.image} alt={crop.name} />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 flex-grow">{crop.name}</span>
                {disabled && selectedCrop === crop.name && (
                    <Loader2 className="animate-spin h-5 w-5 text-emerald-600 dark:text-emerald-400 ml-auto flex-shrink-0" />
                )}
            </button>
            ))}
            {filteredCrops.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 p-4 italic">No crops found.</p>
            )}
        </div>
      </div>
    </div>
  );
};
