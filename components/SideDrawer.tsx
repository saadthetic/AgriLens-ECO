import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, LogOut, Calculator, Briefcase, History, Moon, Sun, 
  MapPin, Folder, Plus, Trash2, ChevronDown, Wind,
  LifeBuoy, Send, CheckCircle2, RefreshCw, Activity
} from 'lucide-react';
import type { Collection, SupportTicket } from '../types';
import { submitSupportTicket, getSupportTickets } from '../services/firebaseService';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any, subTab?: string) => void;
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  collections: Collection[];
  onAddCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  language,
  setLanguage,
  onLogout,
  isDarkMode,
  toggleDarkMode,
  selectedCity,
  setSelectedCity,
  collections,
  onAddCollection,
  onDeleteCollection
}) => {
  const [expandedSection, setExpandedSection] = useState<'utilities' | 'settings' | 'collections' | null>('utilities');
  const [newCollectionName, setNewCollectionName] = useState('');

  // Support Ticket Modal State
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [ticketCity, setTicketCity] = useState(selectedCity);
  const [submittedDistrict, setSubmittedDistrict] = useState(selectedCity);
  const [ticketIssueType, setTicketIssueType] = useState<SupportTicket['issueType']>('Crop Scan Feedback');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketContact, setTicketContact] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccessId, setTicketSuccessId] = useState<string | null>(null);
  const [userTickets, setUserTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    if (isSupportModalOpen) {
      setTicketCity(selectedCity);
      getSupportTickets().then(setUserTickets);
    }
  }, [isSupportModalOpen, selectedCity]);

  const t = {
    menu: language === 'en' ? 'Menu' : 'مینو',
    utilities: language === 'en' ? 'Utilities & Eco' : 'افادیت اور ماحول',
    settings: language === 'en' ? 'Settings' : 'ترتیبات',
    collections: language === 'en' ? 'Collections' : 'مجموعے',
    helpSupport: language === 'en' ? 'Help & Report Issue' : 'مدد اور مسئلہ رپورٹ کریں',
    helpDesc: language === 'en' ? 'EPCCD & AI Support Ticket' : 'کلاؤڈ سپورٹ ٹکٹ',
    logout: language === 'en' ? 'Exit App' : 'ایپ سے باہر نکلیں',
    theme: language === 'en' ? 'Theme' : 'تھیم',
    language: language === 'en' ? 'Language' : 'زبان',
    city: language === 'en' ? 'City' : 'شہر',
    smogAdvisor: language === 'en' ? 'ECO' : 'ماحولیات (ECO)',
    smogDesc: language === 'en' ? 'AQI, Zero-Burn & Clean Air Hub' : 'ہوا کا معیار اور اینٹی سموگ',
    calc: language === 'en' ? 'Fertilizer Calculator' : 'کھاد کا کیلکولیٹر',
    calcDesc: language === 'en' ? 'Calculate fertilizer needs' : 'کھاد کی ضرورت کا حساب لگائیں',
    schemes: language === 'en' ? 'Gov Schemes' : 'حکومتی سکیمیں',
    schemesDesc: language === 'en' ? 'Latest 60% subsidies' : 'تازہ ترین 60% سبسڈیز',
    history: language === 'en' ? 'Analysis History' : 'تجزیہ کی تاریخ',
    historyDesc: language === 'en' ? 'View past scans' : 'پچھلے اسکین دیکھیں',
    placeholder: language === 'en' ? 'New collection...' : 'نیا مجموعہ...',
    version: '© 2026 AgriLens Eco • Sustainable Agritech & Climate Resilience'
  };

  const cities = [
    'Bahawalpur', 'Bhakkar', 'Faisalabad', 'Gujranwala', 'Islamabad', 'Jhang',
    'Karachi', 'Kasur', 'Khanewal', 'Khushab', 'Kot Addu', 'Lahore', 'Larkana', 
    'Multan', 'Nankana Sahib', 'Narowal', 'Okara', 'Pakpattan', 'Peshawar', 
    'Quetta', 'Rahim Yar Khan', 'Rajanpur', 'Rawalpindi', 'Sahiwal', 'Sargodha', 
    'Sheikhupura', 'Sialkot', 'Sukkur', 'Vehari', 'Wazirabad'
  ].sort();

  const CITY_PREFIX_MAP: Record<string, string> = {
    'Sahiwal': 'SWL',
    'Lahore': 'LHR',
    'Faisalabad': 'FSD',
    'Multan': 'MUL',
    'Gujranwala': 'GRW',
    'Rawalpindi': 'RWP',
    'Okara': 'OKA',
    'Pakpattan': 'PKP',
    'Vehari': 'VHR',
    'Sargodha': 'SGD',
    'Bahawalpur': 'BWP',
    'Kasur': 'KSR',
    'Sheikhupura': 'SKP',
    'Sialkot': 'SKT',
    'Jhang': 'JHG',
    'Khanewal': 'KWL',
    'Rahim Yar Khan': 'RYK',
    'Islamabad': 'ISB',
    'Karachi': 'KHI',
    'Peshawar': 'PEW',
    'Quetta': 'QTA',
    'Bhakkar': 'BKR',
    'Khushab': 'KHB',
    'Kot Addu': 'KTA',
    'Larkana': 'LRK',
    'Nankana Sahib': 'NKS',
    'Narowal': 'NRW',
    'Rajanpur': 'RJP',
    'Sukkur': 'SKR',
    'Wazirabad': 'WZB',
  };

  const getCityInitials = (cityName: string): string => {
    if (CITY_PREFIX_MAP[cityName]) return CITY_PREFIX_MAP[cityName];
    const clean = cityName.replace(/[^A-Za-z]/g, '').toUpperCase();
    return clean.slice(0, 3) || 'ECO';
  };

  const generateDistrictTicketId = (cityName: string): string => {
    const prefix = getCityInitials(cityName);
    const storageKey = `agrilens_ticket_counter_${prefix}`;
    let count = 1;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        count = parseInt(saved, 10) + 1;
      }
      localStorage.setItem(storageKey, String(count));
    } catch {
      count = Math.floor(Math.random() * 90) + 10;
    }
    const padded = count < 10 ? `0${count}` : `${count}`;
    return `${prefix}${padded}`;
  };

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      onAddCollection(newCollectionName.trim());
      setNewCollectionName('');
    }
  };

  const toggleSection = (section: 'utilities' | 'settings' | 'collections') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    setIsSubmittingTicket(true);
    const chosenCity = ticketCity || selectedCity || 'Sahiwal';
    const newTicketId = generateDistrictTicketId(chosenCity);
    const newTicket: SupportTicket = {
      id: newTicketId,
      issueType: ticketIssueType,
      message: ticketMessage.trim(),
      contactEmailOrPhone: ticketContact.trim() || undefined,
      city: chosenCity,
      createdAt: new Date().toISOString(),
      status: 'Open',
      isFirestoreSynced: true
    };

    const synced = await submitSupportTicket(newTicket);
    newTicket.isFirestoreSynced = synced;

    setUserTickets(prev => [newTicket, ...prev]);
    setTicketSuccessId(newTicketId);
    setSubmittedDistrict(chosenCity);
    setTicketMessage('');
    setTicketContact('');
    setIsSubmittingTicket(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-emerald-50/40 dark:bg-emerald-950/20">
                <div className="flex items-center">
                  <h2 className="text-2xl font-black text-olive-900 dark:text-gray-100 tracking-tight inline-flex items-center">
                    Agri<span className="text-emerald-600">Lens</span>
                    <span className="ml-1 text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider relative -top-2 select-none shadow-sm">
                      ECO
                    </span>
                  </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors shadow-sm">
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-6 px-4 space-y-4 no-scrollbar">
                {/* Utilities & Eco Section */}
                <div className="space-y-2">
                  <button 
                    onClick={() => toggleSection('utilities')}
                    className="w-full flex items-center justify-between p-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                  >
                    <span>{t.utilities}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'utilities' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedSection === 'utilities' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-2"
                      >
                        <button
                          onClick={() => { onNavigate('smog'); onClose(); }}
                          className="w-full flex items-center gap-4 p-3 bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/70 dark:hover:bg-teal-900/40 rounded-2xl transition-all group border border-teal-200/50 dark:border-teal-800/40"
                        >
                          <div className="p-2 bg-teal-600 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform">
                            <Wind className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-olive-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                              <span>{t.smogAdvisor}</span>
                              <span className="text-[9px] bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded">EPCCD</span>
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{t.smogDesc}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { onNavigate('utilities', 'calculator'); onClose(); }}
                          className="w-full flex items-center gap-4 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all group"
                        >
                          <div className="p-2 bg-blue-500 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform">
                            <Calculator className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-olive-900 dark:text-gray-100 text-sm">{t.calc}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{t.calcDesc}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { onNavigate('utilities', 'schemes'); onClose(); }}
                          className="w-full flex items-center gap-4 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all group"
                        >
                          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-olive-900 dark:text-gray-100 text-sm">{t.schemes}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{t.schemesDesc}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { onNavigate('history'); onClose(); }}
                          className="w-full flex items-center gap-4 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all group"
                        >
                          <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform">
                            <History className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-olive-900 dark:text-gray-100 text-sm">{t.history}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{t.historyDesc}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { onNavigate('status'); onClose(); }}
                          className="w-full flex items-center gap-4 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 rounded-2xl transition-all group border border-emerald-200/50 dark:border-emerald-800/40"
                        >
                          <div className="p-2 bg-teal-600 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div className="text-left flex-grow">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-olive-900 dark:text-gray-100 text-sm">{language === 'en' ? 'System Status' : 'سسٹم اسٹیٹس'}</p>
                              <span className="text-[9px] bg-emerald-200 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.2 rounded font-black flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                99.9%
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                              {language === 'en' ? 'APIs, Mandi, Weather & TFLite telemetry' : 'اے پی آئیز، منڈی اور ماڈل ٹیلی میٹری'}
                            </p>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Settings Section */}
                <div className="space-y-2">
                  <button 
                    onClick={() => toggleSection('settings')}
                    className="w-full flex items-center justify-between p-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                  >
                    <span>{t.settings}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'settings' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedSection === 'settings' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4 p-2"
                      >
                        <div className="flex gap-2">
                          <button 
                            onClick={toggleDarkMode}
                            className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          >
                            {isDarkMode ? <Moon className="h-4 w-4 text-emerald-500" /> : <Sun className="h-4 w-4 text-amber-500" />}
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.theme}</span>
                          </button>

                          <button 
                            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                            className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          >
                            <span className="text-xs font-bold text-emerald-600">EN/UR</span>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{language === 'en' ? 'English' : 'اردو'}</span>
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-emerald-500" />
                            {t.city}
                          </label>
                          <select 
                            value={selectedCity} 
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 outline-none focus:border-emerald-500"
                          >
                            {cities.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Collections Section */}
                <div className="space-y-2">
                  <button 
                    onClick={() => toggleSection('collections')}
                    className="w-full flex items-center justify-between p-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                  >
                    <span>{t.collections}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'collections' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedSection === 'collections' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-3 p-2"
                      >
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder={t.placeholder}
                            className="flex-grow p-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-200"
                          />
                          <button 
                            onClick={handleAddCollection}
                            className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          {collections.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl group transition-colors">
                              <div className="flex items-center gap-2">
                                <Folder className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{c.name}</span>
                              </div>
                              <button onClick={() => onDeleteCollection(c.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Help & Support Ticket Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="w-full flex items-center gap-3 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 rounded-2xl transition-all border border-emerald-200/60 dark:border-emerald-800/40 group shadow-sm"
                  >
                    <div className="p-1.5 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform">
                      <LifeBuoy className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-olive-900 dark:text-gray-100 text-xs">{t.helpSupport}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{t.helpDesc}</p>
                    </div>
                  </button>
                </div>

                {/* Exit to Welcome Screen */}
                <div>
                  <button
                    onClick={() => { onLogout(); onClose(); }}
                    className="w-full flex items-center gap-3 p-3 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-center">
                <p className="text-[10px] inline-flex items-center justify-center flex-wrap gap-1 font-bold text-gray-400">
                  <span>© 2026 Agri<span className="text-emerald-600 font-bold">Lens</span></span>
                  <span className="text-[8px] bg-emerald-500 text-white font-black px-1 py-0.2 rounded uppercase tracking-wider relative -top-1 select-none shadow-xs">
                    ECO
                  </span>
                  <span className="ml-0.5">• Sustainable Agritech & Climate Resilience</span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clean Support Ticket Modal */}
      <AnimatePresence>
        {isSupportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSupportModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-olive-900 dark:text-gray-100">
                      {language === 'ur' ? 'کسان و ماحولیات سپورٹ سنٹر' : 'AgriLens & EPCCD Help Center'}
                    </h3>
                    <p className="text-xs text-olive-600 dark:text-gray-400 font-medium">
                      {language === 'ur' ? 'شکایات اور تکنیکی رائے کلاؤڈ پر درج کریں' : 'Submit feedback or report station discrepancies'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSupportModalOpen(false)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors shadow-sm"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6 no-scrollbar">
                {ticketSuccessId ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-base font-black text-emerald-900 dark:text-emerald-100">
                      {language === 'ur' ? 'ٹکٹ کامیابی سے درج ہو گیا' : 'Support Ticket Submitted!'}
                    </h4>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100 rounded-xl font-mono text-sm font-black border border-emerald-300 dark:border-emerald-700 shadow-sm">
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-sans font-bold">
                        {language === 'ur' ? 'ریفرنس آئی ڈی:' : 'Reference ID:'}
                      </span>
                      <span className="tracking-wider text-emerald-800 dark:text-emerald-200">{ticketSuccessId}</span>
                    </div>

                    <div className="text-xs font-bold text-olive-800 dark:text-gray-300">
                      <span>{language === 'ur' ? 'ضلع / شہر: ' : 'District / City: '}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-black">{submittedDistrict} (Punjab)</span>
                    </div>

                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      {language === 'ur' 
                        ? `آپ کی درخواست ہماری سپورٹ ٹیم کے پاس درج ہو چکی ہے۔ ہم عام طور پر 24 گھنٹوں کے اندر جواب دیتے ہیں۔` 
                        : `Your request has been logged with our support team. We typically respond within 24 hours.`}
                    </p>
                    <button
                      onClick={() => setTicketSuccessId(null)}
                      className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                    >
                      {language === 'ur' ? 'نیا ٹکٹ درج کریں' : 'Submit Another Ticket'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    {/* District / City Selection */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                        {language === 'ur' ? 'منتخب ضلع یا شہر' : 'District / City'}
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={ticketCity}
                          onChange={(e) => setTicketCity(e.target.value)}
                          className="flex-grow p-3 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-200 font-bold"
                        >
                          {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <div className="px-3.5 py-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-xl font-mono text-xs font-black shrink-0 border border-emerald-300 dark:border-emerald-700" title="District Code Prefix">
                          {getCityInitials(ticketCity)}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        {language === 'ur' ? `ریفرنس کوڈ سابقہ: ${getCityInitials(ticketCity)}` : `Reference ticket ID prefix: ${getCityInitials(ticketCity)} (e.g. ${getCityInitials(ticketCity)}01)`}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                        {language === 'ur' ? 'مسئلے کی نوعیت' : 'Issue Category'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(['Crop Scan Feedback', 'AQI Station Discrepancy', 'General Support'] as const).map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setTicketIssueType(type)}
                            className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                              ticketIssueType === type 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {type === 'Crop Scan Feedback' && '🌾 Crop Scan'}
                            {type === 'AQI Station Discrepancy' && '🌫️ AQI Station'}
                            {type === 'General Support' && '💬 Support'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                        {language === 'ur' ? 'رابطہ نمبر یا ای میل (اختیاری)' : 'Contact Email or Phone (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={ticketContact}
                        onChange={(e) => setTicketContact(e.target.value)}
                        placeholder="e.g. 0300-1234567 or farmer@example.com"
                        className="w-full p-3 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-200 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                        {language === 'ur' ? 'تفصیلی بیان' : 'Message & Issue Description'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder={
                          language === 'ur' 
                            ? 'براہ کرم فصل کی درستگی، سموگ اسٹیشن ریڈنگ، یا ایپ کے استعمال میں دشواری کی تفصیل لکھیں...' 
                            : 'Describe your crop scan feedback, observed AQI station reading variance, or technical query...'
                        }
                        className="w-full p-3 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-200 font-medium resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingTicket || !ticketMessage.trim()}
                        className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmittingTicket ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>{language === 'ur' ? 'ٹکٹ کلاؤڈ پر جمع کریں' : 'Submit Support Ticket'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Recent Tickets Activity */}
                {userTickets.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {language === 'ur' ? 'حالیہ درج شدہ ٹکٹ' : 'Recent Tickets'} ({userTickets.length})
                    </h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                      {userTickets.slice(0, 5).map(t => (
                        <div key={t.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-olive-900 dark:text-gray-100">{t.issueType}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-mono font-black">
                                {t.id.startsWith('ticket_') ? `${getCityInitials(t.city || 'Sahiwal')}01` : t.id}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold">
                                {t.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-2">
                              {t.message}
                            </p>
                          </div>
                          <span className="text-[9px] text-gray-400 shrink-0">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
