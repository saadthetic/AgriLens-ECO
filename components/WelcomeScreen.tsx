import React from 'react';
import { 
  Cpu, 
  TrendingUp, 
  Wind, 
  ArrowRight, 
  Globe, 
  MapPin, 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  Activity,
  Leaf
} from 'lucide-react';
import { motion } from 'motion/react';
import { AgriLensLogoIcon } from './Icons';
import type { ActiveTab } from './BottomNav';

export interface WelcomeScreenProps {
  onStart: (initialTab?: ActiveTab) => void;
  language?: 'en' | 'ur';
  setLanguage?: (lang: 'en' | 'ur') => void;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
}

const PUNJAB_CITIES = [
  'Sahiwal', 'Lahore', 'Faisalabad', 'Multan', 'Gujranwala', 
  'Rawalpindi', 'Sheikhupura', 'Kasur', 'Okara', 'Bahawalpur', 
  'Sargodha', 'Rahim Yar Khan'
];

const FeaturePillar: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string;
  badge: string;
  children: React.ReactNode; 
}> = ({ icon, title, subtitle, badge, children }) => (
  <motion.div 
    whileHover={{ y: -6 }}
    className="glass rounded-3xl p-6 sm:p-7 h-full transition-all duration-300 border border-white/20 dark:border-gray-800 shadow-xl flex flex-col justify-between relative overflow-hidden group bg-gradient-to-b from-white/70 to-white/40 dark:from-gray-900/70 dark:to-gray-900/40"
  >
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {badge}
        </span>
      </div>
      <h3 className="text-xl font-black text-olive-900 dark:text-gray-100 tracking-tight">{title}</h3>
      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1 mb-4">{subtitle}</p>
      <div className="text-olive-700 dark:text-gray-300 space-y-2.5 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  </motion.div>
);

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart,
  language = 'en',
  setLanguage,
  selectedCity = 'Sahiwal',
  setSelectedCity,
  isDarkMode = false,
  toggleDarkMode,
  isOffline = false,
  onToggleOffline
}) => {
  const isUrdu = language === 'ur';

  return (
    <div 
      className={`min-h-screen flex flex-col items-center font-sans p-4 sm:p-6 lg:p-8 overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`} 
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between gap-3 py-2 flex-wrap mb-4">
        {/* City Selector Pill */}
        <div className="flex items-center gap-2">
          {setSelectedCity && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-gray-800/70 border border-emerald-200 dark:border-gray-700 shadow-sm text-xs font-bold text-olive-900 dark:text-gray-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-hidden cursor-pointer text-xs font-bold text-olive-900 dark:text-gray-100 pr-2"
                title={isUrdu ? 'زرعی ضلع منتخب کریں' : 'Select Agricultural District'}
              >
                {PUNJAB_CITIES.map(city => (
                  <option key={city} value={city} className="dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    {city} {city === 'Sahiwal' ? '(HQ)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* System Telemetry Quick Pill */}
          <button
            onClick={() => onStart('status')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-all shadow-xs"
            title="Telemetry Status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>8/8 {isUrdu ? 'سروسز آن لائن' : 'Services Online'}</span>
          </button>
        </div>

        {/* Right Controls: Offline toggle, Language, Theme */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Offline / Online Field Mode Toggle */}
          {onToggleOffline && (
            <button
              onClick={onToggleOffline}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs active:scale-95 ${
                isOffline
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
              title={isOffline ? 'Offline Mode active' : 'Connected to Cloud AI'}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
                  <span>{isUrdu ? 'آف لائن فیلڈ موڈ' : 'Offline Mode'}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isUrdu ? 'لائیو کلاؤڈ' : 'Online'}</span>
                </>
              )}
            </button>
          )}

          {/* Bilingual Language Switcher (Urdu / English) */}
          {setLanguage && (
            <button
              onClick={() => setLanguage(isUrdu ? 'en' : 'ur')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-black border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 transition-all shadow-xs"
              title="Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          {toggleDarkMode && (
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-xs"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center my-6 sm:my-10 max-w-3xl"
      >
        <div className="inline-block p-4 sm:p-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl mb-4 ring-8 ring-emerald-50 dark:ring-emerald-900/10 shadow-lg">
          <AgriLensLogoIcon className="h-16 w-16 mx-auto text-emerald-600 dark:text-emerald-500" />
        </div>
        
        {/* Top Sustainable Pill */}
        <div className="flex items-center justify-center mb-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-300 dark:border-emerald-700 shadow-sm">
            🌱 {isUrdu ? 'پائیدار زرعی ٹیکنالوجی • پنجاب کلائمیٹ ایکشن' : 'SUSTAINABLE AGRITECH • PUNJAB CLIMATE RESILIENCE'}
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-olive-900 dark:text-gray-100 tracking-tighter inline-flex items-center justify-center flex-wrap">
          <span>Agri<span className="text-emerald-600 dark:text-emerald-400">Lens</span></span>
          <span className="ml-2 sm:ml-3 text-xs sm:text-sm md:text-base bg-emerald-500 text-white font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg uppercase tracking-wider shadow-md relative -top-4 sm:-top-6 select-none">
            ECO
          </span>
        </h1>
        
        <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-2xl font-black bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent leading-snug">
          {isUrdu 
            ? 'سمارٹ فصل تشخیص، لائیو منڈی ریٹس اور ماحول دوست زراعت' 
            : 'Smart Crop Diagnostics, Live Mandi Intelligence & Clean Air Farming'}
        </p>

        <p className="mt-3 text-sm sm:text-base text-olive-700 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          {isUrdu
            ? 'پنجاب اور پاکستان کے کسانوں کے لیے جدید ترین زرعی اور ماحولیاتی پلیٹ فارم۔ انٹرنیٹ کے بغیر 100% آن ڈیوائس TFLite ماڈل، گوگل جیمنائی 3 کلاؤڈ ویژن اور ای پی سی سی ڈی اینٹی اسموگ حل۔'
            : 'Next-generation agronomy and environmental intelligence for farmers across Punjab and Pakistan. Combining instant offline edge neural vision with cloud diagnostics and clean-air crop residue solutions.'}
        </p>

        {/* Primary Launch Button & Quick Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => onStart('analyze')}
            className="px-9 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/30 active:scale-95 transition-all text-base uppercase tracking-wider flex items-center gap-3 cursor-pointer"
          >
            <span className="inline-flex items-center gap-1.5">
              <span>{isUrdu ? 'ایپ شروع کریں' : 'Launch AgriLens'}</span>
              <span className="text-[10px] bg-emerald-800 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider relative -top-1.5 select-none shadow-xs">
                ECO
              </span>
            </span>
            <ArrowRight className={`w-5 h-5 ${isUrdu ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Jump Action Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs font-bold pt-2">
            <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium mr-1">
              {isUrdu ? 'فوری رسائی:' : 'Quick Jump:'}
            </span>
            <button
              onClick={() => onStart('analyze')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-emerald-200 dark:border-gray-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1.5"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isUrdu ? 'فصل اسکین' : 'Diagnose Crop'}</span>
            </button>

            <button
              onClick={() => onStart('mandi')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-emerald-200 dark:border-gray-700 text-olive-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isUrdu ? 'منڈی ریٹس' : 'Mandi Rates'}</span>
            </button>

            <button
              onClick={() => onStart('smog')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-teal-200 dark:border-gray-700 text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors flex items-center gap-1.5"
            >
              <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isUrdu ? 'اسموگ ایڈوائزری' : 'Anti-Smog Hub'}</span>
            </button>

            <button
              onClick={() => onStart('status')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isUrdu ? 'سسٹم اسٹیٹس' : 'System Telemetry'}</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* 4 Trust & Innovation Metric Cards */}
      <div className="w-full max-w-6xl mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-emerald-100 dark:border-gray-800 text-center shadow-sm">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">40 Crops</p>
            <p className="text-xs font-bold text-olive-900 dark:text-gray-200 mt-1">
              {isUrdu ? 'مکمل آف لائن ڈیٹا بیس' : 'Offline Knowledge-Base'}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {isUrdu ? '10 پاکستانی و 30 نباتاتی فصلیں' : 'Pakistani Staples & Vision Labels'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-teal-100 dark:border-gray-800 text-center shadow-sm">
            <p className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">0 KB Data</p>
            <p className="text-xs font-bold text-olive-900 dark:text-gray-200 mt-1">
              {isUrdu ? 'آن ڈیوائس TFLite ماڈل' : 'On-Device TFLite Edge'}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {isUrdu ? '40-80ms تیز رفتار شناخت' : '40–80ms NPU Inference'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-olive-100 dark:border-gray-800 text-center shadow-sm">
            <p className="text-2xl sm:text-3xl font-black text-olive-800 dark:text-olive-300">30+ Mandis</p>
            <p className="text-xs font-bold text-olive-900 dark:text-gray-200 mt-1">
              {isUrdu ? 'پنجاب ہول سیل منڈیاں' : 'Punjab Mandi Hubs'}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {isUrdu ? 'روزانہ تصدیق شدہ تھوک ریٹس' : 'Daily Committee Benchmarks'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-blue-100 dark:border-gray-800 text-center shadow-sm">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">12 Districts</p>
            <p className="text-xs font-bold text-olive-900 dark:text-gray-200 mt-1">
              {isUrdu ? 'ای پی سی سی ڈی زمینی سنسرز' : 'EPCCD Ground Array'}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {isUrdu ? 'کلین ایئر اور اسموگ الرٹس' : 'BAM-1020 PM2.5 Telemetry'}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Crisp Feature Pillars */}
      <main className="flex-grow container mx-auto w-full max-w-6xl pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1 */}
          <FeaturePillar 
            icon={<Cpu className="h-6 w-6" />} 
            title={isUrdu ? '🌿 ہائبرڈ اے آئی فصل و پودا ڈاکٹر' : '🌿 Hybrid AI Crop & Plant Doctor'}
            subtitle={isUrdu ? 'فوری آف لائن ایج ویژن + گہری کلاؤڈ تشخیص' : 'Instant Offline Edge Vision + Deep Cloud Diagnostics'}
            badge={isUrdu ? 'آن ڈیوائس و کلاؤڈ' : 'On-Device & Cloud'}
          >
            <ul className="space-y-2.5">
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'ایج TFLite ویژن:' : 'AgriLens Edge Vision:'}</strong>{' '}
                  {isUrdu 
                    ? 'انٹرنیٹ کے بغیر فیلڈ میں فصلوں اور جڑی بوٹیوں کی فوری شناخت اور 40 مکمل پروفائلز۔' 
                    : 'Instant offline field identification of crops and weeds with zero mobile data.'}
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'ملٹی موڈل تشخیص:' : 'Multimodal Diagnosis:'}</strong>{' '}
                  {isUrdu 
                    ? 'فنگل، بیکٹیریل اور کیڑوں کی بیماریوں کی گہری تشخیص اور کیمیائی و آرگینک علاج۔' 
                    : 'Pinpoints fungal, bacterial, and pest crop diseases with curated treatment plans.'}
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'اردو و انگریزی صوتی رپورٹ (TTS):' : 'Bilingual Voice TTS:'}</strong>{' '}
                  {isUrdu 
                    ? 'فیلڈ میں موجود کسانوں کے لیے صاف اور باآسانی سمجھ آنے والی اردو آڈیو رپورٹس۔' 
                    : 'Complete spoken audio reports in clear Urdu and English for farmers in the field.'}
                </span>
              </li>
            </ul>
          </FeaturePillar>

          {/* Pillar 2 */}
          <FeaturePillar 
            icon={<TrendingUp className="h-6 w-6" />} 
            title={isUrdu ? '📊 لائیو منڈی ریٹس اور فارم اکامکس' : '📊 Live Mandi Rates & Farm Economics'}
            subtitle={isUrdu ? 'روزانہ منڈی معلومات اور منافع کی منصوبہ بندی' : 'Daily Market Intelligence & Profit Planning'}
            badge={isUrdu ? 'لائیو ڈیٹا' : 'Real-Time Data'}
          >
            <ul className="space-y-2.5">
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'لائیو منڈی قیمتیں:' : 'Live Mandi Rates:'}</strong>{' '}
                  {isUrdu 
                    ? 'پنجاب کی 30 سے زائد اہم منڈیوں کے روزانہ کے سرکاری و مارکیٹ ریٹس فی من (40 کلوگرام)۔' 
                    : 'Real-time wholesale prices across 30+ major grain and commodity markets in Pakistan.'}
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'منافع کیلکولیٹر:' : 'Profitability Calculator:'}</strong>{' '}
                  {isUrdu 
                    ? 'فی ایکڑ پیداواری لاگت، تخمینہ پیداوار اور خالص منافع کا تفصیلی حساب کتاب۔' 
                    : 'Dynamic per-acre yield and cost analytics to maximize net farm revenue.'}
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'حکومتی سبسڈیز:' : 'Government Schemes:'}</strong>{' '}
                  {isUrdu 
                    ? 'پنجاب حکومت کے سپر سیڈر اور ہیپی سیڈر پر 60% گرانٹ اور سولر ٹیوب ویل سکیم کا تصدیق شدہ ڈیٹا۔' 
                    : 'Verified access to Punjab Super Seeder 60% machinery subsidies and solar tube-well grants.'}
                </span>
              </li>
            </ul>
          </FeaturePillar>

          {/* Pillar 3 */}
          <FeaturePillar 
            icon={<Wind className="h-6 w-6" />} 
            title={isUrdu ? '🌍 ای پی سی سی ڈی کلین ایئر و زیرو برن ہب' : '🌍 EPCCD Clean Air & Zero-Burn Hub'}
            subtitle={isUrdu ? 'پنجاب اسموگ ٹیلی میٹری اور بائیو متبادل' : 'Punjab Smog Telemetry & Bio-Alternatives'}
            badge="EPCCD Punjab"
          >
            <ul className="space-y-2.5">
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'اضلاعی ایئر کوالٹی انڈیکس:' : 'District AQI Telemetry:'}</strong>{' '}
                  {isUrdu 
                    ? 'ای پی سی سی ڈی پنجاب کے زمینی سنسرز کے مطابق PM2.5 اور اسموگ کا درست الرٹ۔' 
                    : 'Live atmospheric air quality and PM2.5 tracking calibrated with EPCCD Punjab ground sensors.'}
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'زیرو برننگ ایڈوائزری:' : 'Zero-Burn Advisory:'}</strong>{' '}
                  {isUrdu 
                    ? 'دھان کی باقیات جلانے کے بجائے PUSA بائیو ڈی کمپوزر اسپرے اور سپر سیڈر کے ذریعے کھاد بنانے کا طریقہ۔' 
                    : 'PUSA bio-decomposer recipes and Happy Seeder direct-drilling to eradicate stubble burning.'}
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className={`h-4 w-4 text-emerald-500 shrink-0 mt-0.5 ${isUrdu ? 'ml-2 rotate-180' : 'mr-2'}`} /> 
                <span>
                  <strong>{isUrdu ? 'قانونی و ماحولیاتی تحفظ:' : 'Legal Protection & Pledge:'}</strong>{' '}
                  {isUrdu 
                    ? 'دفعہ 144 اور 50 ہزار جرمانے سے بچاؤ اور ماحول دوست کسان کمیونٹی سرٹیفیکیشن۔' 
                    : 'Avoid Section 144 FIR PPC 188 penalties and sign the community Clean Air pledge.'}
                </span>
              </li>
            </ul>
          </FeaturePillar>
        </div>


      </main>
    </div>
  );
};
