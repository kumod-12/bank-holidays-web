'use client';

import { useEffect, useRef, useState } from 'react';

export function StickyAd() {
  const containerRef = useRef<HTMLDivElement>(null);
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

    // Watch for AdSense injecting an iframe (means ad is actually served)
    const observer = new MutationObserver(() => {
      if (containerRef.current) {
        const iframe = containerRef.current.querySelector('iframe');
        if (iframe) {
          setAdLoaded(true);
          observer.disconnect();
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-lg"
      style={{ display: adLoaded ? 'block' : 'none' }}
    >
      <div className="max-w-4xl mx-auto px-4 py-1 h-[50px] sm:h-auto overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-2243677965278567"
          data-ad-slot="auto"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
