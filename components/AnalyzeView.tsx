import React, { useState, useCallback, useEffect } from 'react';
import type { CropAnalysis, SupplierInfo } from '../types';
import { analyzeCropImage, analyzeCropByName, findSuppliers } from '../services/geminiService';
import { Home } from './Home';
import { AnalysisResult } from './AnalysisResult';
import { Loader } from './Loader';
import { ErrorDisplay } from './ErrorDisplay';
import { crops } from '../data/crops';

interface AnalyzeViewProps {
    onAnalysisComplete: (analysis: CropAnalysis, imageUrl: string) => void;
    externalImage?: string | null;
    onClearExternalImage?: () => void;
    language: 'en' | 'ur';
    selectedCity: string;
    onNavigateToSmog?: () => void;
    isOfflineMode?: boolean;
    onToggleOfflineMode?: () => void;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({ 
    onAnalysisComplete, 
    externalImage, 
    onClearExternalImage, 
    language, 
    selectedCity,
    isOfflineMode = false,
    onToggleOfflineMode
}) => {
    const [analysis, setAnalysis] = useState<CropAnalysis | null>(null);
    const [suppliers, setSuppliers] = useState<SupplierInfo[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingTitle, setLoadingTitle] = useState<string>("Analyzing Crop...");
    const [loadingSubtitle, setLoadingSubtitle] = useState<string>("Consulting AgriLens AI Intelligence");
    const [isFindingSuppliers, setIsFindingSuppliers] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pendingImage, setPendingImage] = useState<string | null>(null);

    const handleAnalysisError = (err: unknown) => {
        console.error("Analysis Error:", err);
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unexpected error occurred. Please check your connection and try again.");
        }
    };

    const startAnalysis = (title?: string, subtitle?: string) => {
        setIsLoading(true);
        if (title) setLoadingTitle(title);
        if (subtitle) setLoadingSubtitle(subtitle);
        setError(null);
        setAnalysis(null);
        setSuppliers(null);
    };

    const processBase64Image = useCallback(async (base64Data: string) => {
        startAnalysis(
            language === 'ur' ? "فصل اور پتوں کی صحت کا جائزہ لیا جا رہا ہے..." : "Scanning crop & leaf health...",
            isOfflineMode 
                ? (language === 'ur' ? "آن ڈیوائس پلانٹ ڈاکٹر سے معائنہ • بغیر انٹرنیٹ" : "Checking on-device plant doctor • Zero internet required")
                : (language === 'ur' ? "پودے کی صحت اور دیکھ بھال کے مفید زرعی مشورے تیار کیے جا رہے ہیں..." : "Examining plant vitality, soil guidance & smart care tips...")
        );
        setPreviewUrl(base64Data);
        try {
            const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
            const data = await analyzeCropImage(base64String, language, selectedCity, isOfflineMode);
            const enrichedData: CropAnalysis = {
                ...data,
                isImageScan: true
            };
            setAnalysis(enrichedData);
            onAnalysisComplete(enrichedData, base64Data);
        } catch (err) {
            handleAnalysisError(err);
        } finally {
            setIsLoading(false);
            setPendingImage(null);
            if (onClearExternalImage) onClearExternalImage();
        }
    }, [onAnalysisComplete, onClearExternalImage, language, selectedCity, isOfflineMode]);

    useEffect(() => {
        if (externalImage) {
            setPendingImage(externalImage);
            setPreviewUrl(externalImage);
        }
    }, [externalImage]);

    const handleConfirmAnalysis = () => {
        if (pendingImage) {
            processBase64Image(pendingImage);
        }
    };

    const handleCancelAnalysis = () => {
        setPendingImage(null);
        setPreviewUrl(null);
        if (onClearExternalImage) onClearExternalImage();
    };

    const handleImageAnalysis = useCallback(async (imageFile: File) => {
        startAnalysis(
            language === 'ur' ? "فصل اور پتوں کی صحت کا جائزہ لیا جا رہا ہے..." : "Scanning crop & leaf health...",
            isOfflineMode 
                ? (language === 'ur' ? "آن ڈیوائس پلانٹ ڈاکٹر سے معائنہ • بغیر انٹرنیٹ" : "Checking on-device plant doctor • Zero internet required")
                : (language === 'ur' ? "پودے کی صحت اور دیکھ بھال کے مفید زرعی مشورے تیار کیے جا رہے ہیں..." : "Examining plant vitality, soil guidance & smart care tips...")
        );
        const imageUrl = URL.createObjectURL(imageFile);
        setPreviewUrl(imageUrl);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = async () => {
                try {
                    const dataUrl = reader.result as string;
                    if (!dataUrl) {
                        throw new Error("Failed to read the image file.");
                    }
                    const base64String = dataUrl.split(',')[1];
                    if (!base64String) {
                        throw new Error("Failed to extract base64 from data url.");
                    }
                    const data = await analyzeCropImage(base64String, language, selectedCity, isOfflineMode, imageFile.name);
                    const enrichedData: CropAnalysis = {
                        ...data,
                        isImageScan: true
                    };
                    setAnalysis(enrichedData);
                    onAnalysisComplete(enrichedData, dataUrl);
                } catch (err) {
                    handleAnalysisError(err);
                } finally {
                    setIsLoading(false);
                }
            };
            reader.onerror = () => {
                setIsLoading(false);
                handleAnalysisError(new Error("Error reading file."));
            };
        } catch (err: unknown) {
            handleAnalysisError(err);
            setIsLoading(false);
        }
    }, [onAnalysisComplete, language, selectedCity, isOfflineMode]);

    const handleTextAnalysis = useCallback(async (cropName: string) => {
        if (isOfflineMode) {
            startAnalysis(
                language === 'ur' ? "مقامی زرعی ڈیٹابیس لوڈ ہو رہا ہے..." : "Loading local agronomy database...",
                language === 'ur' ? "تصدیق شدہ زرعی پروفائل اور منڈی ریٹس نکالے جا رہے ہیں..." : "Retrieving verified agronomic profile & mandi benchmarks..."
            );
        } else {
            startAnalysis(
                language === 'ur' ? "فصل کا تجزیہ کیا جا رہا ہے..." : "Analyzing Crop...",
                language === 'ur' ? "ایگری لینس زرعی انٹیلیجنس سے معلومات حاصل کی جا رہی ہیں..." : "Consulting AgriLens Agricultural Intelligence..."
            );
        }
        const selectedCrop = crops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
        const imageUrl = selectedCrop ? selectedCrop.image : 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800';
        setPreviewUrl(imageUrl);

        try {
            const data = await analyzeCropByName(cropName, language, selectedCity, isOfflineMode);
            const enrichedData: CropAnalysis = {
                ...data,
                isImageScan: false
            };
            setAnalysis(enrichedData);
            onAnalysisComplete(enrichedData, imageUrl);
        } catch (err: unknown) {
            handleAnalysisError(err);
        } finally {
            setIsLoading(false);
        }
    }, [onAnalysisComplete, language, selectedCity, isOfflineMode]);

    const handleFindSuppliers = useCallback(async (cropName: string) => {
        setIsFindingSuppliers(true);
        setError(null);
        try {
            const data = await findSuppliers(cropName, language);
            setSuppliers(data);
        } catch (err: unknown) {
            handleAnalysisError(err);
        } finally {
            setIsFindingSuppliers(false);
        }
    }, [language]);

    const handleReset = () => {
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
        setPreviewUrl(null);
        setSuppliers(null);
        setIsFindingSuppliers(false);
    };

    if (isLoading) {
        return <Loader title={loadingTitle} subtitle={loadingSubtitle} />;
    }
    if (error) {
        return <ErrorDisplay message={error} onClear={handleReset} />;
    }
    if (pendingImage && previewUrl) {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-olive-900 dark:text-gray-100">
                      {language === 'ur' ? 'تصویر کی تصدیق کریں' : 'Confirm Crop Photo'}
                    </h2>
                    <p className="text-olive-700 dark:text-gray-400 font-medium">
                      {isOfflineMode
                        ? (language === 'ur' ? 'آف لائن ایج ماڈل پر تجزیہ کیا جائے گا۔' : 'Will process with on-device edge neural model without internet.')
                        : (language === 'ur' ? 'اسمارٹ ہائبرڈ ایج ماڈل اور کلاؤڈ ویژن سے تجزیہ کیا جائے گا۔' : 'Will process via Smart Hybrid Edge Vision and Gemini Cloud Vision.')}
                    </p>
                </div>
                
                <div className="glass p-4 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden">
                    <img 
                        src={previewUrl} 
                        alt="Captured crop" 
                        className="w-full h-auto rounded-2xl object-cover max-h-[60vh]"
                        referrerPolicy="no-referrer"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleCancelAnalysis}
                        className="flex-1 py-4 px-6 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-all active:scale-95"
                    >
                        {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                    </button>
                    <button
                        onClick={handleConfirmAnalysis}
                        className="flex-2 py-4 px-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {language === 'ur' ? 'تجزیہ شروع کریں' : 'Start AI Analysis'}
                    </button>
                </div>
            </div>
        );
    }

    if (analysis && previewUrl) {
        return (
            <AnalysisResult
                analysis={analysis}
                imageUrl={previewUrl}
                onGoBack={handleReset}
                backButtonLabel={language === 'ur' ? "ایک اور فصل اسکین کریں" : "Scan Another Crop"}
                onFindSuppliers={handleFindSuppliers}
                suppliers={suppliers}
                isFindingSuppliers={isFindingSuppliers}
                language={language}
                selectedCity={selectedCity}
                onToggleOfflineMode={onToggleOfflineMode}
                onUpdateAnalysis={(updated) => {
                    setAnalysis(updated);
                    onAnalysisComplete(updated, previewUrl);
                }}
            />
        );
    }

    return (
        <Home
            onImageAnalyze={handleImageAnalysis}
            onTextAnalyze={handleTextAnalysis}
            isLoading={isLoading}
            isOfflineMode={isOfflineMode}
        />
    );
};