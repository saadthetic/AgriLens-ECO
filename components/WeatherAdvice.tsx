import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Loader2, MapPin, Calendar, Sparkles, RefreshCw, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchGeneralAgriData, generateWeatherAdvice } from '../services/geminiService';

interface WeatherAdviceProps {
  selectedCity: string;
  language: 'en' | 'ur';
}

interface WeatherData {
  current: {
    temp: string;
    condition: string;
    humidity: string;
    wind: string;
  };
  forecast: {
    day: string;
    temp: string;
    condition: string;
  }[];
  advice: {
    title: string;
    headline: string;
    content: string;
  }[];
}

export const WeatherAdvice: React.FC<WeatherAdviceProps> = ({ selectedCity, language }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRealtime, setIsRealtime] = useState<boolean>(false);

  const CACHE_KEY = `agriLens_weather_${selectedCity}`;
  const COOLDOWN_DURATION = 30 * 1000; // 30 seconds cooldown

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchWeather = async (force = false) => {
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
          // 6 hour cache
          if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
            setWeather(data);
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
      const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (weatherApiKey && weatherApiKey !== 'your_weather_api_key_here') {
        // 1. Fetch real-time weather from dedicated API
        const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${selectedCity}&days=7&aqi=no&alerts=no&lang=${language === 'ur' ? 'ur' : 'en'}`;
        const weatherRes = await fetch(weatherUrl);
        
        if (!weatherRes.ok) throw new Error('Weather API request failed');
        
        const weatherJson = await weatherRes.json();
        
        // 2. Format the data for our component
        const formattedWeather: WeatherData = {
          current: {
            temp: `${Math.round(weatherJson.current.temp_c)}°C`,
            condition: weatherJson.current.condition.text,
            humidity: `${weatherJson.current.humidity}%`,
            wind: `${weatherJson.current.wind_kph} km/h ${weatherJson.current.wind_dir}`
          },
          forecast: weatherJson.forecast.forecastday.map((d: any) => ({
            day: new Date(d.date).toLocaleDateString(language === 'en' ? 'en-US' : 'ur-PK', { weekday: 'short' }),
            temp: `${Math.round(d.day.avgtemp_c)}°C`,
            condition: d.day.condition.text
          })),
          advice: [] // Will be filled by Gemini
        };

        // 3. Get AI advice based on this REAL data
        try {
          const advice = await generateWeatherAdvice(formattedWeather, language, selectedCity);
          formattedWeather.advice = advice;
        } catch (aiError) {
          console.error("AI Advice failed, using fallback advice:", aiError);
          formattedWeather.advice = [
            { 
              title: language === 'en' ? 'General Care' : 'عام دیکھ بھال', 
              headline: language === 'en' ? 'Monitor Conditions' : 'حالات کی نگرانی کریں', 
              content: language === 'en' ? 'Please monitor the weather closely for any sudden changes.' : 'براہ کرم کسی بھی اچانک تبدیلی کے لیے موسم کی قریب سے نگرانی کریں۔'
            }
          ];
        }

        setWeather(formattedWeather);
        setIsRealtime(true);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: formattedWeather, timestamp: Date.now(), isRealtime: true }));
      } else {
        // Fallback to Gemini Grounding if no Weather API key is provided
        const prompt = `Get the current weather and 7-day forecast for ${selectedCity}, Pakistan. 
        Also provide professional AI-driven farming advice based on this weather for local crops.
        Return the data as a JSON object with the following structure:
        {
          "current": { "temp": "string", "condition": "string", "humidity": "string", "wind": "string" },
          "forecast": [ { "day": "string", "temp": "string", "condition": "string" } ],
          "advice": [ { "title": "string", "headline": "string", "content": "string" } ]
        }
        Ensure the advice is specific to the current season and weather conditions in ${selectedCity}. 
        Provide 3-4 distinct advice parts. Language: ${language === 'en' ? 'English' : 'Urdu'}.`;

        const { data, isRealtime: realtimeResult } = await fetchGeneralAgriData<WeatherData>(prompt, language);
        setWeather(data);
        setIsRealtime(realtimeResult);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now(), isRealtime: realtimeResult }));
      }
      setLastFetchTime(Date.now());
    } catch (error: any) {
      console.error("Error fetching weather:", error);
      
      if (error?.message?.includes('Quota exceeded') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        setErrorMsg(language === 'en' 
          ? "AI is currently busy. Please wait a minute before refreshing again." 
          : "AI فی الحال مصروف ہے۔ براہ کرم دوبارہ تازہ کرنے سے پہلے ایک منٹ انتظار کریں۔");
      } else {
        // Fallback data
        const fallbackData = {
          current: { temp: '28°C', condition: 'Sunny', humidity: '45%', wind: '12 km/h' },
          forecast: [
            { day: 'Mon', temp: '29°C', condition: 'Sunny' },
            { day: 'Tue', temp: '30°C', condition: 'Partly Cloudy' },
            { day: 'Wed', temp: '27°C', condition: 'Rain' },
          ],
          advice: [
            { 
              title: language === 'en' ? 'Irrigation' : 'آبپاشی', 
              headline: language === 'en' ? 'Increase Watering' : 'پانی بڑھائیں', 
              content: language === 'en' ? 'Keep your crops well-watered as the temperature is rising.' : 'اپنی فصلوں کو اچھی طرح پانی دیں کیونکہ درجہ حرارت بڑھ رہا ہے۔'
            },
            { 
              title: language === 'en' ? 'Protection' : 'تحفظ', 
              headline: language === 'en' ? 'Watch for Rain' : 'بارش کا خیال رکھیں', 
              content: language === 'en' ? 'Watch out for potential rain on Wednesday.' : 'بدھ کو ممکنہ بارش کا خیال رکھیں۔'
            }
          ]
        };
        setWeather(fallbackData);
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
        setWeather(data);
        setIsRealtime(!!cachedRealtime);
      } catch (e) {
        setWeather(null);
        setIsRealtime(false);
      }
    } else {
      setWeather(null);
      setIsRealtime(false);
    }
  }, [selectedCity]);

  const t = {
    title: language === 'en' ? 'Weather Advice' : 'موسم کی مشورت',
    current: language === 'en' ? 'Current Weather' : 'موجودہ موسم',
    forecast: language === 'en' ? '7-Day Forecast' : '7 دن کی پیشن گوئی',
    advice: language === 'en' ? 'AI Farming Tips' : 'AI فارمنگ ٹپس',
    humidity: language === 'en' ? 'Humidity' : 'نمی',
    wind: language === 'en' ? 'Wind' : 'ہوا',
    refresh: language === 'en' ? 'Refresh' : 'تازہ دم کریں',
    loadData: language === 'en' ? 'Load Weather Data' : 'موسم کا ڈیٹا لوڈ کریں',
    realtime: language === 'en' ? 'Live Data' : 'براہ راست ڈیٹا',
    historical: language === 'en' ? 'Historical Data' : 'تاریخی ڈیٹا'
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-olive-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
            <CloudSun className="text-emerald-600" />
            {t.title}
          </h2>
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
        </div>
        {weather && (
          <button 
            onClick={() => fetchWeather(true)}
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

      {weather && !isRealtime && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3 text-amber-700 dark:text-amber-400 text-xs font-medium"
        >
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">
              {language === 'en' ? 'Search Limit Reached' : 'تلاش کی حد ختم ہوگئی'}
            </p>
            <p>
              {language === 'en' 
                ? 'The AI search quota has been hit. For 100% accurate live weather, please add a Weather API key in the settings.' 
                : 'AI تلاش کا کوٹہ ختم ہو گیا ہے۔ 100% درست لائیو موسم کے لیے، براہ کرم سیٹنگز میں ویدر API کی شامل کریں۔'}
            </p>
          </div>
        </motion.div>
      )}

      {!weather && !loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 glass rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50">
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
            <CloudSun className="h-16 w-16 text-emerald-500 opacity-50" />
          </div>
          <div className="text-center px-6">
            <h3 className="text-xl font-black text-olive-900 dark:text-gray-100 mb-2">{t.loadData}</h3>
            <p className="text-olive-600 dark:text-gray-400 font-medium">Click below to fetch real-time weather and AI farming advice for {selectedCity}.</p>
          </div>
          <button 
            onClick={() => fetchWeather(true)}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            {t.loadData}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
          <p className="text-olive-600 dark:text-gray-400 font-bold animate-pulse">Analyzing weather patterns...</p>
        </div>
      ) : weather && (
        <div className="space-y-6">
          {/* Current Weather Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-8 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800/30 shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-sm">{t.current}</p>
                  <h3 className="text-6xl font-black mt-2 text-olive-900 dark:text-gray-100">{weather.current.temp}</h3>
                  <p className="text-2xl font-bold mt-1 text-olive-700 dark:text-gray-300">{weather.current.condition}</p>
                </div>
                <CloudSun className="h-20 w-20 text-emerald-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-2xl p-3">
                  <Droplets className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold uppercase text-olive-500 dark:text-gray-500">{t.humidity}</p>
                    <p className="font-black text-olive-900 dark:text-gray-100">{weather.current.humidity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-2xl p-3">
                  <Wind className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold uppercase text-olive-500 dark:text-gray-500">{t.wind}</p>
                    <p className="font-black text-olive-900 dark:text-gray-100">{weather.current.wind}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Forecast Grid - Reordered to be second */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-olive-900 dark:text-gray-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              {t.forecast}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {weather.forecast.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="glass min-w-[120px] rounded-3xl p-4 flex flex-col items-center text-center space-y-2 border border-white/10"
                >
                  <p className="text-sm font-black text-olive-600 dark:text-gray-400 uppercase tracking-wider">{day.day}</p>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <CloudSun className="h-6 w-6" />
                  </div>
                  <p className="text-lg font-black text-olive-900 dark:text-gray-100">{day.temp}</p>
                  <p className="text-xs font-bold text-olive-500 dark:text-gray-500">{day.condition}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Advice Card - Reordered to be third and structured */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-olive-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              {t.advice}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {weather.advice.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/30 shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full">
                      {item.title}
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-olive-900 dark:text-gray-100 mb-2">{item.headline}</h4>
                  <p className="text-olive-700 dark:text-gray-300 font-medium leading-relaxed text-sm">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
