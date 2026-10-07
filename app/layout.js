import './globals.css';
import { Bricolage_Grotesque } from 'next/font/google';
import NavBar from '@/components/NavBar';
import Chatbot from '@/components/Chatbot';
import { Analytics } from '@vercel/analytics/next';

const f = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font' });

export const metadata = {
  title: 'BLACKFLIX - Unified Streaming Platform',
  description: 'Enjoy unlimited movies, series, animes on BLACKFLIX. Watch your favourite movies, tv shows, animes, stars and studios in one place and stream instantly!',
  openGraph: { 
    title: 'BLACKFLIX - Unified Streaming Platform', 
    description: 'Enjoy unlimited movies, series, animes on BLACKFLIX. Watch your favourite movies, tv shows, animes, stars and studios in one place and stream instantly!', 
    type: 'website' 
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLACKFLIX - Unified Streaming Platform',
    description: 'Enjoy unlimited movies, series, animes on BLACKFLIX. Watch your favourite movies, tv shows, animes, stars and studios in one place and stream instantly!'
  },
  keywords: 'Blackflix, blackflix, blackflix.eu.cc, streaming, movies, tv shows, watch online, free streaming'
};

export const viewport = { themeColor: '#000000', width: 'device-width', initialScale: 1 };

export default function Root({ children }) {
  return (
    <html lang="en" className={f.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="robots" content="index, follow" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <NavBar />
        <main>{children}</main>
        <Chatbot />
        <footer style={{ textAlign: 'center' }}>
          <p>BLACKFLIX does not store any files on our server, we only linked to the media which is hosted on third party services.</p>
          <p>BLACKFLIX © 2026. All Rights Reserved</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
