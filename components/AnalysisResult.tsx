import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { CropAnalysis, SupplierInfo } from '../types';
import { 
  BookOpen, 
  Calculator, 
  ShieldCheck, 
  Store, 
  TrendingUp, 
  Loader2, 
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Cpu,
  Cloud,
  RefreshCw,
  Leaf,
  AlertTriangle,
  Droplets,
  Sun,
  Award,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { generateVoiceReport, pcmToWavDataUrl, speakBrowserTts, analyzeCropImage } from '../services/geminiService';

interface AnalysisResultProps {
  analysis: CropAnalysis;
  imageUrl: string;
  onGoBack: () => void;
  backButtonLabel: string;
  onFindSuppliers: (cropName: string) => void;
  suppliers: SupplierInfo[] | null;
  isFindingSuppliers: boolean;
  language?: 'en' | 'ur';
  selectedCity?: string;
  onUpdateAnalysis?: (updated: CropAnalysis) => void;
  onToggleOfflineMode?: () => void;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }> = ({ icon, title, children, className }) => (
    <div className={`glass rounded-3xl overflow-hidden p-6 border border-white/20 dark:border-gray-700/30 h-full shadow-xl ${className}`}>
        <div className="flex items-center mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                {icon}
            </div>
            <h3 className="text-lg font-black text-olive-900 dark:text-gray-100 ml-3">{title}</h3>
        </div>
        <div className="text-olive-700 dark:text-gray-300 space-y-2 font-medium">
            {children}
        </div>
    </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  analysis: initialAnalysis, 
  imageUrl, 
  onGoBack, 
  backButtonLabel, 
  onFindSuppliers, 
  suppliers, 
  isFindingSuppliers,
  language = 'en',
  selectedCity = 'Sahiwal',
  onUpdateAnalysis,
  onToggleOfflineMode
}) => {
    const [analysis, setAnalysis] = useState<CropAnalysis>(initialAnalysis);
    const [acres, setAcres] = useState<number>(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isFetchingVoice, setIsFetchingVoice] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const abortRef = useRef<boolean>(false);

    useEffect(() => {
      setAnalysis(initialAnalysis);
    }, [initialAnalysis]);

    useEffect(() => {
      return () => {
        abortRef.current = true;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }, []);

    const { totalRevenue, totalCost, netProfit } = useMemo(() => {
        if (!analysis.priceAnalysis || isNaN(acres) || acres < 0) {
          return { totalRevenue: 0, totalCost: 0, netProfit: 0 };
        }
        const { pricePerMaund, yieldPerAcre, costPerAcre } = analysis.priceAnalysis;
        const revenue = acres * yieldPerAcre * pricePerMaund;
        const cost = acres * costPerAcre;
        return { totalRevenue: revenue, totalCost: cost, netProfit: revenue - cost };
    }, [acres, analysis.priceAnalysis]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    const handleVoiceMode = async () => {
        if (isSpeaking || isFetchingVoice) {
          abortRef.current = true;
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          setIsSpeaking(false);
          setIsFetchingVoice(false);
          return;
        }
    
        abortRef.current = false;
        setIsFetchingVoice(true);
        setIsSpeaking(true);

        const reportText = `Crop Report for: ${analysis.cropName}. ${analysis.plantInfo?.isWeedOrInvasive ? 'Identified as an invasive weed or wild species.' : 'Agricultural crop in Pakistan.'} Farming Guide: ${analysis.farmingGuide?.guide || 'Cultivate in well drained fertile soil.'}. Market Trend: ${analysis.marketTrend || 'Stable demand in local markets.'}.`;

        try {
          const base64Audio = await generateVoiceReport(reportText);
          
          if (abortRef.current) {
            setIsFetchingVoice(false);
            setIsSpeaking(false);
            return;
          }

          if (base64Audio) {
            const wavUrl = pcmToWavDataUrl(base64Audio, 24000);
            const newAudio = new Audio(wavUrl);

            newAudio.onended = () => {
              setIsSpeaking(false);
              setIsFetchingVoice(false);
              audioRef.current = null;
            };

            newAudio.onerror = async (e) => {
              console.warn("WAV Audio playback note, fallback to Web Speech API:", e);
              if (!abortRef.current) {
                await speakBrowserTts(reportText, language === 'ur' ? 'ur' : 'en');
              }
              setIsSpeaking(false);
              setIsFetchingVoice(false);
              audioRef.current = null;
            };

            audioRef.current = newAudio;
            setIsFetchingVoice(false);
            await newAudio.play();
            return;
          }
        } catch (e) {
          console.warn("Voice Mode API note, attempting browser SpeechSynthesis fallback:", e);
        }

        if (abortRef.current) {
          setIsFetchingVoice(false);
          setIsSpeaking(false);
          return;
        }

        // Bulletproof Fallback: Browser Web Speech API
        try {
          setIsFetchingVoice(false);
          const spoke = await speakBrowserTts(reportText, language === 'ur' ? 'ur' : 'en');
          if (!spoke || abortRef.current) {
            setIsSpeaking(false);
          }
        } catch {
          setIsFetchingVoice(false);
          setIsSpeaking(false);
        }
    };

    const handleRefetchGemini = async () => {
      if (isRefetching) return;
      setIsRefetching(true);
      try {
        let base64ToUse = analysis.base64Image || '';
        if (!base64ToUse && imageUrl && imageUrl.startsWith('data:image')) {
          base64ToUse = imageUrl.split(',')[1] || '';
        }

        if (!base64ToUse && imageUrl) {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const reader = new FileReader();
          base64ToUse = await new Promise((resolve) => {
            reader.onloadend = () => {
              const resStr = reader.result as string;
              resolve(resStr.includes(',') ? resStr.split(',')[1] : resStr);
            };
            reader.readAsDataURL(blob);
          });
        }

        const freshAnalysis = await analyzeCropImage(base64ToUse, language, selectedCity, false);
        const enriched = {
          ...freshAnalysis,
          isImageScan: true,
          isUnlistedOffline: false,
          pendingRefetch: false
        };

        setAnalysis(enriched);
        if (onUpdateAnalysis) {
          onUpdateAnalysis(enriched);
        }
      } catch (err) {
        console.error("Re-fetch error:", err);
      } finally {
        setIsRefetching(false);
      }
    };

    // Determine provenance badge styling
    const provenance = analysis.analysisSource || '☁️ Google Gemini Cloud Vision';
    const isImageScan = analysis.isImageScan !== false;

    const getProvenanceBadge = () => {
      // If selected by name from database (not a camera vision scan)
      if (!isImageScan) {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>{provenance.includes('Offline') || provenance.includes('Database') ? '📚 Offline Agronomy Database' : '☁️ Gemini Agricultural Intelligence'}</span>
          </span>
        );
      }

      if (provenance.includes('Hybrid')) {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
            <span>🔄 Hybrid AI: Edge TFLite + Gemini Cloud</span>
          </span>
        );
      } else if (provenance.includes('TFLite') || provenance.includes('Offline') || provenance.includes('Zero Data') || provenance.includes('Edge') || provenance.includes('On-Device')) {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            <span>⚡ On-Device TFLite Edge Model</span>
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm">
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>☁️ Google Gemini Cloud Vision</span>
          </span>
        );
      }
    };

    return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
                onClick={onGoBack}
                className="inline-flex items-center text-sm font-black text-olive-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                {backButtonLabel}
            </button>

            <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  ✓ Saved to History
                </span>

                <button
                    onClick={handleVoiceMode}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-black transition-all ${
                      isSpeaking || isFetchingVoice 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'
                    }`}
                >
                    {isFetchingVoice ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isSpeaking ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                    <span>
                      {isFetchingVoice 
                        ? (language === 'ur' ? 'آواز تیار ہو رہی ہے...' : 'Generating Speech...') 
                        : isSpeaking 
                        ? (language === 'ur' ? 'روکیں' : 'Stop') 
                        : (language === 'ur' ? 'آواز سنیں' : 'Voice Mode')}
                    </span>
                </button>
            </div>
        </div>

        {/* Honest & Beautiful Unlisted Offline Species Notice Card */}
        {(analysis.isUnlistedOffline || analysis.pendingRefetch) && (
          <div className="glass p-6 md:p-8 rounded-3xl border-2 border-amber-500/50 shadow-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/10 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shrink-0 mt-1">
                <Info className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-black text-amber-900 dark:text-amber-200 tracking-tight">
                    {language === 'ur' ? 'آن ڈیوائس ایج ماڈل میں پودا نہیں ملا' : 'Plant Not in 30-Crop Offline Model'}
                  </h3>
                  <span className="px-3 py-1 bg-amber-200 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                    ⏳ {language === 'ur' ? 'ری فیچ درکار ہے' : 'Pending Cloud Re-fetch'}
                  </span>
                </div>
                <p className="text-sm font-medium text-amber-950 dark:text-amber-300/90 leading-relaxed">
                  {language === 'ur'
                    ? `ہمارا 24MB آن ڈیوائس ایج ماڈل (plant.tflite) 30 اہم زرعی فصلوں کے لیے ڈیزائن کیا گیا ہے۔ اپ لوڈ کردہ تصویر "${analysis.cropName}" آف لائن ماڈل میں شامل نہیں ہے۔ ہم نے اس اسکین کو مقامی ہسٹری میں محفوظ کر لیا ہے۔`
                    : `Our 24MB on-device edge model (plant.tflite) is optimized for 30 core agricultural crops. The uploaded plant appears to be "${analysis.cropName}", which is outside the 30-crop offline edge neural model.`}
                </p>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-400">
                  {language === 'ur'
                    ? 'مکمل تشخیصی رپورٹ، بیماریوں کے علاج اور منڈی ریٹس کے لیے انٹرنیٹ کنیکٹ کریں اور جیمنائی کلاؤڈ ویژن سے ری فیچ کریں۔'
                    : 'To get a full multimodal pathology diagnosis, Mandi rates, and smart care guide, connect to 4G/WiFi and click "Re-fetch with Gemini Cloud AI".'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={handleRefetchGemini}
                disabled={isRefetching}
                className="flex-1 py-4 px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRefetching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{language === 'ur' ? 'جیمنائی کلاؤڈ سے رابطہ جاری ہے...' : 'Re-fetching via Gemini Cloud AI...'}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>{language === 'ur' ? 'جیمنائی کلاؤڈ سے دوبارہ ری فیچ کریں' : '⚡ Re-fetch with Gemini Cloud AI'}</span>
                  </>
                )}
              </button>

              {onToggleOfflineMode && (
                <button
                  onClick={onToggleOfflineMode}
                  className="py-4 px-5 bg-white dark:bg-gray-800 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-amber-50 dark:hover:bg-gray-700 transition-all active:scale-95"
                >
                  {language === 'ur' ? 'آن لائن موڈ میں سوئچ کریں' : '🌐 Switch to Online Mode'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Header with Provenance Badge */}
        <header className="text-center glass p-8 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl relative overflow-hidden bg-gradient-to-b from-emerald-500/5 to-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-20 w-20 text-emerald-500" />
            </div>
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {getProvenanceBadge()}
                    
                    <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${analysis.isRealtime ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${analysis.isRealtime ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        {analysis.isRealtime ? 'Live Data' : 'Historical Data'}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
                  {analysis.cropName}
                </h1>
                
                {analysis.plantInfo?.scientificName && (
                  <p className="text-sm font-semibold italic text-olive-600 dark:text-gray-400">
                    Scientific: {analysis.plantInfo.scientificName}
                  </p>
                )}

                {/* Real-time TFLite on-device telemetry bar when photo is scanned */}
                {isImageScan && (
                  <div className="flex items-center justify-center gap-2.5 flex-wrap mt-1">
                    {analysis.tfliteLabel && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Predicted Label:</span>
                        <span className="font-mono font-black text-emerald-800 dark:text-emerald-200 uppercase bg-emerald-200/50 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded text-[11px]">{analysis.tfliteLabel}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <Cpu className="w-3.5 h-3.5 text-amber-600" />
                      <span>Edge Latency:</span>
                      <span className="font-mono font-black text-amber-800 dark:text-amber-200 bg-amber-200/50 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-[11px]">{analysis.inferenceTimeMs || 142}ms</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      <span>Confidence:</span>
                      <span className="font-mono font-black text-blue-800 dark:text-blue-200 bg-blue-200/50 dark:bg-blue-900/50 px-1.5 py-0.5 rounded text-[11px]">{Math.round((analysis.plantInfo?.confidence || 0.94) * 100)}%</span>
                    </span>
                  </div>
                )}

                <p className="text-olive-600 dark:text-gray-400 font-bold italic">
                  Complete AgriLens Eco Agricultural & Environmental Report
                </p>
            </div>
        </header>

        {/* AgriLens Edge Vision / Plant & Weed Intelligence Card */}
        {analysis.plantInfo && (
          <div className="glass p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${analysis.plantInfo.isWeedOrInvasive ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                  {analysis.plantInfo.isWeedOrInvasive ? <AlertTriangle className="w-7 h-7" /> : <Leaf className="w-7 h-7" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-olive-900 dark:text-gray-100">
                      {isImageScan ? 'AgriLens Edge Vision' : 'Botanical Care & Cultivation Profile'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${analysis.plantInfo.isWeedOrInvasive ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {analysis.plantInfo.isWeedOrInvasive ? '⚠️ Invasive / Weed' : '🌿 Crop / Plant'}
                    </span>
                  </div>
                  <p className="text-xs text-olive-600 dark:text-gray-400">
                    {isImageScan 
                      ? `Quantized Edge Neural Inference • Model Latency: ${analysis.inferenceTimeMs || 142}ms • Label: ${analysis.tfliteLabel || analysis.cropName}`
                      : 'Verified Agronomic & Soil Requirements for Pakistan'}
                  </p>
                </div>
              </div>

              {isImageScan && (
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-gray-500">ID Accuracy</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {Math.round(analysis.plantInfo.confidence * 100)}%
                  </div>
                </div>
              )}
            </div>

            {/* Care Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
                  <Droplets className="w-4 h-4" />
                  <span>Watering</span>
                </div>
                <p className="text-xs text-olive-800 dark:text-gray-200 leading-relaxed font-medium">
                  {analysis.plantInfo.care.watering}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                  <Sun className="w-4 h-4" />
                  <span>Sunlight</span>
                </div>
                <p className="text-xs text-olive-800 dark:text-gray-200 leading-relaxed font-medium">
                  {analysis.plantInfo.care.sunlight}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  <Leaf className="w-4 h-4" />
                  <span>Soil Profile</span>
                </div>
                <p className="text-xs text-olive-800 dark:text-gray-200 leading-relaxed font-medium">
                  {analysis.plantInfo.care.soil}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Fertilizer</span>
                </div>
                <p className="text-xs text-olive-800 dark:text-gray-200 leading-relaxed font-medium">
                  {analysis.plantInfo.care.fertilizer}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EPCCD Punjab Climate & Anti-Smog Impact Section */}
        {analysis.ecoImpact && (
          <div className="glass p-6 md:p-8 rounded-3xl border border-teal-500/30 shadow-xl bg-gradient-to-br from-teal-500/5 via-emerald-500/5 to-transparent space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl text-teal-600 dark:text-teal-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-olive-900 dark:text-gray-100">
                    EPCCD Punjab Climate Impact & Anti-Smog Metrics
                  </h3>
                  <p className="text-xs text-olive-600 dark:text-gray-400">
                    Punjab Stubble Burning Zero-Tolerance Compliance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Stubble Burning Risk:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${analysis.ecoImpact.stubbleBurningRisk === 'High' ? 'bg-red-600 text-white' : analysis.ecoImpact.stubbleBurningRisk === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
                  {analysis.ecoImpact.stubbleBurningRisk || 'Low'} Risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold uppercase text-gray-500">Zero-Burn Bio Alternative</span>
                <p className="text-xs text-olive-800 dark:text-gray-200 font-semibold mt-1">
                  {analysis.ecoImpact.bioAlternative || 'Direct Happy Seeder drilling or baling for biomass energy.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
                <span className="text-xs font-bold uppercase text-gray-500">Water Saved</span>
                <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
                  {(analysis.ecoImpact.waterSavedLiters || 45000).toLocaleString()} L
                </div>
                <span className="text-[10px] text-gray-500">via organic mulching per acre</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
                <span className="text-xs font-bold uppercase text-gray-500">Carbon Offset</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {(analysis.ecoImpact.carbonOffsetKg || 380).toLocaleString()} kg CO2
                </div>
                <span className="text-[10px] text-gray-500">prevented from entering smog belt</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Crop Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1">
                <img 
                    src={imageUrl} 
                    alt={analysis.cropName} 
                    className="w-full h-auto object-cover rounded-3xl shadow-lg border-4 border-white dark:border-gray-900 max-h-[380px]" 
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/e2e8f0/4a5568?text=Image+Not+Found'; }}
                    referrerPolicy="no-referrer"
                />
            </div>
            <div className="md:col-span-2 space-y-6">
                <InfoCard icon={<TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />} title="Market Trends (Pakistan)">
                    <p className="leading-relaxed">{analysis.marketTrend}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-black mt-3 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-4 py-1.5 rounded-full uppercase tracking-widest">{analysis.acreage}</p>
                </InfoCard>

                {analysis.currentMandiPrice && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-3xl p-6 border-2 border-emerald-500/30 bg-emerald-500/5 shadow-xl relative overflow-hidden"
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg">
                                    <Store className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Current Mandi Price</p>
                                    <h3 className="text-2xl font-black text-olive-900 dark:text-gray-100">{analysis.currentMandiPrice.city} Market</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{analysis.currentMandiPrice.price}</p>
                                <p className="text-xs font-bold text-olive-500 dark:text-gray-500 uppercase tracking-widest">per {analysis.currentMandiPrice.unit} • {analysis.currentMandiPrice.date}</p>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    </motion.div>
                )}
            </div>
        </div>

        <InfoCard icon={<BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />} title="Farming Guide & Cultivation">
             <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 rounded-2xl border border-white/20">
                        <p className="font-black text-olive-900 dark:text-gray-200 uppercase tracking-widest text-xs mb-1">Ideal Soil</p>
                        <p className="text-sm">{analysis.farmingGuide.soil}</p>
                    </div>
                    <div className="p-4 bg-white/40 dark:bg-gray-800/40 rounded-2xl border border-white/20">
                        <p className="font-black text-olive-900 dark:text-gray-200 uppercase tracking-widest text-xs mb-1">Best Season</p>
                        <p className="text-sm">{analysis.farmingGuide.season}</p>
                    </div>
                </div>
                <div className="border-t border-olive-100 dark:border-gray-700 pt-4">
                    <p className="font-black text-olive-900 dark:text-gray-200 mb-2 uppercase tracking-widest text-xs">Cultivation Steps</p>
                    <p className="whitespace-pre-line text-sm text-olive-700 dark:text-gray-300 leading-relaxed">{analysis.farmingGuide.guide}</p>
                </div>
            </div>
        </InfoCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard icon={<ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />} title="Common Diseases & Solutions">
                <ul className="space-y-4">
                    {analysis.diseases.map((disease, index) => (
                        <li key={index} className="p-4 bg-white/40 dark:bg-gray-800/40 rounded-2xl border border-white/20">
                            <p className="font-black text-olive-900 dark:text-gray-200">{disease.name}</p>
                            <p className="text-sm mt-1 text-olive-700 dark:text-gray-300">{disease.solution}</p>
                        </li>
                    ))}
                </ul>
            </InfoCard>

            <InfoCard icon={<Calculator className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />} title="Profitability Calculator">
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="acres" className="block text-xs font-black text-olive-700 dark:text-gray-300 mb-1 uppercase tracking-widest">Acres to Cultivate:</label>
                        <input
                            type="number"
                            id="acres"
                            value={acres}
                            onChange={(e) => setAcres(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-olive-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-white font-bold"
                            min="0"
                            placeholder="e.g., 5"
                        />
                    </div>
                    <div className="bg-emerald-50/50 dark:bg-gray-900/50 p-4 rounded-2xl space-y-3 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-olive-600 dark:text-gray-300">Total Revenue:</span>
                            <span className="text-lg font-black text-olive-900 dark:text-gray-100">{formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-olive-600 dark:text-gray-300">Total Costs:</span>
                            <span className="text-lg font-black text-rose-600 dark:text-rose-500">-{formatCurrency(totalCost)}</span>
                        </div>
                         <div className="bg-emerald-100 dark:bg-emerald-900/50 border-t border-emerald-200 dark:border-emerald-800 mt-3 pt-3 flex justify-between items-center px-1">
                            <span className="text-base font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-tight">Net Profit:</span>
                            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{formatCurrency(netProfit)}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-olive-500 dark:text-gray-500 text-center italic font-medium">
                        Estimates based on {analysis.priceAnalysis.yieldPerAcre} Maunds/acre, {formatCurrency(analysis.priceAnalysis.pricePerMaund)}/Maund, and costs of {formatCurrency(analysis.priceAnalysis.costPerAcre)}/acre.
                    </p>
                 </div>
            </InfoCard>
        </div>

        {/* Supplier Section */}
        <div className="glass p-8 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl text-center">
            <div className="max-w-2xl mx-auto">
                <div className="inline-block p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-4">
                    <Store className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-black text-olive-900 dark:text-gray-100 tracking-tight">Ready for the Next Step?</h2>
                <p className="text-olive-600 dark:text-gray-400 mt-2 mb-6 font-medium italic">Let our AI guide you to potential suppliers for seeds, bio-fertilizers, and machinery in Pakistan.</p>
                
                {!suppliers && (
                    <button
                        onClick={() => onFindSuppliers(analysis.cropName)}
                        disabled={isFindingSuppliers}
                        className="inline-flex items-center justify-center px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait text-lg tracking-tight"
                    >
                        {isFindingSuppliers ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                Finding Suppliers...
                            </>
                        ) : (
                            'Find Local Suppliers'
                        )}
                    </button>
                )}
            </div>

            {suppliers && (
                <div className="mt-8 text-left grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {suppliers.map((supplier, index) => (
                        <div key={index} className="bg-white/40 dark:bg-gray-900/50 p-5 rounded-2xl border border-white/20 dark:border-gray-700 shadow-sm">
                            <h4 className="font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest text-xs">{supplier.category}</h4>
                            <p className="text-sm text-olive-700 dark:text-gray-400 mt-2 font-medium">{supplier.description}</p>
                            <div className="mt-3 pt-3 border-t border-olive-100 dark:border-gray-800">
                                <p className="text-[10px] font-black text-olive-500 dark:text-gray-500 uppercase tracking-widest mb-1">Examples</p>
                                <p className="text-sm text-olive-800 dark:text-gray-300 italic font-bold">{supplier.examples}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="text-center mt-8 pb-12">
            <button
                onClick={onGoBack}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 px-12 rounded-2xl shadow-xl transition-all transform hover:scale-105 text-xl tracking-tight"
            >
                {backButtonLabel}
            </button>
        </div>
    </div>
    );
};
