import React, { useState } from 'react';
import { Moon, Sun, Languages, Trash2, Folder, Plus, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Collection } from '../types';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  collections: Collection[];
  onAddCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  toggleDarkMode,
  language,
  setLanguage,
  collections,
  onAddCollection,
  onDeleteCollection,
  selectedCity,
  setSelectedCity
}) => {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const cities = [
    'Bahawalpur', 'Faisalabad', 'Gujranwala', 'Islamabad', 'Karachi', 
    'Lahore', 'Larkana', 'Multan', 'Peshawar', 'Quetta', 
    'Rahim Yar Khan', 'Sahiwal', 'Sargodha', 'Sheikhupura', 'Sialkot', 'Sukkur'
  ].sort();

  const handleAdd = () => {
    if (newCollectionName.trim()) {
      onAddCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsAdding(false);
    }
  };

  const t = {
    settings: language === 'en' ? 'Settings' : 'ترتیبات',
    theme: language === 'en' ? 'Theme' : 'تھیم',
    light: language === 'en' ? 'Light' : 'روشن',
    dark: language === 'en' ? 'Dark' : 'تاریک',
    language: language === 'en' ? 'Language' : 'زبان',
    city: language === 'en' ? 'Selected City' : 'منتخب شہر',
    collections: language === 'en' ? 'Collections' : 'مجموعے',
    addCollection: language === 'en' ? 'Add Collection' : 'مجموعہ شامل کریں',
    noCollections: language === 'en' ? 'No collections yet' : 'ابھی تک کوئی مجموعہ نہیں ہے',
    placeholder: language === 'en' ? 'Collection Name' : 'مجموعہ کا نام',
    cancel: language === 'en' ? 'Cancel' : 'منسوخ کریں',
    add: language === 'en' ? 'Add' : 'شامل کریں'
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-olive-900 dark:text-gray-100 tracking-tight">
          {t.settings}
        </h2>
      </header>

      {/* Theme & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
              {isDarkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-sm font-bold text-olive-600 dark:text-gray-400 uppercase tracking-widest">{t.theme}</p>
              <p className="text-lg font-extrabold text-olive-900 dark:text-gray-100">{isDarkMode ? t.dark : t.light}</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="w-14 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full relative p-1 transition-colors"
          >
            <motion.div
              animate={{ x: isDarkMode ? 24 : 0 }}
              className="w-6 h-6 bg-emerald-600 rounded-full shadow-lg"
            />
          </button>
        </div>

        <div className="glass rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Languages className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-olive-600 dark:text-gray-400 uppercase tracking-widest">{t.language}</p>
              <p className="text-lg font-extrabold text-olive-900 dark:text-gray-100">{language === 'en' ? 'English' : 'اردو'}</p>
            </div>
          </div>
          <div className="flex bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${language === 'en' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-600 dark:text-emerald-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${language === 'ur' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-600 dark:text-emerald-400'}`}
            >
              UR
            </button>
          </div>
        </div>
      </div>

      {/* City Selection */}
      <div className="glass rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-olive-600 dark:text-gray-400 uppercase tracking-widest">{t.city}</p>
            <p className="text-lg font-extrabold text-olive-900 dark:text-gray-100">{selectedCity}</p>
          </div>
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold py-2 px-4 rounded-2xl focus:outline-none border-none cursor-pointer"
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Collections */}
      <div className="glass rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Folder className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-olive-900 dark:text-gray-100">{t.collections}</h3>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 bg-emerald-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder={t.placeholder}
                className="flex-grow bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800/50 rounded-2xl px-4 py-2 text-olive-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-olive-600 dark:text-gray-400 font-bold"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg"
              >
                {t.add}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {collections.length === 0 ? (
            <p className="text-center py-8 text-olive-500 dark:text-gray-500 font-medium italic">{t.noCollections}</p>
          ) : (
            collections.map((col) => (
              <motion.div
                key={col.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl group"
              >
                <div className="flex items-center space-x-3">
                  <Folder className="h-5 w-5 text-emerald-500" />
                  <span className="font-bold text-olive-900 dark:text-gray-100">{col.name}</span>
                </div>
                <button
                  onClick={() => onDeleteCollection(col.id)}
                  className="p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
