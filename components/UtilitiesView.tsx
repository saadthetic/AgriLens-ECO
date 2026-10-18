import React, { useState, useEffect } from 'react';
import { Wrench, Calculator, Briefcase, History, Settings, ChevronRight, Info, Droplets, Leaf, Sprout, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GovSchemes } from './GovSchemes';

interface UtilitiesViewProps {
  language: 'en' | 'ur';
  setActiveTab: (tab: any) => void;
  activeSubTab?: string;
  setActiveSubTab: (sub: 'menu' | 'calculator' | 'schemes') => void;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({ 
  language, 
  setActiveTab, 
  activeSubTab = 'menu',
  setActiveSubTab 
}) => {
  const subView = activeSubTab;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [subView]);

  const t = {
    title: language === 'en' ? 'Utilities' : 'افادیت',
    calcTitle: language === 'en' ? 'Fertilizer Calculator' : 'کھاد کا کیلکولیٹر',
    calcDesc: language === 'en' ? 'Calculate the exact amount of fertilizer needed for your crops.' : 'اپنی فصلوں کے لیے درکار کھاد کی صحیح مقدار کا حساب لگائیں۔',
    schemesTitle: language === 'en' ? 'Gov Schemes' : 'حکومتی سکیمیں',
    schemesDesc: language === 'en' ? 'Latest subsidies and programs from the government.' : 'حکومت کی جانب سے تازہ ترین سبسڈیز اور پروگرام۔',
    historyTitle: language === 'en' ? 'Analysis History' : 'تجزیہ کی تاریخ',
    historyDesc: language === 'en' ? 'View your past crop scans and results.' : 'اپنے پچھلے فصلوں کے اسکین اور نتائج دیکھیں۔',
    settingsTitle: language === 'en' ? 'App Settings' : 'ایپ کی ترتیبات',
    settingsDesc: language === 'en' ? 'Manage your preferences and collections.' : 'اپنی ترجیحات اور مجموعوں کا نظم کریں۔',
    back: language === 'en' ? 'Back' : 'واپس',
    calculate: language === 'en' ? 'Calculate' : 'حساب لگائیں',
    crop: language === 'en' ? 'Select Crop' : 'فصل منتخب کریں',
    area: language === 'en' ? 'Area (Acres)' : 'رقبہ (ایکڑ)',
    soil: language === 'en' ? 'Soil Type' : 'مٹی کی قسم',
    result: language === 'en' ? 'Recommendation' : 'سفارش',
  };

  if (subView === 'schemes') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setActiveSubTab('menu')}
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-4"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          {t.back}
        </button>
        <GovSchemes language={language} />
      </div>
    );
  }

  if (subView === 'calculator') {
    return <FertilizerCalculator language={language} onBack={() => setActiveSubTab('menu')} />;
  }

  const menuItems = [
    { id: 'status', title: language === 'en' ? 'System Status & API Health' : 'سسٹم اسٹیٹس اور ٹیلی میٹری', desc: language === 'en' ? 'Real-time telemetry, API downtime monitors, Mandi sync & TFLite edge engine status.' : 'اے پی آئیز، منڈی ریٹس، اور آن ڈیوائس ماڈل کا لائیو اسٹیٹس۔', icon: <Activity className="h-6 w-6" />, color: 'bg-teal-600', action: () => setActiveTab('status') },
    { id: 'calculator', title: t.calcTitle, desc: t.calcDesc, icon: <Calculator className="h-6 w-6" />, color: 'bg-blue-500', action: () => setActiveSubTab('calculator') },
    { id: 'schemes', title: t.schemesTitle, desc: t.schemesDesc, icon: <Briefcase className="h-6 w-6" />, color: 'bg-amber-500', action: () => setActiveSubTab('schemes') },
    { id: 'history', title: t.historyTitle, desc: t.historyDesc, icon: <History className="h-6 w-6" />, color: 'bg-emerald-500', action: () => setActiveTab('history') },
    { id: 'settings', title: t.settingsTitle, desc: t.settingsDesc, icon: <Settings className="h-6 w-6" />, color: 'bg-purple-500', action: () => setActiveTab('settings') },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-3xl font-black text-olive-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
          <Wrench className="text-emerald-600" />
          {t.title}
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={item.action}
            className="glass rounded-3xl p-6 flex items-center justify-between group hover:shadow-xl transition-all border border-white/10 text-left w-full"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 ${item.color} text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-olive-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-sm text-olive-600 dark:text-gray-400 font-medium mt-1">{item.desc}</p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-olive-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const FertilizerCalculator: React.FC<{ language: 'en' | 'ur', onBack: () => void }> = ({ language, onBack }) => {
  const [crop, setCrop] = useState('Wheat');
  const [area, setArea] = useState('1');
  const [soil, setSoil] = useState('Loamy');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    // Simple logic for demo, could be more complex
    const areaNum = parseFloat(area) || 1;
    let urea = 0;
    let dap = 0;
    let mop = 0;

    if (crop === 'Wheat') {
      urea = 2 * areaNum;
      dap = 1 * areaNum;
      mop = 0.5 * areaNum;
    } else if (crop === 'Rice') {
      urea = 2.5 * areaNum;
      dap = 1.5 * areaNum;
      mop = 1 * areaNum;
    } else {
      urea = 1.5 * areaNum;
      dap = 1 * areaNum;
      mop = 0.5 * areaNum;
    }

    const res = language === 'en' 
      ? `For ${areaNum} acres of ${crop} on ${soil} soil, we recommend: ${urea} bags of Urea, ${dap} bags of DAP, and ${mop} bags of MOP.`
      : `${areaNum} ایکڑ ${crop} کے لیے ${soil} مٹی پر، ہم تجویز کرتے ہیں: ${urea} بوریاں یوریا، ${dap} بوریاں ڈی اے پی، اور ${mop} بوریاں ایم او پی۔`;
    
    setResult(res);
  };

  const t = {
    back: language === 'en' ? 'Back' : 'واپس',
    title: language === 'en' ? 'Fertilizer Calculator' : 'کھاد کا کیلکولیٹر',
    crop: language === 'en' ? 'Crop' : 'فصل',
    area: language === 'en' ? 'Area (Acres)' : 'رقبہ (ایکڑ)',
    soil: language === 'en' ? 'Soil Type' : 'مٹی کی قسم',
    calculate: language === 'en' ? 'Calculate' : 'حساب لگائیں',
    result: language === 'en' ? 'Recommendation' : 'سفارش',
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-4"
      >
        <ChevronRight className="h-5 w-5 rotate-180" />
        {t.back}
      </button>

      <div className="glass rounded-3xl p-8 space-y-8 shadow-xl border border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-blue-500 text-white rounded-2xl shadow-lg">
            <Calculator className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-black text-olive-900 dark:text-gray-100">{t.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-olive-600 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              {t.crop}
            </label>
            <select 
              value={crop} 
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800/50 rounded-2xl px-4 py-3 text-olive-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 font-bold"
            >
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Maize">Maize</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-olive-600 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Sprout className="h-4 w-4" />
              {t.area}
            </label>
            <input 
              type="number" 
              value={area} 
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800/50 rounded-2xl px-4 py-3 text-olive-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-olive-600 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              {t.soil}
            </label>
            <select 
              value={soil} 
              onChange={(e) => setSoil(e.target.value)}
              className="w-full bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800/50 rounded-2xl px-4 py-3 text-olive-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 font-bold"
            >
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Clayey">Clayey</option>
              <option value="Silty">Silty</option>
            </select>
          </div>
        </div>

        <button 
          onClick={calculate}
          className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <Calculator className="h-6 w-6" />
          {t.calculate}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl p-6 border-2 border-emerald-100 dark:border-emerald-800/50"
            >
              <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-sm">
                <Info className="h-4 w-4" />
                {t.result}
              </div>
              <p className="text-lg font-bold text-olive-900 dark:text-gray-100 leading-relaxed">
                {result}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
