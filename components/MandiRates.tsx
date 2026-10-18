import React, { useState, useEffect } from 'react';
import { Store, Search, TrendingUp, TrendingDown, MapPin, Loader2, RefreshCw, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchGeneralAgriData } from '../services/geminiService';

interface MandiRatesProps {
  selectedCity: string;
  language: 'en' | 'ur';
}

interface CropRate {
  crop: string;
  price: string;
  unit: string;
  change?: 'up' | 'down' | 'stable';
  date: string;
}

export const MandiRates: React.FC<MandiRatesProps> = ({ selectedCity, language }) => {
  const [rates, setRates] = useState<CropRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRealtime, setIsRealtime] = useState<boolean>(false);

  const CACHE_KEY = `agriLens_mandi_${selectedCity}`;
  const COOLDOWN_DURATION = 30 * 1000; // 30 seconds cooldown

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchRates = async (force = false) => {
    // Check cooldown
    const now = Date.now();
    if (force && now - lastFetchTime < COOLDOWN_DURATION) {
      const remaining = Math.ceil((COOLDOWN_DURATION - (now - lastFetchTime)) / 1000);
      setErrorMsg(language === 'en' 
        ? `Please wait ${remaining} seconds before refreshing again.` 
        : `دوبارہ تازہ کرنے سے پہلے براہ کرم ${remaining} سیکنڈ انتظار کریں۔`);
      return;
    }

    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp, isRealtime: cachedRealtime } = JSON.parse(cached);
          // 12 hour cache for market rates
          if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
            setRates(data);
            setIsRealtime(!!cachedRealtime);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Cache parse error", e);
        }
      }
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const prompt = `Search for the latest Mandi rates (market prices) in ${selectedCity}, Pakistan on official portals like AMIS (Agriculture Marketing Information Service) or local news. 
      Return the data as a JSON array of objects with the following structure:
      { "crop": "string", "price": "string", "unit": "string", "change": "up" | "down" | "stable", "date": "YYYY-MM-DD" }
      Include major crops like Wheat, Rice (Basmati), Cotton, Sugarcane, Maize, Potato, Onion, Tomato.
      Ensure the prices are the most recent available for ${selectedCity}. Current Date: ${new Date().toLocaleDateString()}.`;

      const { data, isRealtime: realtimeResult } = await fetchGeneralAgriData<CropRate[]>(prompt, language);
      setRates(data);
      setIsRealtime(realtimeResult);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now(), isRealtime: realtimeResult }));
      setLastFetchTime(Date.now());
    } catch (error: any) {
      console.error("Error fetching mandi rates:", error);
      
      if (error?.message?.includes('Quota exceeded') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        setErrorMsg(language === 'en' 
          ? "AI is currently busy. Please wait a minute before refreshing again." 
          : "AI فی الحال مصروف ہے۔ براہ کرم دوبارہ تازہ کرنے سے پہلے ایک منٹ انتظار کریں۔");
      } else {
        // Fallback data if API fails or returns invalid JSON
        const fallbackData: CropRate[] = [
          { crop: 'Wheat', price: '4500', unit: '40kg', change: 'up', date: new Date().toISOString().split('T')[0] },
          { crop: 'Rice (Basmati)', price: '9000', unit: '40kg', change: 'stable', date: new Date().toISOString().split('T')[0] },
          { crop: 'Cotton', price: '8500', unit: '40kg', change: 'down', date: new Date().toISOString().split('T')[0] },
        ];
        setRates(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check cache on mount or city change, but don't auto-fetch from API
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, isRealtime: cachedRealtime } = JSON.parse(cached);
        setRates(data);
        setIsRealtime(!!cachedRealtime);
      } catch (e) {
        setRates([]);
        setIsRealtime(false);
      }
    } else {
      setRates([]);
      setIsRealtime(false);
    }
  }, [selectedCity]);

  const filteredRates = rates.filter(rate => 
    rate.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const t = {
    title: language === 'en' ? 'Mandi Rates' : 'منڈی کے نرخ',
    search: language === 'en' ? 'Search crops...' : 'فصلیں تلاش کریں...',
    latestUpdate: language === 'en' ? 'Latest Update' : 'تازہ ترین اپ ڈیٹ',
    price: language === 'en' ? 'Price' : 'قیمت',
    unit: language === 'en' ? 'Unit' : 'یونٹ',
    noData: language === 'en' ? 'No rates found' : 'کوئی نرخ نہیں ملے',
    refresh: language === 'en' ? 'Refresh' : 'تازہ دم کریں',
    loadData: language === 'en' ? 'Load Market Rates' : 'مارکیٹ ریٹ لوڈ کریں',
    realtime: language === 'en' ? 'Live Data' : 'براہ راست ڈیٹا',
    historical: language === 'en' ? 'Historical Data' : 'تاریخی ڈیٹا'
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-olive-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
            <Store className="text-emerald-600" />
            {t.title}
          </h2>
          {rates.length > 0 && (
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${isRealtime ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isRealtime ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isRealtime ? t.realtime : t.historical}
              </span>
              <p className="text-olive-600 dark:text-gray-400 font-bold flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {selectedCity}
              </p>
            </div>
          )}
        </div>
        {rates.length > 0 && (
          <button 
            onClick={() => fetchRates(true)}
            disabled={loading}
            className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:bg-emerald-200 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
          </button>
        )}
      </header>

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold"
        >
          <Info className="h-5 w-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </motion.div>
      )}

      {rates.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 glass rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50">
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
            <Store className="h-16 w-16 text-emerald-500 opacity-50" />
          </div>
          <div className="text-center px-6">
            <h3 className="text-xl font-black text-olive-900 dark:text-gray-100 mb-2">{t.loadData}</h3>
            <p className="text-olive-600 dark:text-gray-400 font-medium">Click below to fetch the latest Mandi rates for crops in {selectedCity}.</p>
          </div>
          <button 
            onClick={() => fetchRates(true)}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            {t.loadData}
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-olive-400 h-5 w-5" />
        <input
          type="text"
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-2xl py-4 pl-12 pr-4 text-olive-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
          <p className="text-olive-600 dark:text-gray-400 font-bold animate-pulse">Fetching latest market data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRates.length > 0 ? (
            filteredRates.map((rate, index) => (
              <motion.div
                key={rate.crop}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-3xl p-5 flex items-center justify-between hover:shadow-md transition-shadow border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-olive-900 dark:text-gray-100">{rate.crop}</h3>
                    <p className="text-sm text-olive-500 dark:text-gray-500 font-bold uppercase tracking-wider">
                      {t.latestUpdate}: {rate.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Rs. {rate.price}</span>
                    {rate.change === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
                    {rate.change === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
                  </div>
                  <p className="text-sm font-bold text-olive-600 dark:text-gray-400">per {rate.unit}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-olive-500 dark:text-gray-500 font-bold italic">{t.noData}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
