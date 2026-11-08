import { ImageResponse } from 'next/og';

export const alt = 'Hôtel Awaya Colline 132';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#064e3b',
          color: '#ffffff',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: 2 }}>Hôtel Awaya</div>
        <div style={{ fontSize: 48, color: '#6ee7b7', marginTop: 20, letterSpacing: 4 }}>
          COLLINE 132 · BÉNIN
        </div>
      </div>
    ),
    { ...size }
  );
}