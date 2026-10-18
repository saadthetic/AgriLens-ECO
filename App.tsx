import React, { useState, useCallback, useEffect } from 'react';
import type { HistoryItem, CropAnalysis, Collection } from './types';
import { Header } from './components/Header';
import { BottomNav, type ActiveTab } from './components/BottomNav';
import { AnalyzeView } from './components/AnalyzeView';
import { HistoryView } from './components/HistoryView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CameraView } from './components/CameraView';
import { SettingsView } from './components/SettingsView';
import { MandiRates } from './components/MandiRates';
import { WeatherAdvice } from './components/WeatherAdvice';
import { UtilitiesView } from './components/UtilitiesView';
import { GovSchemes } from './components/GovSchemes';
import { SideDrawer } from './components/SideDrawer';
import { SmogAdvisor } from './components/SmogAdvisor';
import { SystemStatusView } from './components/SystemStatusView';
import { syncScanToFirestore } from './services/firebaseService';
import { stopAllVoiceSynthesis } from './services/geminiService';

const HISTORY_KEY = 'agroMartHistory';
const THEME_KEY = 'agroMartTheme';
const COLLECTIONS_KEY = 'agroMartCollections';
const CITY_KEY = 'agroMartCity';

interface AppMetadata {
  name: string;
}

interface NavState {
  tab: ActiveTab;
  subTab?: string;
}

const App: React.FC = () => {
  const [_metadata, setMetadata] = useState<AppMetadata>({ name: 'AgriLens Eco' });
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyze');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [selectedCity, setSelectedCity] = useState<string>('Sahiwal');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [navStack, setNavStack] = useState<NavState[]>([{ tab: 'analyze' }]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Wi-Fi Connectivity & Offline Simulation State
  const [isManualOffline, setIsManualOffline] = useState<boolean>(() => {
    try {
      return localStorage.getItem('agriLens_manual_offline') === 'true';
    } catch {
      return false;
    }
  });
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isEffectiveOffline = !isBrowserOnline || isManualOffline;

  const handleToggleOffline = () => {
    setIsManualOffline(prev => {
      const next = !prev;
      try {
        localStorage.setItem('agriLens_manual_offline', String(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
        setActiveSubTab(event.state.subTab);
        
        setNavStack(prev => {
          const newStack = [...prev];
          newStack.pop();
          return newStack;
        });
      } else if (showWelcome === false) {
        setShowWelcome(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showWelcome]);

  // Scroll to top and cancel speech synthesis whenever active tab, subtab or welcome screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    stopAllVoiceSynthesis();
  }, [activeTab, activeSubTab, showWelcome]);

  const handleSetActiveTab = (tab: ActiveTab, subTab?: string) => {
    if (tab !== activeTab || subTab !== activeSubTab) {
      const newState: NavState = { tab, subTab };
      setNavStack(prev => [...prev, newState]);
      window.history.pushState(newState, '', '');
      setActiveTab(tab);
      setActiveSubTab(subTab);
    }
  };

  const handleBack = () => {
    if (navStack.length > 1) {
      window.history.back();
    } else if (!showWelcome) {
      setShowWelcome(true);
    }
  };

  useEffect(() => {
    // Load metadata
    fetch('/metadata.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMetadata(data))
      .catch(error => console.error("Could not load metadata.json:", error));

    // Load history from localStorage
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Could not load history from localStorage:", e);
      setHistory([]);
    }

    // Load collections from localStorage
    try {
      const storedCollections = localStorage.getItem(COLLECTIONS_KEY);
      if (storedCollections) {
        setCollections(JSON.parse(storedCollections));
      }
    } catch (e) {
      console.error("Could not load collections from localStorage:", e);
      setCollections([]);
    }

    // Load theme from localStorage - Default to light
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    // Load city from localStorage
    const savedCity = localStorage.getItem(CITY_KEY);
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  const handleGoHome = () => {
    setShowWelcome(true);
    setActiveTab('analyze');
    setActiveSubTab(undefined);
    setNavStack([{ tab: 'analyze' }]);
  };

  const handleSaveHistory = (newHistory: HistoryItem[]) => {
    try {
        setHistory(newHistory);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
        console.error("Could not save history to localStorage:", e);
    }
  };

  const handleSaveCollections = (newCollections: Collection[]) => {
    try {
        setCollections(newCollections);
        localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(newCollections));
    } catch (e) {
        console.error("Could not save collections to localStorage:", e);
    }
  };

  const handleAddToHistory = useCallback((analysis: CropAnalysis, imageUrl: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      analysis,
      imageUrl,
      isFirestoreSynced: true
    };
    
    // Automatically sync to Cloud Firestore in background
    syncScanToFirestore(newItem).then(synced => {
      newItem.isFirestoreSynced = synced;
    }).catch(err => {
      console.warn("Firestore sync background notice:", err);
    });

    const newHistory = [newItem, ...history];
    handleSaveHistory(newHistory);
    setActiveTab('analyze');
  }, [history]);

  const handleCameraCapture = (base64Image: string) => {
    handleSetActiveTab('analyze');
    setCapturedImage(`data:image/jpeg;base64,${base64Image}`);
  };

  const handleDeleteFromHistory = useCallback((id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    handleSaveHistory(updatedHistory);
  }, [history]);

  const handleAddCollection = (name: string) => {
    const newCol: Collection = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    };
    handleSaveCollections([...collections, newCol]);
  };

  const handleDeleteCollection = (id: string) => {
    handleSaveCollections(collections.filter(c => c.id !== id));
    const updatedHistory = history.map(item => 
      item.collectionId === id ? { ...item, collectionId: undefined } : item
    );
    handleSaveHistory(updatedHistory);
  };

  const handleSetSelectedCity = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem(CITY_KEY, city);
  };

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onStart={(initialTab?: ActiveTab) => {
          setShowWelcome(false);
          if (initialTab) {
            handleSetActiveTab(initialTab);
          } else {
            window.history.pushState({ tab: 'analyze' }, '', '');
          }
        }} 
        language={language}
        setLanguage={setLanguage}
        selectedCity={selectedCity}
        setSelectedCity={handleSetSelectedCity}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isOffline={isEffectiveOffline}
        onToggleOffline={handleToggleOffline}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''} ${activeTab === 'scan' ? 'bg-transparent' : ''}`} style={{ backgroundColor: activeTab === 'scan' ? 'transparent' : 'var(--bg-main)', color: 'var(--text-main)' }}>
      {activeTab !== 'scan' && (
        <Header 
          onGoHome={handleGoHome} 
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenSmog={() => handleSetActiveTab('smog')}
          onOpenStatus={() => handleSetActiveTab('status')}
          isOffline={isEffectiveOffline}
          onToggleOffline={handleToggleOffline}
        />
      )}
      
      <SideDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleSetActiveTab}
        language={language}
        setLanguage={setLanguage}
        onLogout={() => setShowWelcome(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        selectedCity={selectedCity}
        setSelectedCity={handleSetSelectedCity}
        collections={collections}
        onAddCollection={handleAddCollection}
        onDeleteCollection={handleDeleteCollection}
      />

      <main className={`flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center pb-24 ${activeTab === 'scan' ? 'bg-transparent' : ''}`}>
        <div className={`w-full max-w-4xl ${activeTab === 'scan' ? 'bg-transparent' : ''}`}>
          {activeTab === 'analyze' && (
            <AnalyzeView 
              onAnalysisComplete={handleAddToHistory} 
              externalImage={capturedImage}
              onClearExternalImage={() => setCapturedImage(null)}
              language={language}
              selectedCity={selectedCity}
              onNavigateToSmog={() => handleSetActiveTab('smog')}
              isOfflineMode={isEffectiveOffline}
            />
          )}
          {activeTab === 'scan' && (
            <CameraView 
              onCapture={handleCameraCapture} 
              onClose={() => handleBack()} 
            />
          )}
          {activeTab === 'smog' && (
            <SmogAdvisor 
              selectedCity={selectedCity}
              language={language}
              onCityChange={handleSetSelectedCity}
            />
          )}
          {activeTab === 'history' && (
            <HistoryView 
              history={history} 
              onDelete={handleDeleteFromHistory} 
              collections={collections}
              onUpdateItem={(updatedItem) => {
                const newHistory = history.map(item => item.id === updatedItem.id ? updatedItem : item);
                handleSaveHistory(newHistory);
              }}
            />
          )}
          {activeTab === 'mandi' && (
            <MandiRates selectedCity={selectedCity} language={language} />
          )}
          {activeTab === 'weather' && (
            <WeatherAdvice selectedCity={selectedCity} language={language} />
          )}
          {activeTab === 'utilities' && (
            <UtilitiesView 
              language={language} 
              setActiveTab={handleSetActiveTab} 
              activeSubTab={activeSubTab}
              setActiveSubTab={(sub) => handleSetActiveTab('utilities', sub)}
            />
          )}
          {activeTab === 'schemes' && (
            <GovSchemes language={language} />
          )}
          {activeTab === 'settings' && (
            <SettingsView 
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              language={language}
              setLanguage={setLanguage}
              collections={collections}
              onAddCollection={handleAddCollection}
              onDeleteCollection={handleDeleteCollection}
              selectedCity={selectedCity}
              setSelectedCity={handleSetSelectedCity}
            />
          )}
          {activeTab === 'status' && (
            <SystemStatusView 
              language={language}
              selectedCity={selectedCity}
              isOfflineMode={isEffectiveOffline}
              onBack={() => handleSetActiveTab('analyze')}
              onNavigateToTab={(tab) => handleSetActiveTab(tab as ActiveTab)}
            />
          )}
        </div>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      {activeTab !== 'scan' && (
        <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium tracking-wide">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <p className="inline-flex items-center justify-center flex-wrap gap-1">
              <span>© 2026 Agri<span className="text-emerald-600 dark:text-emerald-500 font-bold">Lens</span></span>
              <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider relative -top-1.5 select-none shadow-xs">
                ECO
              </span>
              <span className="ml-1">• SUSTAINABLE AGRITECH & CLIMATE RESILIENCE</span>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
