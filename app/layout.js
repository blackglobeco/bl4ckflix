import './globals.css';
import Link from 'next/link';
import { Bricolage_Grotesque } from 'next/font/google';
import NavMore from '@/components/NavMore';
import Chatbot from '@/components/Chatbot';

const f = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font' });

export const metadata = {
  title: 'BlackFlix',
  description: 'Find what to watch and where to stream it.',
  openGraph: { title: 'BlackFlix', description: 'Find what to watch and where to stream it.', type: 'website' },
};

export const viewport = { themeColor: '#e50914', width: 'device-width', initialScale: 1 };

export default function Root({ children }) {
  return (
    <html lang="en" className={f.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <nav>
          <Link href="/" className="logo">BLACKFLIX</Link>
          <Link href="/search?type=movie">Movies</Link>
          <Link href="/search?type=tv">Series</Link>
          <Link href="/search?type=anime">Anime</Link>
          <Link href="/providers">Providers</Link>
          <Link href="/watchlist">Watchlist</Link>
          <NavMore />
          <span className="sp" />
          <form action="/search"><input name="q" placeholder="Search titles" aria-label="Search" /></form>
        </nav>
        <main>{children}</main>
        <Chatbot />
        <footer>
          <p>BlackFlix is a streaming guide. It does not host or stream video.</p>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data by JustWatch via TMDB.</p>
        </footer>
      </body>
    </html>
  );
}
