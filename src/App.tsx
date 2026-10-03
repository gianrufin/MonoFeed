import { useState, useEffect, useMemo, useCallback } from 'react';
import { PHILIPPINES_FACTS } from './data/philippinesFacts';
import { Fact, FactCategory, ThemeMode, FontSize } from './types';
import { getDailyFact } from './utils/dateUtils';
import { useSavedFacts } from './hooks/useSavedFacts';
import { usePWAInstall } from './hooks/usePWAInstall';
import { getStoredNotificationPrefs } from './utils/notifications';
import { Header } from './components/Header';
import { DailyCard } from './components/DailyCard';
import { CategoryFilter } from './components/CategoryFilter';
import { MobileThumbBar } from './components/MobileThumbBar';
import { MobileMenuSheet } from './components/MobileMenuSheet';
import { SavedFactsDrawer } from './components/SavedFactsDrawer';
import { ShareModal } from './components/ShareModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { Download, X } from 'lucide-react';

export default function App() {
  // Theme and accessibility state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monofeed_theme');
      if (stored === 'light' || stored === 'dark' || stored === 'oled') return stored;
    }
    return 'dark';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monofeed_fontsize');
      if (stored === 'normal' || stored === 'large' || stored === 'extralarge') return stored;
    }
    return 'normal';
  });

  // Modal / Sheet visibility states
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [dismissInstallBanner, setDismissInstallBanner] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('monofeed_dismiss_install') === 'true';
    }
    return false;
  });

  // Text-to-speech reading state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // PWA install hook
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return getStoredNotificationPrefs().enabled;
  });

  // Saved facts hook (fully offline functional)
  const { 
    savedFacts, 
    isSaved, 
    toggleSave, 
    removeSave, 
    clearAllSaved, 
    savedCount 
  } = useSavedFacts();

  // Active category filter
  const [activeCategory, setActiveCategory] = useState<FactCategory | 'All'>('All');

  // Categories list
  const categories: FactCategory[] = useMemo(() => {
    const set = new Set<FactCategory>();
    PHILIPPINES_FACTS.forEach((f) => set.add(f.category));
    return Array.from(set);
  }, []);

  // Filtered facts pool
  const filteredFacts = useMemo(() => {
    if (activeCategory === 'All') return PHILIPPINES_FACTS;
    return PHILIPPINES_FACTS.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

  // Today's fact determined deterministically
  const todayFact = useMemo(() => getDailyFact(), []);

  // Current selected fact index in filtered list
  const [currentIndex, setCurrentIndex] = useState(() => {
    const today = getDailyFact();
    const idx = PHILIPPINES_FACTS.findIndex((f) => f.id === today.id);
    return idx >= 0 ? idx : 0;
  });

  // Keep index within bounds when category filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const currentFact: Fact = filteredFacts[currentIndex] || todayFact;
  const isViewingToday = currentFact.id === todayFact.id;

  // Sync theme changes to body
  useEffect(() => {
    try {
      localStorage.setItem('monofeed_theme', theme);
    } catch {}

    const body = document.body;
    body.classList.remove('bg-zinc-950', 'bg-black', 'bg-white', 'text-zinc-100', 'text-zinc-900');
    if (theme === 'light') {
      body.classList.add('bg-white', 'text-zinc-900');
    } else if (theme === 'oled') {
      body.classList.add('bg-black', 'text-zinc-100');
    } else {
      body.classList.add('bg-zinc-950', 'text-zinc-100');
    }
  }, [theme]);

  // Sync font size changes
  useEffect(() => {
    try {
      localStorage.setItem('monofeed_fontsize', fontSize);
    } catch {}
  }, [fontSize]);

  // Navigation handlers (smooth 1-hand reach)
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredFacts.length);
  }, [filteredFacts.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredFacts.length) % filteredFacts.length);
  }, [filteredFacts.length]);

  const handleToday = useCallback(() => {
    setActiveCategory('All');
    const idx = PHILIPPINES_FACTS.findIndex((f) => f.id === todayFact.id);
    setCurrentIndex(idx >= 0 ? idx : 0);
  }, [todayFact.id]);

  const handleRandom = useCallback(() => {
    const rand = Math.floor(Math.random() * filteredFacts.length);
    setCurrentIndex(rand);
  }, [filteredFacts.length]);

  const handleSelectFromSaved = useCallback((fact: Fact) => {
    setActiveCategory('All');
    const idx = PHILIPPINES_FACTS.findIndex((f) => f.id === fact.id);
    if (idx >= 0) setCurrentIndex(idx);
  }, []);

  // Text-to-speech audio reader
  const handleToggleSpeech = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${currentFact.title}. ${currentFact.summary}. ${currentFact.body}. Primary source: ${currentFact.primarySource}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSpeaking, currentFact]);

  // Cancel speech synthesis on fact change
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentFact.id]);

  // Keyboard navigation for desktop or tablets
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleSave(currentFact.id);
      } else if (e.key === ' ' && !isSpeaking) {
        e.preventDefault();
        handleToggleSpeech();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, toggleSave, currentFact.id, handleToggleSpeech, isSpeaking]);

  const handleDismissBanner = () => {
    setDismissInstallBanner(true);
    try {
      localStorage.setItem('monofeed_dismiss_install', 'true');
    } catch {}
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-[100dvh] flex flex-col transition-colors ${
      theme === 'light' 
        ? 'bg-zinc-100 text-zinc-900' 
        : theme === 'oled' 
        ? 'bg-black text-zinc-100' 
        : 'bg-zinc-950 text-zinc-100'
    }`}>
      {/* Minimal Top Header */}
      <Header
        onRandom={handleRandom}
        onToday={handleToday}
        isToday={isViewingToday}
        theme={theme}
      />

      {/* Main Content Area - Optimized for 1-hand mobile thumb scrolling */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-3 pb-28 space-y-3.5">
        {/* PWA Floating Install Prompt for Mobile Users */}
        {canInstall && !isInstalled && !dismissInstallBanner && (
          <div 
            className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-100 flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top duration-300"
            role="status"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Download className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <div className="font-mono text-xs font-bold truncate">Install MonoFeed App</div>
                <div className="font-mono text-[10px] text-zinc-400">Offline PWA · 1-Tap Home Screen</div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={install}
                className="px-2.5 py-1 rounded-lg bg-white text-zinc-950 font-mono text-xs font-bold hover:bg-zinc-200 transition-colors"
              >
                Install
              </button>
              <button
                type="button"
                onClick={handleDismissBanner}
                className="p-1 text-zinc-500 hover:text-zinc-300"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Category Horizontal Filter - Scrollable with 1 thumb */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          isLight={isLight}
        />

        {/* The Daily Card - Swipeable, double-tap to save */}
        <DailyCard
          fact={currentFact}
          currentIndex={currentIndex}
          totalCount={filteredFacts.length}
          isToday={isViewingToday}
          isSaved={isSaved(currentFact.id)}
          onToggleSave={() => toggleSave(currentFact.id)}
          onNext={handleNext}
          onPrev={handlePrev}
          theme={theme}
          fontSize={fontSize}
        />
      </main>

      {/* Ergonomic 1-Handed Bottom Thumb Dock */}
      <MobileThumbBar
        currentIndex={currentIndex}
        totalCount={filteredFacts.length}
        isSaved={isSaved(currentFact.id)}
        onToggleSave={() => toggleSave(currentFact.id)}
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenShare={() => setShowShareModal(true)}
        onOpenMenu={() => setShowMenuSheet(true)}
        theme={theme}
        savedCount={savedCount}
      />

      {/* Unified Mobile Bottom Menu Sheet */}
      <MobileMenuSheet
        isOpen={showMenuSheet}
        onClose={() => setShowMenuSheet(false)}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        savedCount={savedCount}
        onOpenSavedDrawer={() => setShowSavedDrawer(true)}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        notificationsEnabled={notificationsEnabled}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        canInstallPWA={canInstall}
        isIOS={isIOS}
        isInstalledPWA={isInstalled}
        onInstallPWA={install}
      />

      {/* Offline Saved Facts Drawer */}
      <SavedFactsDrawer
        isOpen={showSavedDrawer}
        onClose={() => setShowSavedDrawer(false)}
        savedFacts={savedFacts}
        onSelectFact={handleSelectFromSaved}
        onRemoveFact={removeSave}
        onClearAll={clearAllSaved}
        theme={theme}
      />

      {/* Social Sharing Modal (Twitter & Instagram) */}
      <ShareModal
        fact={currentFact}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        theme={theme}
      />

      {/* Mobile Notification Alerts Modal */}
      <NotificationSettingsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        todayFact={todayFact}
        theme={theme}
        onPreferencesChange={setNotificationsEnabled}
      />
    </div>
  );
}
