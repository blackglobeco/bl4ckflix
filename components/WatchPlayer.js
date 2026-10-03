'use client';
import { useState, useEffect } from 'react';

// Servers with flag emoji for region labelling — matches CineHD's server grid style
const SERVERS = [
  // English / Global
  { id: 'vidsrc',      label: 'VidSrc',     flag: '🇺🇸', movie: (id)       => `https://vidsrc.to/embed/movie/${id}`,                   tv: (id,s,e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { id: 'superembed',  label: 'SuperEmbed', flag: '🇺🇸', movie: (id)       => `https://multiembed.mov/?video_id=${id}&tmdb=1`,          tv: (id,s,e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
  { id: '2embed',      label: '2Embed',     flag: '🇦🇺', movie: (id)       => `https://www.2embed.cc/embed/${id}`,                     tv: (id,s,e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` },
  { id: 'embedsu',     label: 'EmbedSU',    flag: '🇬🇧', movie: (id)       => `https://embed.su/embed/movie/${id}`,                    tv: (id,s,e) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
  { id: 'vidlink',     label: 'VidLink',    flag: '🇬🇧', movie: (id)       => `https://vidlink.pro/movie/${id}`,                       tv: (id,s,e) => `https://vidlink.pro/tv/${id}/${s}/${e}` },
  { id: 'autoembed',   label: 'AutoEmbed',  flag: '🇺🇸', movie: (id)       => `https://autoembed.co/movie/tmdb/${id}`,                 tv: (id,s,e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}` },
  { id: 'smashystream',label: 'Premium',    flag: '🇺🇸', movie: (id)       => `https://player.smashy.stream/movie/${id}`,              tv: (id,s,e) => `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}` },
  { id: '111movies',   label: '111',        flag: '🇬🇧', movie: (id)       => `https://111movies.com/movie/${id}`,                     tv: (id,s,e) => `https://111movies.com/tv/${id}/${s}/${e}` },
  { id: 'moviesapi',   label: 'MoviesAPI',  flag: '🇺🇸', movie: (id)       => `https://moviesapi.club/movie/${id}`,                    tv: (id,s,e) => `https://moviesapi.club/tv/${id}-${s}-${e}` },
  { id: 'nontongo',    label: 'Nontongo',   flag: '🇺🇸', movie: (id)       => `https://www.nontongo.win/embed/movie/${id}`,            tv: (id,s,e) => `https://www.nontongo.win/embed/tv/${id}/${s}/${e}` },
  { id: 'vidsrcpro',   label: 'VidSrc Pro', flag: '🇺🇸', movie: (id)       => `https://vidsrc.pro/embed/movie/${id}`,                  tv: (id,s,e) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` },
  { id: 'vidsrcxyz',   label: 'VidSrc.xyz', flag: '🇬🇧', movie: (id)       => `https://vidsrc.xyz/embed/movie?tmdb=${id}`,             tv: (id,s,e) => `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}` },
  // Regional / language servers
  { id: 'hindi',       label: 'Hindi',      flag: '🇮🇳', movie: (id)       => `https://vidsrc.to/embed/movie/${id}`,                   tv: (id,s,e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { id: 'tamil',       label: 'Tamil',      flag: '🇮🇳', movie: (id)       => `https://multiembed.mov/?video_id=${id}&tmdb=1`,          tv: (id,s,e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
  { id: 'french',      label: 'French',     flag: '🇫🇷', movie: (id)       => `https://embed.su/embed/movie/${id}`,                    tv: (id,s,e) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
  { id: 'spanish',     label: 'Spanish',    flag: '🇪🇸', movie: (id)       => `https://autoembed.co/movie/tmdb/${id}`,                 tv: (id,s,e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}` },
];

export default function WatchPlayer({ type, id, season, episode, title }) {
  const [active, setActive]     = useState(SERVERS[0].id);
  const [showGrid, setShowGrid] = useState(false);
  const [alert, setAlert]       = useState(true);
  const [loaded, setLoaded]     = useState(false);

  const server = SERVERS.find(s => s.id === active) || SERVERS[0];
  const url    = type === 'movie' ? server.movie(id) : server.tv(id, season, episode);

  // reset loaded state when server changes
  useEffect(() => { setLoaded(false); }, [active]);

  const pick = (sid) => { setActive(sid); setShowGrid(false); };

  return (
    <div className="wp-root">
      {/* ── title bar ── */}
      <div className="wp-titlebar">
        <span className="wp-now">Now Watching: <strong>{title}</strong></span>
      </div>

      {/* ── alert banner ── */}
      {alert && (
        <div className="wp-alert">
          <span>🔔 Please switch to other servers if default server doesn't work.</span>
          <button onClick={() => setAlert(false)} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* ── player area ── */}
      <div className="wp-stage">
        {/* server-select overlay grid */}
        {showGrid && (
          <div className="wp-overlay" onClick={e => e.target === e.currentTarget && setShowGrid(false)}>
            <div className="wp-grid-panel">
              <button className="wp-grid-close" onClick={() => setShowGrid(false)}>✕ Close</button>
              <div className="wp-grid">
                {SERVERS.map(s => (
                  <button
                    key={s.id}
                    className={`wp-server-tile${active === s.id ? ' wp-active' : ''}`}
                    onClick={() => pick(s.id)}
                  >
                    <span className="wp-flag">{s.flag}</span>
                    <span className="wp-slabel">{s.label}</span>
                    {active === s.id && <span className="wp-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* select-server toggle button over player */}
        <button className="wp-select-btn" onClick={() => setShowGrid(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="17" width="18" height="2" rx="1"/></svg>
          Select a server
        </button>

        {/* iframe */}
        <div className="wp-frame">
          <iframe
            key={url}
            src={url}
            title={`Watch ${title}`}
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="origin"
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <div className="wp-loading">
              <div className="wp-spinner" />
            </div>
          )}
        </div>
      </div>

      {/* ── bottom action bar ── */}
      <div className="wp-bar">
        <span className="wp-active-server">{server.flag} {server.label}</span>
        <div className="wp-bar-actions">
          <WatchlistBtn id={id} type={type} title={title} />
          <a className="wp-bar-btn" href={`https://www.imdb.com/find?q=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

// Inline watchlist button (reads localStorage same key as WatchButton.js)
function WatchlistBtn({ id, type, title }) {
  const K = 'blackflix:list';
  const read = () => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; } };
  const [on, setOn] = useState(false);
  useEffect(() => setOn(read().some(x => x.id === id && x.type === type)), [id, type]);
  const toggle = () => {
    const l = read().filter(x => !(x.id === id && x.type === type));
    if (!on) l.unshift({ id, type, title, poster: null });
    localStorage.setItem(K, JSON.stringify(l));
    setOn(!on);
  };
  return (
    <button className={`wp-bar-btn${on ? ' wp-bar-on' : ''}`} onClick={toggle}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
      {on ? 'Watchlisted' : 'Add to Watchlist'}
    </button>
  );
}
