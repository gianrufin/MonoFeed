import React, { useRef, useState } from 'react';
import { Fact, ThemeMode, FontSize } from '../types';
import { 
  ShieldCheck, 
  ExternalLink, 
  Heart, 
  Bookmark 
} from 'lucide-react';
import { formatFullDate } from '../utils/dateUtils';

interface DailyCardProps {
  fact: Fact;
  currentIndex: number;
  totalCount: number;
  isToday: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
  onNext: () => void;
  onPrev: () => void;
  theme: ThemeMode;
  fontSize: FontSize;
}

export const DailyCard: React.FC<DailyCardProps> = ({
  fact,
  currentIndex,
  totalCount,
  isToday,
  isSaved,
  onToggleSave,
  onNext,
  onPrev,
  theme,
  fontSize
}) => {
  const isLight = theme === 'light';
  const isOled = theme === 'oled';

  // Touch gesture state for 1-hand mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState<boolean>(false);
  const lastTapRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Only engage horizontal swipe if not scrolling vertically
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setSwipeOffset(diffX * 0.4); // Damped drag
    }
  };

  const handleTouchEnd = () => {
    const threshold = 60; // min px to trigger card turn
    if (swipeOffset < -threshold) {
      onNext();
    } else if (swipeOffset > threshold) {
      onPrev();
    }
    setSwipeOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Double tap to save/favorite (classic 1-hand mobile gesture)
  const handleCardClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      onToggleSave();
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 800);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  // Font size multiplier classes
  const titleClass = {
    normal: 'text-2xl sm:text-3xl leading-tight',
    large: 'text-3xl sm:text-4xl leading-tight',
    extralarge: 'text-4xl sm:text-5xl leading-tight'
  }[fontSize];

  const summaryClass = {
    normal: 'text-base sm:text-lg leading-snug',
    large: 'text-lg sm:text-xl leading-snug',
    extralarge: 'text-xl sm:text-2xl leading-snug'
  }[fontSize];

  const bodyClass = {
    normal: 'text-sm sm:text-base leading-relaxed',
    large: 'text-base sm:text-lg leading-relaxed',
    extralarge: 'text-lg sm:text-xl leading-relaxed'
  }[fontSize];

  return (
    <article
      role="article"
      aria-label={`Daily Philippine Fact: ${fact.title}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
      style={{
        transform: swipeOffset !== 0 ? `translateX(${swipeOffset}px)` : undefined,
        transition: swipeOffset === 0 ? 'transform 0.15s ease-out' : 'none'
      }}
      className={`relative w-full rounded-3xl border transition-colors select-none ${
        isLight
          ? 'bg-white border-zinc-200 text-zinc-900 shadow-md'
          : isOled
          ? 'bg-black border-zinc-800 text-zinc-100 shadow-none'
          : 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-xl'
      }`}
    >
      {/* Double tap heart animation overlay */}
      {showHeartAnimation && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-50 duration-200">
          <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Heart className="w-16 h-16 text-white fill-white animate-bounce" />
          </div>
        </div>
      )}

      {/* Top Metadata Header - Zero Pill, Clean Monochromatic */}
      <div 
        className={`px-5 sm:px-7 pt-5 pb-3.5 border-b flex items-center justify-between gap-2 text-xs font-mono ${
          isLight ? 'border-zinc-200 text-zinc-500' : 'border-zinc-800/80 text-zinc-400'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-semibold uppercase tracking-wider text-zinc-300">
            {isToday ? "Today" : `Day ${currentIndex + 1}`}
          </span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="truncate">{formatFullDate()}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-emerald-400 font-bold text-[11px] tracking-wide">
          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="hidden xs:inline">100% VERIFIED</span>
          <span className="xs:hidden">VERIFIED</span>
        </div>
      </div>

      {/* Main Fact Card Body */}
      <div className="px-5 sm:px-7 py-6 sm:py-8 space-y-5">
        {/* Category & Location kicker */}
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-zinc-500">
          <span className="text-zinc-400">{fact.category}</span>
          {fact.location && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{fact.location}</span>
            </>
          )}
        </div>

        {/* Fact Title */}
        <h1 className={`font-bold tracking-tight text-balance ${titleClass}`}>
          {fact.title}
        </h1>

        {/* Core Claim / Key Takeaway Quote */}
        <div 
          className={`border-l-2 pl-4 py-1.5 transition-colors ${
            isLight 
              ? 'border-zinc-900 bg-zinc-50 text-zinc-900' 
              : 'border-zinc-300 bg-zinc-900/50 text-zinc-100'
          }`}
        >
          <p className={`font-medium ${summaryClass}`}>
            &ldquo;{fact.summary}&rdquo;
          </p>
        </div>

        {/* Verified Detail Body */}
        <div className={`space-y-3 font-normal text-zinc-300 ${bodyClass} ${isLight ? '!text-zinc-800' : ''}`}>
          <p>{fact.body}</p>
        </div>

        {/* "Did you know?" Note */}
        <div 
          className={`p-3.5 rounded-2xl border text-xs font-mono space-y-1 ${
            isLight 
              ? 'bg-zinc-100/80 border-zinc-200 text-zinc-700' 
              : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300'
          }`}
        >
          <div className="font-bold tracking-wider uppercase text-zinc-400 text-[10px]">
            Did You Know?
          </div>
          <p className="leading-relaxed">
            {fact.didYouKnow}
          </p>
        </div>

        {/* Verification Source Box */}
        <section 
          aria-label="Verified Source Documentation"
          className={`p-4 rounded-2xl border text-xs font-mono space-y-1.5 transition-colors ${
            isLight 
              ? 'bg-zinc-50 border-zinc-200 text-zinc-800' 
              : 'bg-zinc-950/90 border-zinc-800 text-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
            <span>Primary Archive</span>
            <span>{fact.corroboratingEntity}</span>
          </div>

          <div className="font-semibold text-zinc-100">
            {fact.primarySource}
          </div>

          <p className="text-[11px] text-zinc-400 leading-normal">
            {fact.sourceCitation}
          </p>

          {fact.sourceUrl && (
            <div className="pt-1">
              <a
                href={fact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white underline underline-offset-4"
              >
                <span>Registry Archive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </section>

        {/* Double-tap hint for mobile users */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-white fill-white' : ''}`} />
            <span>{isSaved ? 'Saved offline' : 'Double-tap card to save'}</span>
          </div>
          <div className="text-zinc-500">
            Swipe left/right to browse
          </div>
        </div>
      </div>
    </article>
  );
};
