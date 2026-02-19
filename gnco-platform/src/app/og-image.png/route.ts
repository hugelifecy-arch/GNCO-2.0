import { ImageResponse } from 'next/og'
import { createElement } from 'react'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    createElement(
      'div',
      {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0d0d0d',
          color: '#ffffff',
          padding: '52px 56px 40px 56px',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        },
      },
      createElement('div', { style: { display: 'flex', fontSize: 72, fontWeight: 700 } }, '◆ GNCO'),
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            width: '100%',
          },
        },
        createElement('div', { style: { display: 'flex', fontSize: 82, fontWeight: 700 } }, 'Global Fund Architect'),
        createElement(
          'div',
          { style: { display: 'flex', fontSize: 34, fontWeight: 500, textAlign: 'center' } },
          '15 Jurisdictions · Cayman · Luxembourg · Singapore · Ireland · BVI + 10 more',
        ),
      ),
      createElement(
        'div',
        { style: { display: 'flex', width: '100%', justifyContent: 'center', fontSize: 36, fontWeight: 500 } },
        'Free Open Beta — gnconew.vercel.app',
      ),
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
