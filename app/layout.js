import './globals.css';
import Link from 'next/link';
import { Bricolage_Grotesque } from 'next/font/google';
const f = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font' });
export const metadata = { title: 'BlackFlix', description: 'Find what to watch and where to stream it.' };
export default function Root({ children }) {
  return (
    <html lang="en" className={f.variable}>
      <body>
        <nav>
          <Link href="/" className="logo">BLACKFLIX</Link>
          <Link href="/search?type=movie">Movies</Link>
          <Link href="/search?type=tv">Series</Link>
          <Link href="/providers">Providers</Link>
          <Link href="/watchlist">Watchlist</Link>
          <span className="sp" />
          <form action="/search"><input name="q" placeholder="Search titles" aria-label="Search" /></form>
        </nav>
        <main>{children}</main>
        <footer>BlackFlix is a streaming guide. It does not host or stream video. This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability data by JustWatch via TMDB.</footer>
      </body>
    </html>
  );
}
