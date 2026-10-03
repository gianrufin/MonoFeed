import React from 'react';
import { ThemeMode, FontSize } from '../types';
import { Type, Moon, Sun, Monitor } from 'lucide-react';

interface AccessibilityBarProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  onClose?: () => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  theme,
  setTheme,
  fontSize,
  setFontSize,
  onClose
}) => {
  return (
    <div 
      role="region" 
      aria-label="Display and Accessibility Settings"
      className="p-4 border-b border-zinc-800 bg-zinc-900/90 text-zinc-100 backdrop-blur-md"
    >
      <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Theme mode */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Contrast Theme</span>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                theme === 'dark' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-pressed={theme === 'dark'}
              title="Zinc Dark"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('oled')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                theme === 'oled' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-pressed={theme === 'oled'}
              title="True Pitch Black (OLED)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>OLED Pure</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                theme === 'light' ? 'bg-zinc-200 text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-pressed={theme === 'light'}
              title="High Contrast Paper Light"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Font size control */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Text Scale</span>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                fontSize === 'normal' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-pressed={fontSize === 'normal'}
            >
              100%
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                fontSize === 'large' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-pressed={fontSize === 'large'}
            >
              <Type className="w-3.5 h-3.5" />
              115%
            </button>
            <button
              type="button"
              onClick={() => setFontSize('extralarge')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                fontSize === 'extralarge' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-pressed={fontSize === 'extralarge'}
            >
              <Type className="w-4 h-4" />
              130%
            </button>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-zinc-400 hover:text-zinc-100 underline underline-offset-4 ml-auto"
          >
            [Close Controls]
          </button>
        )}
      </div>
    </div>
  );
};
