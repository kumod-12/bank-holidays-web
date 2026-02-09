import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'My Holiday Calendar - Bank Holidays & Public Holidays Worldwide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            backgroundColor: '#2563EB',
            borderRadius: 16,
            marginBottom: 24,
          }}
        >
          <span style={{ color: 'white', fontSize: 48, fontWeight: 700 }}>M</span>
        </div>

        {/* Site name */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 16 }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: '#111827' }}>My</span>
          <span style={{ fontSize: 56, fontWeight: 700, color: '#2563EB' }}>Holiday</span>
          <span style={{ fontSize: 56, fontWeight: 700, color: '#111827' }}>Calendar</span>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: 28, color: '#4B5563', margin: 0 }}>
          Bank Holidays & Public Holidays Worldwide
        </p>

        {/* Country flags */}
        <div style={{ display: 'flex', gap: 16, marginTop: 32, fontSize: 36 }}>
          <span>&#x1F1EE;&#x1F1F3;</span>
          <span>&#x1F1FA;&#x1F1F8;</span>
          <span>&#x1F1EC;&#x1F1E7;</span>
          <span>&#x1F1E8;&#x1F1E6;</span>
          <span>&#x1F1E6;&#x1F1FA;</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
