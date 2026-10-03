import React from 'react';
import { Sparkles, Wifi } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  onRandom: () => void;
  onToday: () => void;
  isToday: boolean;
  theme: ThemeMode;
}

export const Header: React.FC<HeaderProps> = ({
  onRandom,
  onToday,
  isToday,
  theme
}) => {
  const isLight = theme === 'light';

  return (
    <header 
      className={`border-b sticky top-0 z-30 transition-colors ${
        isLight 
          ? 'bg-white/95 border-zinc-200 text-zinc-900' 
          : 'bg-zinc-950/95 border-zinc-800/80 text-zinc-100'
      } backdrop-blur-md`}
      role="banner"
    >
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={onToday}
            className="flex items-center gap-1.5 focus:outline-none"
            title="Return to Today's Fact"
          >
            <span className="font-mono font-bold tracking-tight text-lg uppercase">
              MonoFeed
            </span>
            <span 
              className={`text-[9px] font-mono px-1 py-0.2 rounded border uppercase tracking-wider ${
                isLight 
                  ? 'border-zinc-300 text-zinc-600 bg-zinc-100' 
                  : 'border-zinc-800 text-zinc-400 bg-zinc-900'
              }`}
            >
              PH
            </span>
          </button>
        </div>

        {/* Header Right: Offline Ready badge + Shuffle */}
        <div className="flex items-center gap-2">
          <div 
            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 px-2 py-1 rounded-md"
            title="100% Offline PWA ready"
          >
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span className="hidden xs:inline">Offline</span>
          </div>

          {!isToday ? (
            <button
              type="button"
              onClick={onToday}
              className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Today
            </button>
          ) : (
            <button
              type="button"
              onClick={onRandom}
              className="text-xs font-mono p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              title="Shuffle to random fact"
              aria-label="Random fact"
            >
              <Sparkles className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
