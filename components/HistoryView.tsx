import React, { useState, useCallback } from 'react';
import type { HistoryItem, SupplierInfo, Collection } from '../types';
import { AnalysisResult } from './AnalysisResult';
import { ErrorDisplay } from './ErrorDisplay';
import { findSuppliers } from '../services/geminiService';
import { History, Trash2, Calendar, Folder, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryViewProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  collections: Collection[];
  onUpdateItem: (item: HistoryItem) => void;
}

const HistoryListItem: React.FC<{ 
  item: HistoryItem; 
  onView: () => void; 
  onDelete: (e: React.MouseEvent) => void; 
  collections: Collection[];
  onAssign: (collectionId: string) => void;
}> = ({ item, onView, onDelete, collections, onAssign }) => {
  const [showMenu, setShowMenu] = useState(false);
  const collectionName = collections.find(c => c.id === item.collectionId)?.name;

  return (
    <div 
      className={`glass p-4 rounded-3xl border border-white/20 dark:border-gray-700/30 hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 cursor-pointer flex items-center space-x-4 group relative ${showMenu ? 'z-50 ring-2 ring-emerald-500/50' : 'z-10'}`}
      onClick={onView}
    >
        <img 
            src={item.imageUrl} 
            alt={item.analysis.cropName} 
            className="h-16 w-16 object-cover rounded-2xl border-2 border-white dark:border-gray-900 shadow-sm transition-transform group-hover:scale-105" 
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/4a5568?text=No+Img'; }}
            referrerPolicy="no-referrer"
        />
        <div className="flex-grow">
            <h3 className="font-black text-lg text-olive-900 dark:text-gray-100">{item.analysis.cropName}</h3>
            <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center text-xs text-olive-600 dark:text-gray-400 font-medium">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                {collectionName && (
                  <div className="flex items-center text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    <Folder className="h-3 w-3 mr-1" />
                    <span>{collectionName}</span>
                  </div>
                )}
                {(item.analysis.isUnlistedOffline || item.analysis.pendingRefetch) && (
                  <div className="flex items-center text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-black border border-amber-300 dark:border-amber-800">
                    <span>⏳ Pending Re-fetch</span>
                  </div>
                )}
            </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-xl text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
          >
              <MoreVertical className="h-5 w-5" />
          </button>
          <button
              onClick={onDelete}
              className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all"
          >
              <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute right-12 top-12 z-50 w-48 glass rounded-2xl shadow-2xl p-2 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[10px] font-black text-olive-500 uppercase tracking-widest px-3 py-2">Add to Collection</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                <button
                  onClick={() => { onAssign(''); setShowMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${!item.collectionId ? 'bg-emerald-500 text-white' : 'text-olive-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                >
                  None
                </button>
                {collections.map(col => (
                  <button
                    key={col.id}
                    onClick={() => { onAssign(col.id); setShowMenu(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${item.collectionId === col.id ? 'bg-emerald-500 text-white' : 'text-olive-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};


export const HistoryView: React.FC<HistoryViewProps> = ({ history, onDelete, collections, onUpdateItem }) => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierInfo[] | null>(null);
  const [isFindingSuppliers, setIsFindingSuppliers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCollectionId, setFilterCollectionId] = useState<string>('all');

  const handleAnalysisError = (err: unknown) => {
    console.error("Supplier Search Error:", err);
    if (err instanceof Error) {
        setError(err.message);
    } else {
        setError("An unexpected error occurred while finding suppliers.");
    }
  };

  const handleFindSuppliers = useCallback(async (cropName: string) => {
    setIsFindingSuppliers(true);
    setError(null);
    try {
      const data = await findSuppliers(cropName);
      setSuppliers(data);
    } catch (err: unknown) {
        handleAnalysisError(err);
    } finally {
        setIsFindingSuppliers(false);
    }
  }, []);

  const handleGoBack = () => {
    setSelectedItem(null);
    setSuppliers(null);
    setError(null);
  };
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
  };

  const filteredHistory = filterCollectionId === 'all' 
    ? history 
    : history.filter(item => item.collectionId === filterCollectionId);


  if (error) {
    return <ErrorDisplay message={error} onClear={handleGoBack} />;
  }

  if (selectedItem) {
    return (
      <AnalysisResult
        analysis={selectedItem.analysis}
        imageUrl={selectedItem.imageUrl}
        onGoBack={handleGoBack}
        backButtonLabel="Back to History"
        onFindSuppliers={handleFindSuppliers}
        suppliers={suppliers}
        isFindingSuppliers={isFindingSuppliers}
      />
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <header className="mb-8">
            <h1 className="text-3xl font-black text-olive-900 dark:text-gray-100 tracking-tight">Analysis History</h1>
            <p className="mt-2 text-olive-600 dark:text-gray-400 font-medium">Review your past crop analyses.</p>
       </header>

       {/* Collection Filter */}
       {collections.length > 0 && (
         <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
           <button
             onClick={() => setFilterCollectionId('all')}
             className={`px-6 py-2 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${filterCollectionId === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}
           >
             All Reports
           </button>
           {collections.map(col => (
             <button
               key={col.id}
               onClick={() => setFilterCollectionId(col.id)}
               className={`px-6 py-2 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${filterCollectionId === col.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}
             >
               {col.name}
             </button>
           ))}
         </div>
       )}

      {filteredHistory.length === 0 ? (
        <div className="text-center p-12 glass rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl">
            <div className="inline-block p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mb-4">
                <History className="h-12 w-12 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-olive-900 dark:text-gray-100">No Reports Found</h3>
            <p className="mt-2 text-olive-600 dark:text-gray-400 font-medium max-w-xs mx-auto">
              {filterCollectionId === 'all' 
                ? "Perform an analysis to see your reports here." 
                : "No reports in this collection yet."}
            </p>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
            {filteredHistory.map(item => (
                <HistoryListItem 
                    key={item.id} 
                    item={item} 
                    onView={() => setSelectedItem(item)}
                    onDelete={(e) => handleDelete(e, item.id)}
                    collections={collections}
                    onAssign={(collectionId) => onUpdateItem({ ...item, collectionId })}
                />
            ))}
        </div>
      )}
    </div>
  );
};
