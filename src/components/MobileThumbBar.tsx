import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Share2, 
  MoreHorizontal 
} from 'lucide-react';
import { ThemeMode } from '../types';

interface MobileThumbBarProps {
  currentIndex: number;
  totalCount: number;
  isSaved: boolean;
  onToggleSave: () => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenShare: () => void;
  onOpenMenu: () => void;
  theme: ThemeMode;
  savedCount: number;
}

export const MobileThumbBar: React.FC<MobileThumbBarProps> = ({
  currentIndex,
  totalCount,
  isSaved,
  onToggleSave,
  onPrev,
  onNext,
  onOpenShare,
  onOpenMenu,
  theme,
  savedCount
}) => {
  const isLight = theme === 'light';

  return (
    <nav 
      aria-label="One-handed thumb navigation"
      className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 pb-safe pointer-events-none"
    >
      <div 
        className={`max-w-md mx-auto rounded-2xl border p-2 flex items-center justify-between gap-1 shadow-2xl backdrop-blur-xl pointer-events-auto transition-colors ${
          isLight 
            ? 'bg-white/95 border-zinc-300 text-zinc-900 shadow-zinc-300/40' 
            : 'bg-zinc-950/95 border-zinc-800 text-zinc-100 shadow-black/80'
        }`}
      >
        {/* Previous Button (Left thumb zone) */}
        <button
          type="button"
          onClick={onPrev}
          className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
            isLight 
              ? 'hover:bg-zinc-100 active:bg-zinc-200 text-zinc-700' 
              : 'hover:bg-zinc-900 active:bg-zinc-800 text-zinc-300'
          }`}
          aria-label="Previous fact"
          title="Previous Fact"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Counter indicator */}
        <div className="flex flex-col items-center justify-center px-1 text-center font-mono select-none">
          <span className="text-xs font-bold tracking-tight">
            {currentIndex + 1} <span className="text-zinc-500 font-normal">/ {totalCount}</span>
          </span>
          <span className="text-[9px] uppercase tracking-wider text-zinc-500">
            Swipe ↔
          </span>
        </div>

        {/* Save / Favorite (Center thumb zone) */}
        <button
          type="button"
          onClick={onToggleSave}
          className={`h-12 px-3.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-semibold transition-all active:scale-95 ${
            isSaved
              ? 'bg-zinc-100 text-zinc-950 border-white shadow-xs'
              : isLight
              ? 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
              : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200'
          }`}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Saved to offline memory" : "Save fact offline"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          <span className="hidden xs:inline">{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        {/* Share Button (Right-center thumb zone) */}
        <button
          type="button"
          onClick={onOpenShare}
          className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
            isLight 
              ? 'hover:bg-zinc-100 active:bg-zinc-200 text-zinc-700' 
              : 'hover:bg-zinc-900 active:bg-zinc-800 text-zinc-300'
          }`}
          aria-label="Share fact to Instagram, Twitter, or mobile apps"
          title="Share Fact"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Next Button (Right thumb zone - most frequent action) */}
        <button
          type="button"
          onClick={onNext}
          className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
            isLight 
              ? 'bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-white' 
              : 'bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950'
          }`}
          aria-label="Next fact"
          title="Next Fact"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Overflow Menu (Settings, PWA Install, Saved List, Alerts) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className={`h-12 w-10 rounded-xl flex items-center justify-center relative transition-colors active:scale-95 ${
            isLight 
              ? 'hover:bg-zinc-100 active:bg-zinc-200 text-zinc-500' 
              : 'hover:bg-zinc-900 active:bg-zinc-800 text-zinc-400'
          }`}
          aria-label="Open menu and settings"
          title="Menu & Settings"
        >
          <MoreHorizontal className="w-5 h-5" />
          {savedCount > 0 && (
            <span className="absolute top-2.5 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>
    </nav>
  );
};
