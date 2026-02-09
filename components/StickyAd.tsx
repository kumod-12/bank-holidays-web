'use client';

import { useEffect, useRef, useState } from 'react';

export function StickyAd() {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }

    // Check if ad has content after a delay
    const timer = setTimeout(() => {
      if (adRef.current && adRef.current.offsetHeight > 0) {
        setAdLoaded(true);
      }
    }, 2000);

    // Also observe for changes
    const observer = new MutationObserver(() => {
      if (adRef.current && adRef.current.offsetHeight > 0) {
        setAdLoaded(true);
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current, { childList: true, subtree: true, attributes: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-lg transition-transform ${
        adLoaded ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-1 h-[50px] sm:h-auto">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-2243677965278567"
          data-ad-slot="auto"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
          ref={adRef}
        />
      </div>
    </div>
  );
}
