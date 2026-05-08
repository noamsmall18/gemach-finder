import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'GemachFinder').slice(0, 80)
  const sub = (searchParams.get('sub') || 'Free community lending directory').slice(0, 100)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1E3A64 0%, #2D5A8B 100%)',
          padding: '72px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.22) 0%, rgba(14,165,233,0) 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            🤝
          </div>
          <div
            style={{
              color: '#fff',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            GemachFinder
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            gap: 18,
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              maxWidth: '900px',
              display: 'flex',
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.82)',
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              display: 'flex',
            }}
          >
            {sub}
          </div>
        </div>

        <div
          style={{
            marginTop: 42,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'rgba(255,255,255,0.6)',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 99, background: '#0ea5e9' }} />
          Bergen County
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  )
}
