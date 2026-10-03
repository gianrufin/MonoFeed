import React, { useState } from 'react';
import { Fact, ThemeMode } from '../types';
import { 
  X, 
  Trash2, 
  Download, 
  ExternalLink, 
  BookmarkCheck, 
  Search, 
  Share2, 
  Copy, 
  Check 
} from 'lucide-react';
import { formatShortDate } from '../utils/dateUtils';

interface SavedFactsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedFacts: Fact[];
  onSelectFact: (fact: Fact) => void;
  onRemoveFact: (id: string) => void;
  onClearAll: () => void;
  theme: ThemeMode;
}

export const SavedFactsDrawer: React.FC<SavedFactsDrawerProps> = ({
  isOpen,
  onClose,
  savedFacts,
  onSelectFact,
  onRemoveFact,
  onClearAll,
  theme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const isLight = theme === 'light';

  if (!isOpen) return null;

  const filteredFacts = savedFacts.filter((fact) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      fact.title.toLowerCase().includes(q) ||
      fact.summary.toLowerCase().includes(q) ||
      fact.category.toLowerCase().includes(q) ||
      fact.primarySource.toLowerCase().includes(q) ||
      fact.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleExportText = () => {
    if (savedFacts.length === 0) return;
    const content = savedFacts
      .map(
        (f, i) =>
          `[${i + 1}] ${f.title}\nCategory: ${f.category}\nClaim: ${f.summary}\nDetail: ${f.body}\nPrimary Source: ${f.primarySource}\nCitation: ${f.sourceCitation}\n---\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monofeed-saved-facts-${formatShortDate().replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAllToClipboard = async () => {
    if (savedFacts.length === 0) return;
    const text = savedFacts
      .map((f, i) => `${i + 1}. ${f.title}\n"${f.summary}"\nSource: ${f.primarySource}\n`)
      .join('\n');
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-drawer-title"
    >
      <div 
        className={`w-full max-w-md h-full flex flex-col border-l transition-colors shadow-2xl ${
          isLight ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 id="saved-drawer-title" className="text-base font-bold font-mono tracking-tight uppercase">
                Offline Saved Facts ({savedFacts.length})
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">
                100% accessible with no internet connection
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            aria-label="Close saved drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & utilities */}
        {savedFacts.length > 0 && (
          <div className="p-4 border-b border-zinc-800 shrink-0 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search saved facts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs font-mono transition-colors focus:outline-none ${
                  isLight 
                    ? 'border-zinc-300 bg-zinc-50 text-zinc-900 focus:border-zinc-500' 
                    : 'border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-zinc-600'
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportText}
                  className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Export offline backup"
                >
                  <Download className="w-3 h-3" />
                  <span>Export TXT</span>
                </button>
                <span className="text-zinc-700">·</span>
                <button
                  type="button"
                  onClick={handleCopyAllToClipboard}
                  className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAll ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClearAll}
                className="text-red-400 hover:text-red-300 text-[11px] transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Facts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedFacts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-3 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-500">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <div className="font-mono text-sm font-semibold uppercase tracking-wider">
                No Saved Facts Yet
              </div>
              <p className="text-xs font-mono text-zinc-500 max-w-xs leading-relaxed">
                Click the bookmark button on any daily fact card to save it directly into local offline memory.
              </p>
            </div>
          ) : filteredFacts.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-zinc-500">
              No saved facts match &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredFacts.map((fact) => (
              <div
                key={fact.id}
                className={`p-3.5 rounded-xl border transition-all text-left group ${
                  isLight
                    ? 'border-zinc-200 bg-zinc-50 hover:border-zinc-400'
                    : 'border-zinc-800 bg-zinc-900/70 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-1">
                  <span>{fact.category.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <span>#{fact.id.toUpperCase()}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveFact(fact.id)}
                      className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      title="Remove from saved"
                      aria-label={`Remove ${fact.title} from saved`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectFact(fact);
                    onClose();
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <h3 className="font-semibold text-sm leading-snug hover:underline underline-offset-2">
                    {fact.title}
                  </h3>
                  <p className="text-xs font-normal mt-1 line-clamp-2 text-zinc-400 leading-relaxed">
                    {fact.summary}
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-zinc-500 truncate">
                    Source: {fact.primarySource}
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
