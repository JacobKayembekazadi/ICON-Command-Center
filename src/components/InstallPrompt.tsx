import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // iOS detection (no beforeinstallprompt on Safari)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as any).standalone;
    setIsIOS(ios);

    // Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS instructions after 3s if not installed
    if (ios) {
      const t = setTimeout(() => setShowBanner(true), 3000);
      return () => { clearTimeout(t); window.removeEventListener('beforeinstallprompt', handler); };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsInstalled(true);
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  const dismiss = () => setShowBanner(false);

  if (isInstalled || !showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90]"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={dismiss}
      />

      {/* Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100] mx-auto max-w-sm"
        style={{
          background: '#111111',
          border: '1px solid #1A1A1A',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0',
          padding: '32px 24px',
          paddingBottom: 'calc(32px + env(safe-area-inset-bottom))',
        }}
      >
        {/* ICON logo mark */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: '#080808', border: '1px solid #1A1A1A' }}
          >
            <span style={{ fontFamily: "'Playfair Display', serif", color: '#C9A84C', fontSize: '1rem', fontWeight: 600 }}>I</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", color: '#C9A84C', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              ICON
            </div>
            <div style={{ color: '#444', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Command Center
            </div>
          </div>
        </div>

        <p style={{ color: '#AAAAAA', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Add to your home screen for instant access — no browser chrome, full screen.
        </p>

        {isIOS ? (
          <>
            <div
              className="rounded-xl p-4 mb-6"
              style={{ background: '#0A0A0A', border: '1px solid #1A1A1A' }}
            >
              <p style={{ color: '#666', fontSize: '12px', lineHeight: 1.8, letterSpacing: '0.02em' }}>
                1. Tap the <strong style={{ color: '#C9A84C' }}>Share</strong> button in Safari<br />
                2. Scroll down and tap <strong style={{ color: '#C9A84C' }}>"Add to Home Screen"</strong><br />
                3. Tap <strong style={{ color: '#C9A84C' }}>Add</strong>
              </p>
            </div>
            <button
              onClick={dismiss}
              className="w-full py-3 rounded-xl transition-all"
              style={{ background: '#1A1A1A', color: '#666', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
            >
              Got it
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={dismiss}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{ background: '#1A1A1A', color: '#555', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{ background: '#C9A84C', color: '#080808', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}
            >
              Install
            </button>
          </div>
        )}

        {/* Drag handle */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full"
          style={{ background: '#2A2A2A' }}
        />
      </div>
    </>
  );
};
