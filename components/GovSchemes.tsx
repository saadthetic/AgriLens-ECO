import React, { useState, useEffect } from 'react';
import { Briefcase, ExternalLink, Calendar, Loader2, Search, Info, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchGeneralAgriData } from '../services/geminiService';

interface GovSchemesProps {
  language: 'en' | 'ur';
}

interface Scheme {
  title: string;
  description: string;
  lastDate: string;
  link: string;
  status: 'active' | 'upcoming' | 'closed';
}

export const GovSchemes: React.FC<GovSchemesProps> = ({ language }) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRealtime, setIsRealtime] = useState<boolean>(false);

  const CACHE_KEY = 'agriLens_gov_schemes';
  const COOLDOWN_DURATION = 30 * 1000; // 30 seconds cooldown

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchSchemes = async (force = false) => {
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
          // 24 hour cache for gov schemes
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            setSchemes(data);
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
      const prompt = `Get the latest Pakistani government agricultural schemes, subsidies, and programs for farmers (e.g., Kissan Card, Fertilizer Subsidy, Solar Tube Well Scheme, etc.). 
      Include the title, a brief description, the last date to apply (if applicable), and the official link.
      Return the data as a JSON array of objects with the following structure:
      { "title": "string", "description": "string", "lastDate": "string", "link": "string", "status": "active" | "upcoming" | "closed" }
      Ensure the data is the most recent available for 2024-2025.`;

      const { data, isRealtime: realtimeResult } = await fetchGeneralAgriData<Scheme[]>(prompt, language);
      setSchemes(data);
      setIsRealtime(realtimeResult);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now(), isRealtime: realtimeResult }));
      setLastFetchTime(Date.now());
    } catch (error: any) {
      console.error("Error fetching gov schemes:", error);
      
      if (error?.message?.includes('Quota exceeded') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        setErrorMsg(language === 'en' 
          ? "AI is currently busy. Please wait a minute before refreshing again." 
          : "AI فی الحال مصروف ہے۔ براہ کرم دوبارہ تازہ کرنے سے پہلے ایک منٹ انتظار کریں۔");
      } else {
        // Fallback data
        const fallbackData: Scheme[] = [
          { title: 'Kissan Card Program', description: 'Direct subsidy for fertilizers and seeds through Kissan Card.', lastDate: 'Open', link: 'https://agripunjab.gov.pk/', status: 'active' },
          { title: 'Solar Tube Well Scheme', description: 'Subsidy for installing solar-powered tube wells for irrigation.', lastDate: '2024-12-31', link: 'https://agripunjab.gov.pk/', status: 'active' },
          { title: 'Wheat Seed Subsidy', description: 'Provision of certified wheat seeds at subsidized rates.', lastDate: 'Closed', link: 'https://agripunjab.gov.pk/', status: 'closed' },
        ];
        setSchemes(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check cache on mount, but don't auto-fetch from API
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, isRealtime: cachedRealtime } = JSON.parse(cached);
        setSchemes(data);
        setIsRealtime(!!cachedRealtime);
      } catch (e) {
        setSchemes([]);
        setIsRealtime(false);
      }
    } else {
      setSchemes([]);
      setIsRealtime(false);
    }
  }, []);

  const filteredSchemes = schemes.filter(scheme => 
    scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const t = {
    title: language === 'en' ? 'Government Schemes' : 'حکومتی سکیمیں',
    search: language === 'en' ? 'Search schemes...' : 'سکیمیں تلاش کریں...',
    lastDate: language === 'en' ? 'Last Date' : 'آخری تاریخ',
    applyNow: language === 'en' ? 'Apply Now' : 'ابھی اپلائی کریں',
    noData: language === 'en' ? 'No schemes found' : 'کوئی سکیم نہیں ملی',
    active: language === 'en' ? 'Active' : 'فعال',
    upcoming: language === 'en' ? 'Upcoming' : 'آنے والی',
    closed: language === 'en' ? 'Closed' : 'بند',
    info: language === 'en' ? 'Latest agricultural subsidies and programs from the Government of Pakistan.' : 'حکومت پاکستان کی جانب سے تازہ ترین زرعی سبسڈیز اور پروگرام۔',
    loadData: language === 'en' ? 'Load Schemes' : 'سکیمیں لوڈ کریں',
    realtime: language === 'en' ? 'Live Data' : 'براہ راست ڈیٹا',
    historical: language === 'en' ? 'Historical Data' : 'تاریخی ڈیٹا'
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-olive-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
            <Briefcase className="text-emerald-600" />
            {t.title}
          </h2>
          {schemes.length > 0 && (
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${isRealtime ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isRealtime ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isRealtime ? t.realtime : t.historical}
              </span>
              <p className="text-olive-600 dark:text-gray-400 font-bold flex items-center gap-1">
                <Info className="h-4 w-4" />
                {t.info}
              </p>
            </div>
          )}
        </div>
        {schemes.length > 0 && (
          <button 
            onClick={() => fetchSchemes(true)}
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

      {schemes.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 glass rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50">
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
            <Briefcase className="h-16 w-16 text-emerald-500 opacity-50" />
          </div>
          <div className="text-center px-6">
            <h3 className="text-xl font-black text-olive-900 dark:text-gray-100 mb-2">{t.loadData}</h3>
            <p className="text-olive-600 dark:text-gray-400 font-medium">Click below to fetch the latest government agricultural schemes and subsidies.</p>
          </div>
          <button 
            onClick={() => fetchSchemes(true)}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
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
          <p className="text-olive-600 dark:text-gray-400 font-bold animate-pulse">Fetching latest government updates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-3xl p-6 border border-white/10 shadow-lg relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                      scheme.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      scheme.status === 'upcoming' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {t[scheme.status]}
                    </div>
                    <div className="flex items-center gap-2 text-olive-500 dark:text-gray-500 font-bold text-sm">
                      <Calendar className="h-4 w-4" />
                      {t.lastDate}: {scheme.lastDate}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-olive-900 dark:text-gray-100 mb-2 group-hover:text-emerald-600 transition-colors">{scheme.title}</h3>
                  <p className="text-olive-700 dark:text-gray-300 font-medium mb-6 leading-relaxed">
                    {scheme.description}
                  </p>
                  <a 
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    {t.applyNow}
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
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

export default GovSchemes;
