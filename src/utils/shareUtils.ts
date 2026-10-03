import { Fact } from '../types';
import { formatShortDate } from './dateUtils';

/**
 * Generates Twitter intent URL with pre-filled verified fact text.
 */
export function getTwitterShareUrl(fact: Fact): string {
  const text = `Did you know? 🇵🇭\n\n${fact.title}\n\n"${fact.summary}"\n\nVerified Source: ${fact.primarySource}\n\nVia MonoFeed`;
  const url = typeof window !== 'undefined' ? window.location.href : 'https://monofeed.ph';
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

/**
 * Returns formatted text ready to copy for Instagram captions.
 */
export function getInstagramCaptionText(fact: Fact): string {
  return `🇵🇭 FACT CHECKED: ${fact.title}\n\n${fact.summary}\n\n${fact.body}\n\n📚 Primary Source: ${fact.primarySource}\n🔍 Verification: ${fact.sourceCitation}\n\n#MonoFeed #Philippines #PhilippineHistory #FactChecked #Trivia #Knowledge`;
}

/**
 * Renders a crisp, monochromatic Instagram card graphic on HTML5 Canvas.
 * format: 'feed' (1080x1080) or 'story' (1080x1920)
 * theme: 'dark' (black on white) or 'light' (white on black)
 */
export async function generateInstagramCardBlob(
  fact: Fact,
  format: 'feed' | 'story' = 'feed',
  isDarkMode = true
): Promise<Blob> {
  const width = 1080;
  const height = format === 'story' ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Color palette (strictly monochromatic high contrast)
  const bg = isDarkMode ? '#09090b' : '#ffffff';
  const textPrimary = isDarkMode ? '#fafafa' : '#09090b';
  const textMuted = isDarkMode ? '#a1a1aa' : '#52525b';
  const borderCol = isDarkMode ? '#27272a' : '#e4e4e7';
  const cardBg = isDarkMode ? '#18181b' : '#f4f4f5';

  // Fill background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Border & Margin setup
  const margin = 72;
  const contentWidth = width - margin * 2;
  const cardTop = format === 'story' ? 240 : 80;
  const cardHeight = height - (format === 'story' ? 480 : 160);

  // Rounded Inner Card
  const radius = 32;
  ctx.fillStyle = cardBg;
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.roundRect(margin, cardTop, contentWidth, cardHeight, radius);
  ctx.fill();
  ctx.stroke();

  // Header inside card
  const innerPad = 64;
  const innerX = margin + innerPad;
  let cursorY = cardTop + innerPad + 24;

  // MonoFeed brand kicker
  ctx.fillStyle = textMuted;
  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.fillText('MONOFEED · PHILIPPINES DISPATCH', innerX, cursorY);
  
  // Date & Day index right aligned
  const metaText = `${formatShortDate()} · #${fact.id.toUpperCase()}`;
  const metaMetrics = ctx.measureText(metaText);
  ctx.fillText(metaText, margin + contentWidth - innerPad - metaMetrics.width, cursorY);

  cursorY += 40;

  // Thin separator rule
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(innerX, cursorY);
  ctx.lineTo(margin + contentWidth - innerPad, cursorY);
  ctx.stroke();

  cursorY += 60;

  // Category & Status
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillStyle = textMuted;
  ctx.fillText(`[ ${fact.category.toUpperCase()} ] · 100% VERIFIED`, innerX, cursorY);

  cursorY += 56;

  // Fact Title (Large high contrast typography)
  ctx.fillStyle = textPrimary;
  ctx.font = '700 52px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';

  // Word wrap helper
  function wrapText(text: string, maxWidth: number, lineHeight: number): number {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx!.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx!.fillText(line, innerX, cursorY);
        line = words[n] + ' ';
        cursorY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx!.fillText(line, innerX, cursorY);
    cursorY += lineHeight;
    return cursorY;
  }

  wrapText(fact.title, contentWidth - innerPad * 2, 64);
  cursorY += 24;

  // Fact Summary
  ctx.fillStyle = textPrimary;
  ctx.font = '400 32px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
  wrapText(`"${fact.summary}"`, contentWidth - innerPad * 2, 46);

  cursorY += 36;

  // Fact Body snippet (if room allows, especially in story format)
  if (format === 'story') {
    ctx.fillStyle = textMuted;
    ctx.font = '400 26px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
    wrapText(fact.body, contentWidth - innerPad * 2, 38);
    cursorY += 40;
  }

  // Footer box for Primary Source & Citation
  const citationBoxY = cardTop + cardHeight - innerPad - 130;
  ctx.fillStyle = isDarkMode ? '#27272a' : '#e4e4e7';
  ctx.fillRect(innerX, citationBoxY, contentWidth - innerPad * 2, 1);

  ctx.fillStyle = textMuted;
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.fillText('PRIMARY VERIFIED SOURCE:', innerX, citationBoxY + 36);

  ctx.fillStyle = textPrimary;
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  const sourceText = `${fact.primarySource}`;
  ctx.fillText(sourceText.slice(0, 65) + (sourceText.length > 65 ? '...' : ''), innerX, citationBoxY + 70);

  ctx.fillStyle = textMuted;
  ctx.font = '400 20px "JetBrains Mono", monospace';
  ctx.fillText(`Archive Ref: ${fact.sourceCitation.slice(0, 75)}...`, innerX, citationBoxY + 104);

  // Bottom brand mark
  const footerY = height - (format === 'story' ? 140 : 40);
  ctx.fillStyle = textMuted;
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('monofeed.app · daily fact-checked philippine trivia', width / 2, footerY);
  ctx.textAlign = 'left';

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create canvas blob'));
      }
    }, 'image/png');
  });
}

/**
 * Downloads a generated image blob directly to user's device.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copies an image blob to system clipboard (for direct paste into Instagram web or apps).
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard || !window.ClipboardItem) {
    return false;
  }
  try {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.warn('Clipboard write image failed:', err);
    return false;
  }
}

/**
 * Native mobile device share using navigator.share with file attachment.
 */
export async function shareNatively(fact: Fact, imageBlob?: Blob): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }

  try {
    const shareData: ShareData = {
      title: `MonoFeed: ${fact.title}`,
      text: `${fact.title} — ${fact.summary}\n\nVerified: ${fact.primarySource}`,
      url: window.location.href
    };

    if (imageBlob && navigator.canShare && navigator.canShare({ files: [new File([imageBlob], 'monofeed-fact.png', { type: 'image/png' })] })) {
      const file = new File([imageBlob], `monofeed-${fact.id}.png`, { type: 'image/png' });
      await navigator.share({
        ...shareData,
        files: [file]
      });
      return true;
    }

    await navigator.share(shareData);
    return true;
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.warn('Native share failed:', err);
    }
    return false;
  }
}
