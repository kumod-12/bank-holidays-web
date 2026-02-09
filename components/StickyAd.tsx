'use client';

import { useEffect, useRef } from 'react';

export function StickyAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-1">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-2243677965278567"
          data-ad-slot="auto"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
          ref={adRef as any}
        />
      </div>
    </div>
  );
}
