import React from 'react';
import { 
  X, 
  Download, 
  Bookmark, 
  Bell, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Monitor, 
  Type, 
  Smartphone, 
  CheckCircle2, 
  Share 
} from 'lucide-react';
import { ThemeMode, FontSize } from '../types';

interface MobileMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onOpenNotifications: () => void;
  notificationsEnabled: boolean;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  canInstallPWA: boolean;
  isIOS: boolean;
  isInstalledPWA: boolean;
  onInstallPWA: () => void;
}

export const MobileMenuSheet: React.FC<MobileMenuSheetProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  savedCount,
  onOpenSavedDrawer,
  onOpenNotifications,
  notificationsEnabled,
  isSpeaking,
  onToggleSpeech,
  canInstallPWA,
  isIOS,
  isInstalledPWA,
  onInstallPWA
}) => {
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-sheet-title"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-lg rounded-t-3xl border-t border-x p-5 pb-8 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl transition-transform animate-in slide-in-from-bottom duration-200 ${
          isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle for 1-hand feel */}
        <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto -mt-1 cursor-pointer" onClick={onClose} />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div>
            <h2 id="menu-sheet-title" className="font-mono text-sm font-bold uppercase tracking-wider">
              MonoFeed Controls
            </h2>
            <p className="text-[11px] font-mono text-zinc-500">
              Personalize reading, alerts & offline access
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PWA Install Banner */}
        {canInstallPWA && !isInstalledPWA && (
          <div className="p-4 rounded-2xl border border-zinc-700 bg-zinc-900/90 text-zinc-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wide">
                  Install MonoFeed as PWA
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">
                100% Offline
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Add to home screen for fullscreen standalone viewing, instant load times, and daily alerts.
            </p>

            {isIOS ? (
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
                <Share className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Tap Safari <strong>Share</strong>, then <strong>Add to Home Screen</strong> [+]</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onInstallPWA}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-xs font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Install App to Home Screen</span>
              </button>
            )}
          </div>
        )}

        {/* Main Quick Features List */}
        <div className="space-y-2">
          {/* Saved Facts Drawer Entry */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSavedDrawer();
            }}
            className={`w-full min-h-[48px] p-3.5 rounded-xl border flex items-center justify-between text-left transition-colors ${
              isLight 
                ? 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100' 
                : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'text-emerald-400 fill-current' : 'text-zinc-400'}`} />
              <div>
                <div className="font-mono text-xs font-bold uppercase">Offline Saved Archive</div>
                <div className="text-[11px] font-mono text-zinc-500">View and manage bookmarked facts</div>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200">
              {savedCount}
            </span>
          </button>

          {/* Daily Notification Alerts */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNotifications();
            }}
            className={`w-full min-h-[48px] p-3.5 rounded-xl border flex items-center justify-between text-left transition-colors ${
              isLight 
                ? 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100' 
                : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-zinc-400" />
              <div>
                <div className="font-mono text-xs font-bold uppercase">Daily Mobile Alerts</div>
                <div className="text-[11px] font-mono text-zinc-500">Configure daily fact notifications</div>
              </div>
            </div>
            <span className={`text-[11px] font-mono font-medium ${notificationsEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {notificationsEnabled ? 'ACTIVE' : 'OFF'}
            </span>
          </button>

          {/* Read Aloud Text-to-Speech */}
          <button
            type="button"
            onClick={onToggleSpeech}
            className={`w-full min-h-[48px] p-3.5 rounded-xl border flex items-center justify-between text-left transition-colors ${
              isLight 
                ? 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100' 
                : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-emerald-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-zinc-400" />
              )}
              <div>
                <div className="font-mono text-xs font-bold uppercase">
                  {isSpeaking ? 'Stop Audio Narration' : 'Read Fact Aloud'}
                </div>
                <div className="text-[11px] font-mono text-zinc-500">Accessible text-to-speech audio</div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              {isSpeaking ? 'PLAYING' : 'READY'}
            </span>
          </button>
        </div>

        {/* Display Settings Section */}
        <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/50 border-zinc-800'}`}>
          <div className="font-mono text-xs font-bold uppercase text-zinc-400 tracking-wider">
            Reading Theme
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 border transition-colors ${
                theme === 'dark' 
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-bold' 
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('oled')}
              className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 border transition-colors ${
                theme === 'oled' 
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-bold' 
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>OLED</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 border transition-colors ${
                theme === 'light' 
                  ? 'bg-zinc-200 text-zinc-900 border-zinc-400 font-bold' 
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
          </div>

          <div className="pt-2 font-mono text-xs font-bold uppercase text-zinc-400 tracking-wider">
            Typography Scale
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`min-h-[40px] px-2 py-1.5 rounded-xl text-xs font-mono border transition-colors ${
                fontSize === 'normal' 
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-bold' 
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              Default
            </button>

            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`min-h-[40px] px-2 py-1.5 rounded-xl text-xs font-mono border flex items-center justify-center gap-1 transition-colors ${
                fontSize === 'large' 
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-bold' 
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>+15%</span>
            </button>

            <button
              type="button"
              onClick={() => setFontSize('extralarge')}
              className={`min-h-[40px] px-2 py-1.5 rounded-xl text-xs font-mono border flex items-center justify-center gap-1 transition-colors ${
                fontSize === 'extralarge' 
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-bold' 
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>+30%</span>
            </button>
          </div>
        </div>

        {/* Fact check credibility footer */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 pt-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Every card is verified against official Philippine national archives.</span>
        </div>
      </div>
    </div>
  );
};
