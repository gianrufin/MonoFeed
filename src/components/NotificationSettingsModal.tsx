import React, { useState, useEffect } from 'react';
import { Fact, ThemeMode } from '../types';
import { 
  X, 
  Bell, 
  Check, 
  AlertCircle, 
  Clock, 
  Smartphone, 
  Volume2 
} from 'lucide-react';
import { 
  getNotificationSupport, 
  requestNotificationPermission, 
  triggerFactNotification, 
  getStoredNotificationPrefs, 
  saveStoredNotificationPrefs 
} from '../utils/notifications';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayFact: Fact;
  theme: ThemeMode;
  onPreferencesChange: (enabled: boolean) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  todayFact,
  theme,
  onPreferencesChange
}) => {
  const [support, setSupport] = useState(() => getNotificationSupport());
  const [prefs, setPrefs] = useState(() => getStoredNotificationPrefs());
  const [testSent, setTestSent] = useState(false);
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

  const isLight = theme === 'light';

  useEffect(() => {
    if (isOpen) {
      setSupport(getNotificationSupport());
      setPrefs(getStoredNotificationPrefs());
      setSimulatedAlert(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setSupport((prev) => ({ ...prev, permission: perm }));
    if (perm === 'granted') {
      const updated = { ...prefs, enabled: true };
      setPrefs(updated);
      saveStoredNotificationPrefs(true, updated.time);
      onPreferencesChange(true);
    }
  };

  const handleToggleEnable = () => {
    const newEnabled = !prefs.enabled;
    const updated = { ...prefs, enabled: newEnabled };
    setPrefs(updated);
    saveStoredNotificationPrefs(newEnabled, updated.time);
    onPreferencesChange(newEnabled);

    // If enabling and permission is default, ask for permission
    if (newEnabled && support.permission === 'default') {
      handleRequestPermission();
    }
  };

  const handleTimeChange = (time: string) => {
    const updated = { ...prefs, time };
    setPrefs(updated);
    saveStoredNotificationPrefs(updated.enabled, time);
  };

  const handleSendTest = () => {
    const delivered = triggerFactNotification(todayFact);
    setTestSent(true);

    if (!delivered) {
      // In sandbox/iframe or if denied, show the in-app simulated mobile push alert
      setSimulatedAlert(`MonoFeed · Daily Alert [${prefs.time}]: ${todayFact.title} — "${todayFact.summary}"`);
    } else {
      setSimulatedAlert('System notification dispatched to your device!');
    }

    setTimeout(() => {
      setTestSent(false);
    }, 4000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
    >
      <div 
        className={`w-full max-w-lg rounded-2xl border p-6 transition-colors shadow-2xl ${
          isLight ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-zinc-400" />
            <div>
              <h2 id="notification-modal-title" className="text-base font-bold font-mono tracking-tight uppercase">
                Daily Mobile Alerts
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                One verified Philippine fact delivered daily to your device
              </p>
            </div>
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

        {/* Permission status box */}
        <div className="mt-4 space-y-4">
          <div 
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              support.permission === 'granted' 
                ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300' 
                : support.permission === 'denied'
                ? 'border-red-800/60 bg-red-950/20 text-red-300'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-300'
            }`}
          >
            {support.permission === 'granted' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : support.permission === 'denied' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Smartphone className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            )}

            <div className="text-xs font-mono space-y-1">
              <div className="font-semibold uppercase tracking-wider">
                System Status: {support.permission.toUpperCase()}
              </div>
              <p className="text-zinc-400 leading-relaxed">
                {support.permission === 'granted'
                  ? 'Device notifications are fully authorized. Daily dispatches will trigger at your chosen hour.'
                  : support.permission === 'denied'
                  ? 'Notifications are blocked in browser permissions. You can unblock in site settings or use our in-app alerts.'
                  : 'Grant notification permission so MonoFeed can deliver your daily verified trivia alert.'}
              </p>

              {support.permission === 'default' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-950 font-bold hover:bg-white text-xs transition-colors"
                >
                  Authorize Alerts Now
                </button>
              )}
            </div>
          </div>

          {/* Toggle daily delivery */}
          <div className={`p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/50 border-zinc-800'} flex items-center justify-between`}>
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider">Daily Alert Subscription</div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                Automatic scheduled morning reminder
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleEnable}
              role="switch"
              aria-checked={prefs.enabled}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 ${
                prefs.enabled ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  prefs.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Alert Hour Selector */}
          <div className={`p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/50 border-zinc-800'} space-y-2`}>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
              <Clock className="w-3.5 h-3.5" />
              <span>Preferred Delivery Time</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 pt-1">
              {['08:00', '09:00', '12:00', '18:00'].map((timeStr) => (
                <button
                  key={timeStr}
                  type="button"
                  onClick={() => handleTimeChange(timeStr)}
                  className={`py-2 px-1 text-center font-mono text-xs rounded-lg border transition-colors ${
                    prefs.time === timeStr
                      ? 'bg-zinc-100 text-zinc-950 font-bold border-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700'
                  }`}
                >
                  {timeStr === '08:00' && '8:00 AM'}
                  {timeStr === '09:00' && '9:00 AM'}
                  {timeStr === '12:00' && '12:00 PM'}
                  {timeStr === '18:00' && '6:00 PM'}
                </button>
              ))}
            </div>
          </div>

          {/* Test Notification Trigger */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSendTest}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-mono text-xs font-semibold tracking-wide transition-colors"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{testSent ? 'Alert Dispatched!' : 'Send Test Mobile Alert Now'}</span>
            </button>
          </div>

          {/* Simulated / Fallback Notification Banner */}
          {simulatedAlert && (
            <div className="p-3.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-100 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-1 border-b border-zinc-800">
                <span className="font-semibold text-emerald-400">PUSH ALERT PREVIEW</span>
                <span>JUST NOW</span>
              </div>
              <p className="text-xs font-mono mt-2 leading-relaxed text-zinc-200">
                {simulatedAlert}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
