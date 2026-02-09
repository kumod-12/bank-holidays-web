'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed or previously dismissed this session
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (sessionStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Small delay so it doesn't feel jarring on load
      setTimeout(() => setShow(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 sm:p-5 pointer-events-auto animate-slide-up">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm sm:text-base">
              Add to Home Screen
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Install My Holiday Calendar for quick access and offline browsing.
            </p>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Button */}
        <button
          onClick={handleInstall}
          className="mt-3 w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          Install App
        </button>
      </div>
    </div>
  );
}
