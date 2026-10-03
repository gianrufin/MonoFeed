import React, { useState, useEffect } from 'react';
import { Fact, ThemeMode } from '../types';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Instagram, 
  Twitter, 
  Image as ImageIcon 
} from 'lucide-react';
import { 
  generateInstagramCardBlob, 
  downloadBlob, 
  copyImageToClipboard, 
  getTwitterShareUrl, 
  getInstagramCaptionText, 
  shareNatively 
} from '../utils/shareUtils';

interface ShareModalProps {
  fact: Fact;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  fact,
  isOpen,
  onClose,
  theme
}) => {
  const [format, setFormat] = useState<'feed' | 'story'>('feed');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isLight = theme === 'light';

  // Render canvas whenever format or fact changes
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setIsGenerating(true);

    generateInstagramCardBlob(fact, format, theme !== 'light')
      .then((blob) => {
        if (!active) return;
        setCurrentBlob(blob);
        const url = URL.createObjectURL(blob);
        setImagePreviewUrl(url);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('Failed to generate image card:', err);
        setIsGenerating(false);
      });

    return () => {
      active = false;
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [fact, format, theme, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!currentBlob) return;
    const filename = `monofeed-${fact.id}-${format}.png`;
    downloadBlob(currentBlob, filename);
  };

  const handleCopyImage = async () => {
    if (!currentBlob) return;
    const success = await copyImageToClipboard(currentBlob);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
    } else {
      // Fallback: download if copy clipboard fails
      handleDownload();
    }
  };

  const handleCopyCaption = async () => {
    const text = getInstagramCaptionText(fact);
    await navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async () => {
    await shareNatively(fact, currentBlob || undefined);
  };

  const twitterUrl = getTwitterShareUrl(fact);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div 
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 transition-colors shadow-2xl ${
          isLight ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 id="share-modal-title" className="text-lg font-bold font-mono tracking-tight uppercase">
              Social Sharing & Export
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Direct to Twitter or generate high-contrast Instagram graphics
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Share Buttons */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-mono text-xs font-semibold tracking-wide transition-colors"
          >
            <Twitter className="w-4 h-4 text-sky-400" />
            <span>Post to Twitter / X</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>

          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-mono text-xs font-semibold tracking-wide transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Mobile Share Sheet</span>
          </button>
        </div>

        {/* Instagram Visual Card Generator Section */}
        <div className={`mt-2 p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Instagram Card Studio
              </span>
            </div>

            {/* Format toggle: 1:1 or 9:16 */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
              <button
                type="button"
                onClick={() => setFormat('feed')}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  format === 'feed' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Feed (1:1)
              </button>
              <button
                type="button"
                onClick={() => setFormat('story')}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  format === 'story' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Story (9:16)
              </button>
            </div>
          </div>

          {/* Graphic Preview */}
          <div className="relative flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-lg p-3 overflow-hidden min-h-[220px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2 text-zinc-500 font-mono text-xs">
                <ImageIcon className="w-6 h-6 animate-pulse" />
                <span>Rendering high-resolution graphic...</span>
              </div>
            ) : imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Instagram Card Preview"
                className={`rounded shadow-lg border border-zinc-800 object-contain ${
                  format === 'story' ? 'max-h-64 aspect-[9/16]' : 'max-h-56 aspect-square'
                }`}
              />
            ) : null}
          </div>

          {/* Card Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!currentBlob || isGenerating}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res PNG</span>
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              disabled={!currentBlob || isGenerating}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 font-mono text-xs font-medium transition-colors disabled:opacity-50"
            >
              {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedImage ? 'Copied to Clipboard!' : 'Copy Image to Clipboard'}</span>
            </button>
          </div>

          {/* Instagram Caption Copy */}
          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <div className="text-xs text-zinc-400 font-mono">
              Ready-to-paste caption with citations:
            </div>
            <button
              type="button"
              onClick={handleCopyCaption}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs transition-colors"
            >
              {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption & Tags'}</span>
            </button>
          </div>
        </div>

        {/* Copy Link Utility */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">Permanent Card Reference: #{fact.id}</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 underline underline-offset-4"
          >
            {copiedLink ? 'Link Copied!' : 'Copy Direct Web Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
