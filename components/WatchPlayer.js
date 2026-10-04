'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { recordWatch } from '@/components/ContinueWatching';
import { isInList, toggleItem } from '@/lib/watchlist';

// Flag image helper — flagsapi.com CDN
const flag = (code) => `https://flagsapi.com/${code}/flat/24.png`;

// ── MOVIE SERVERS (extracted from CineHD source) ─────────────────────────────
const MOVIE_SERVERS = [
  { id: 'max',        name: 'Max',       cc: 'US', url: (id) => `https://ythd.org/embed/${id}` },
  { id: 'vidpro',     name: 'Vidpro',    cc: 'GB', url: (id) => `https://vixsrc.to/movie/${id}` },
  { id: 'v2',         name: 'V2',        cc: 'GB', url: (id) => `https://player2.vidplus.pro/embed/movie/${id}?autoplay=true` },
  { id: 'premium',    name: 'Premium',   cc: 'US', url: (id) => `https://player.vidplus.pro/embed/movie/${id}?autoplay=true&download=true` },
  { id: '4k',         name: '4K',        cc: 'GB', url: (id) => `https://player.videasy.to/movie/${id}` },
  { id: 'vidfast',    name: 'Vidfast',   cc: 'GB', url: (id) => `https://vidfast.vc/movie/${id}?autoplay=true` },
  { id: 'nxsha',      name: 'Nxsha',     cc: 'US', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=en&autoplay=true&sub=en` },
  { id: 'super',      name: 'Super',     cc: 'GB', url: (id) => `https://vidsuper.net/movie/${id}` },
  { id: 'vidcore',    name: 'Vidcore',   cc: 'GB', url: (id) => `https://vidcore.net/movie/${id}?autoPlay=true&sub=en` },
  { id: 'rock',       name: 'Rock',      cc: 'GB', url: (id) => `https://vidrock.net/embed/movie/${id}?autoplay=true` },
  { id: 'primesrc',   name: 'Primesrc',  cc: 'AU', url: (id) => `https://primesrc.me/embed/movie?imdb=${id}` },
  { id: '2embed',     name: '2Embed',    cc: 'AU', url: (id) => `https://2embed.stream/embed/movie/${id}` },
  { id: 'cinemaos',   name: 'Cinemaos',  cc: 'US', url: (id) => `https://cinemaos.tech/player/${id}` },
  { id: 'prime',      name: 'Prime',     cc: 'US', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=en&autoplay=true&one_server=true&server=OrVid-[Multi-Lang]` },
  { id: 'netflix',    name: 'Netflix',   cc: 'US', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=en&autoplay=true&one_server=true&server=ZetPly-[Multi-Lang]` },
  { id: 'hotstar',    name: 'Hotstar',   cc: 'US', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=en&autoplay=true&one_server=true&server=QsPly-[Multi-Lang]` },
  { id: 'vidnest',    name: 'Vidnest',   cc: 'GB', url: (id) => `https://vidnest.fun/movie/${id}` },
  { id: 'tongo',      name: 'Tongo',     cc: 'US', url: (id) => `https://www.NontonGo.win/embed/movie/${id}` },
  { id: 'echo',       name: 'Echo',      cc: 'US', url: (id) => `https://vidlink.pro/movie/${id}?primaryColor=white&secondaryColor=white&iconColor=white&title=false&poster=true&autoplay=true` },
  { id: 'nhd',        name: 'NHD',       cc: 'IN', url: (id) => `https://nhdapi.com/embed/movie/${id}?autoplay=true&autonext=true&audio=true&title=true&download=true` },
  { id: 'mplay',      name: 'Mplay',     cc: 'IN', url: (id) => `https://rozgarlelo.modiplay.xyz/embed/tmdb/movie?id=${id}` },
  { id: 'xpass',      name: 'Xpass',     cc: 'US', url: (id) => `https://play.xpass.top/e/movie/${id}` },
  { id: 'bravo',      name: 'Bravo',     cc: 'GB', url: (id) => `https://moviesapi.to/movie/${id}` },
  { id: 'vidking',    name: 'Vidking',   cc: 'US', url: (id) => `https://www.vidking.net/embed/movie/${id}?autoplay=true` },
  { id: '111',        name: '111',       cc: 'GB', url: (id) => `https://111movies.net/movie/${id}` },
  { id: 'jade',       name: 'Jade',      cc: 'PT', url: (id) => `https://superflixapi.lifestyle/filme/${id}` },
  { id: 'french',     name: 'French',    cc: 'FR', url: (id) => `https://frembed.hair/api/film.php?id=${id}` },
  { id: 'spanish',    name: 'Spanish',   cc: 'ES', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=es&autoplay=true&sub=es` },
  { id: 'hindi',      name: 'Hindi',     cc: 'IN', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=hindi&autoplay=true` },
  { id: 'tamil',      name: 'Tamil',     cc: 'IN', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=tamil&autoplay=true` },
  { id: 'telugu',     name: 'Telugu',    cc: 'IN', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=telugu&autoplay=true` },
  { id: 'arab',       name: 'Arab',      cc: 'SA', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=ar&autoplay=true&sub=ar` },
  { id: 'french2',    name: 'French 2',  cc: 'FR', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=fr&autoplay=true&sub=fr` },
  { id: 'brazil',     name: 'Brazil',    cc: 'BR', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=pt&autoplay=true&sub=pt` },
  { id: 'rus',        name: 'Rus',       cc: 'RU', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=ru&autoplay=true&sub=ru` },
  { id: 'german',     name: 'German',    cc: 'DE', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=de&autoplay=true&sub=de` },
  { id: 'italy',      name: 'Italy',     cc: 'IT', url: (id) => `https://vixsrc.to/movie/${id}?lang=it` },
  { id: 'italy2',     name: 'Italy 2',   cc: 'IT', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=it&autoplay=true&sub=it` },
  { id: 'japan',      name: 'Japan',     cc: 'JP', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=ja&autoplay=true&sub=ja` },
  { id: 'polish',     name: 'Polish',    cc: 'PL', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=pl&autoplay=true&sub=pl` },
  { id: 'thai',       name: 'Thai',      cc: 'TH', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=th&autoplay=true&sub=th` },
  { id: 'turkish',    name: 'Turkish',   cc: 'TR', url: (id) => `https://nxsha.space/embed/movie/${id}?lang=tr&autoplay=true&sub=tr` },
  { id: 'rive',       name: 'Rive',      cc: 'GB', url: (id) => `https://www.rivestream.app/embed?type=movie&id=${id}` },
  { id: 'flicky',     name: 'Flicky',    cc: 'IN', url: (id) => `https://flicky.host/embed/movie/?id=${id}` },
  { id: 'peachify',   name: 'Peachify',  cc: 'US', url: (id) => `https://peachify.top/embed/movie/${id}?autoplay=true&sub=English` },
];

// ── TV SERVERS ────────────────────────────────────────────────────────────────
const TV_SERVERS = [
  { id: 'max',        name: 'Max',       cc: 'US', url: (id,s,e) => `https://ythd.org/embed/${id}/${s}-${e}` },
  { id: 'vidpro',     name: 'Vidpro',    cc: 'GB', url: (id,s,e) => `https://vixsrc.to/tv/${id}/${s}/${e}` },
  { id: 'v2',         name: 'V2',        cc: 'GB', url: (id,s,e) => `https://player2.vidplus.pro/embed/tv/${id}/${s}/${e}?autoplay=true` },
  { id: 'premium',    name: 'Premium',   cc: 'US', url: (id,s,e) => `https://player.vidplus.pro/embed/tv/${id}/${s}/${e}?autoplay=true&autonext=true&nextbutton=true&poster=true&download=true` },
  { id: '4k',         name: '4K',        cc: 'GB', url: (id,s,e) => `https://player.videasy.to/tv/${id}/${s}/${e}` },
  { id: 'vidfast',    name: 'Vidfast',   cc: 'GB', url: (id,s,e) => `https://vidfast.vc/tv/${id}/${s}/${e}?autoplay=true` },
  { id: 'nxsha',      name: 'Nxsha',     cc: 'US', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=en&autoplay=true&sub=en` },
  { id: 'super',      name: 'Super',     cc: 'GB', url: (id,s,e) => `https://vidsuper.net/tv/${id}/${s}/${e}` },
  { id: 'vidcore',    name: 'Vidcore',   cc: 'GB', url: (id,s,e) => `https://vidcore.net/tv/${id}/${s}/${e}?autoPlay=true&sub=en` },
  { id: 'rock',       name: 'Rock',      cc: 'GB', url: (id,s,e) => `https://vidrock.net/embed/tv/${id}/${s}/${e}?autoplay=true&nextbutton=false&episodeselector=false` },
  { id: 'primesrc',   name: 'Primesrc',  cc: 'AU', url: (id,s,e) => `https://primesrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}` },
  { id: '2embed',     name: '2Embed',    cc: 'AU', url: (id,s,e) => `https://www.2embed.stream/embed/tv/${id}/${s}/${e}` },
  { id: 'cinemaos',   name: 'Cinemaos',  cc: 'US', url: (id,s,e) => `https://cinemaos.tech/player/${id}/${s}/${e}` },
  { id: 'prime',      name: 'Prime',     cc: 'US', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=en&autoplay=true&one_server=true&server=OrVid-[Multi-Lang]` },
  { id: 'netflix',    name: 'Netflix',   cc: 'US', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=en&autoplay=true&one_server=true&server=ZetPly-[Multi-Lang]` },
  { id: 'hotstar',    name: 'Hotstar',   cc: 'US', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=en&autoplay=true&one_server=true&server=QsPly-[Multi-Lang]` },
  { id: 'vidnest',    name: 'Vidnest',   cc: 'GB', url: (id,s,e) => `https://vidnest.fun/tv/${id}/${s}/${e}` },
  { id: 'tongo',      name: 'Tongo',     cc: 'US', url: (id,s,e) => `https://www.NontonGo.win/embed/tv/${id}/${s}/${e}` },
  { id: 'echo',       name: 'Echo',      cc: 'US', url: (id,s,e) => `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=white&secondaryColor=white&iconColor=white&title=false&poster=true&autoplay=true` },
  { id: 'nhd',        name: 'NHD',       cc: 'IN', url: (id,s,e) => `https://nhdapi.com/embed/tv/${id}/${s}/${e}?autoplay=true&autonext=true&audio=true&title=true&download=true` },
  { id: 'mplay',      name: 'Mplay',     cc: 'IN', url: (id,s,e) => `https://rozgarlelo.modiplay.xyz/embed/tmdb/tv?id=${id}&s=${s}&e=${e}` },
  { id: 'xpass',      name: 'Xpass',     cc: 'US', url: (id,s,e) => `https://play.xpass.top/e/tv/${id}/${s}/${e}` },
  { id: 'bravo',      name: 'Bravo',     cc: 'GB', url: (id,s,e) => `https://moviesapi.to/tv/${id}/${s}/${e}` },
  { id: 'vidking',    name: 'Vidking',   cc: 'US', url: (id,s,e) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}?autoplay=true&episodeSelector=true` },
  { id: '111',        name: '111',       cc: 'GB', url: (id,s,e) => `https://111movies.net/tv/${id}/${s}/${e}` },
  { id: 'jade',       name: 'Jade',      cc: 'PT', url: (id,s,e) => `https://superflixapi.lifestyle/serie/${id}/${s}/${e}` },
  { id: 'french',     name: 'French',    cc: 'FR', url: (id,s,e) => `https://frembed.hair/api/serie.php?id=${id}&sa=${s}&epi=${e}` },
  { id: 'spanish',    name: 'Spanish',   cc: 'ES', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=es&autoplay=true&sub=es` },
  { id: 'hindi',      name: 'Hindi',     cc: 'IN', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=hindi&autoplay=true` },
  { id: 'tamil',      name: 'Tamil',     cc: 'IN', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=tamil&autoplay=true` },
  { id: 'telugu',     name: 'Telugu',    cc: 'IN', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=telugu&autoplay=true` },
  { id: 'arab',       name: 'Arab',      cc: 'SA', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=ar&autoplay=true&sub=ar` },
  { id: 'french2',    name: 'French 2',  cc: 'FR', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=fr&autoplay=true&sub=fr` },
  { id: 'brazil',     name: 'Brazil',    cc: 'BR', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=pt&autoplay=true&sub=pt` },
  { id: 'rus',        name: 'Rus',       cc: 'RU', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=ru&autoplay=true&sub=ru` },
  { id: 'german',     name: 'German',    cc: 'DE', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=de&autoplay=true&sub=de` },
  { id: 'italy',      name: 'Italy',     cc: 'IT', url: (id,s,e) => `https://vixsrc.to/tv/${id}/${s}/${e}?lang=it` },
  { id: 'italy2',     name: 'Italy 2',   cc: 'IT', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=it&autoplay=true&sub=it` },
  { id: 'japan',      name: 'Japan',     cc: 'JP', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=ja&autoplay=true&sub=ja` },
  { id: 'polish',     name: 'Polish',    cc: 'PL', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=pl&autoplay=true&sub=pl` },
  { id: 'thai',       name: 'Thai',      cc: 'TH', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=th&autoplay=true&sub=th` },
  { id: 'turkish',    name: 'Turkish',   cc: 'TR', url: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?lang=tr&autoplay=true&sub=tr` },
  { id: 'rive',       name: 'Rive',      cc: 'GB', url: (id,s,e) => `https://www.rivestream.app/embed?type=tv&id=${id}&season=${s}&episode=${e}` },
  { id: 'flicky',     name: 'Flicky',    cc: 'IN', url: (id,s,e) => `https://flicky.host/embed/tv/?id=${id}/${s}/${e}` },
  { id: 'peachify',   name: 'Peachify',  cc: 'US', url: (id,s,e) => `https://peachify.top/embed/tv/${id}/${s}/${e}?autoplay=true&sub=English` },
];

// Auto-next localStorage key
const AN = 'blackflix:autonext';
const readAutoNext = () => { try { return JSON.parse(localStorage.getItem(AN) || 'true'); } catch { return true; } };

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'a2359193b290a3bc03ecf35b7eb907ff';
async function fetchSeasonEpisodeCount(showId, s) {
  try {
    const r = await fetch(`https://api.themoviedb.org/3/tv/${showId}/season/${s}?api_key=${TMDB_KEY}`);
    const d = r.ok ? await r.json() : null;
    return d?.episodes?.length || null;
  } catch { return null; }
}

export default function WatchPlayer({ type, id, season, episode, title, poster, totalSeasons, backdropPath, voteAverage, releaseDate, firstAirDate, originalLanguage, overview }) {
  const router  = useRouter();
  const servers = type === 'movie' ? MOVIE_SERVERS : TV_SERVERS;

  const [active, setActive]         = useState(servers[0].id);
  const [showGrid, setShowGrid]     = useState(false);
  const [alert, setAlert]           = useState(true);
  const [loaded, setLoaded]         = useState(false);
  const [onList, setOnList]         = useState(false);
  const [autoNext, setAutoNext]     = useState(true);
  const [totalEps, setTotalEps]     = useState(null);   // episodes in current season
  const [countdown, setCountdown]   = useState(null);   // null | number (5→0)
  const countdownRef = useRef(null);
  const iframeRef    = useRef(null);

  const curSeason  = Number(season)  || 1;
  const curEpisode = Number(episode) || 1;
  const isTV       = type === 'tv';

  // Derive next destination
  const hasNext = isTV && totalEps !== null
    ? (curEpisode < totalEps) || (curSeason < (totalSeasons || 1))
    : false;

  const nextHref = useCallback(() => {
    if (!isTV) return null;
    if (totalEps !== null && curEpisode < totalEps) {
      return `/watch/${type}/${id}?s=${curSeason}&e=${curEpisode + 1}`;
    }
    if (curSeason < (totalSeasons || 1)) {
      return `/watch/${type}/${id}?s=${curSeason + 1}&e=1`;
    }
    return null;
  }, [isTV, type, id, curSeason, curEpisode, totalEps, totalSeasons]);

  const goNext = useCallback(() => {
    const href = nextHref();
    if (href) router.push(href);
  }, [nextHref, router]);

  // Cancel auto-next countdown
  const cancelCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
  };

  // Start 5-second countdown then navigate
  const startCountdown = useCallback(() => {
    cancelCountdown();
    setCountdown(5);
    let t = 5;
    countdownRef.current = setInterval(() => {
      t -= 1;
      setCountdown(t);
      if (t <= 0) {
        clearInterval(countdownRef.current);
        setCountdown(null);
        goNext();
      }
    }, 1000);
  }, [goNext]);

  // Listen for postMessage from embedded player signalling video end
  useEffect(() => {
    if (!isTV) return;
    const handler = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        const isEnd =
          data?.event === 'ended' ||
          data?.event === 'end'   ||
          data?.type  === 'ended' ||
          data?.action === 'ended'||
          data === 'ended';
        if (isEnd && autoNext && nextHref()) {
          startCountdown();
        }
      } catch {}
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [isTV, autoNext, nextHref, startCountdown]);

  // Fetch episode count for current season
  useEffect(() => {
    if (!isTV) return;
    fetchSeasonEpisodeCount(id, curSeason).then(setTotalEps);
  }, [isTV, id, curSeason]);

  // Hydrate auto-next from localStorage
  useEffect(() => { setAutoNext(readAutoNext()); }, []);

  const toggleAutoNext = () => {
    const next = !autoNext;
    setAutoNext(next);
    localStorage.setItem(AN, JSON.stringify(next));
    if (!next) cancelCountdown();
  };

  useEffect(() => setOnList(isInList(type, id)), [id, type]);
  useEffect(() => { setLoaded(false); }, [active]);
  // Cancel countdown when episode changes
  useEffect(() => { cancelCountdown(); }, [curSeason, curEpisode]);
  useEffect(() => {
    // Record this title in Continue Watching history
    recordWatch({ id, type, title, poster: poster || null });
  }, [id, type, title]);

  const server = servers.find(s => s.id === active) || servers[0];
  const src    = type === 'movie' ? server.url(id) : server.url(id, season, episode);

  const pick = (sid) => { setActive(sid); setShowGrid(false); };

  const toggleList = () => {
    const next = toggleItem({
      id,
      type,
      title,
      poster_path:        poster           || null,
      backdrop_path:      backdropPath     || null,
      vote_average:       voteAverage      || 0,
      release_date:       releaseDate      || '',
      first_air_date:     firstAirDate     || '',
      original_language:  originalLanguage || '',
      overview:           overview         || '',
    });
    setOnList(next);
  };

  return (
    <div className="wp-root">
      {/* title bar */}
      <div className="wp-titlebar">
        <span>Now Watching: <strong>{title}</strong></span>
      </div>

      {/* alert */}
      {alert && (
        <div className="wp-alert">
          <span>Please switch to other servers if default server doesn&apos;t work.</span>
          <button onClick={() => setAlert(false)} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* player area */}
      <div className="wp-stage">

        {/* server grid overlay — CineHD style */}
        {showGrid && (
          <div className="wp-overlay" onClick={e => e.target === e.currentTarget && setShowGrid(false)}>
            <div className="wp-grid-panel">
              <button className="wp-grid-close" onClick={() => setShowGrid(false)}>
                ✕ Close
              </button>
              <div className="wp-server-grid">
                {servers.map(s => (
                  <button
                    key={s.id}
                    className={`wp-server-tile${active === s.id ? ' wp-tile-active' : ''}`}
                    onClick={() => pick(s.id)}
                  >
                    {/* drag dots (visual only, matches CineHD style) */}
                    <span className="wp-drag-dots">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                        <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2m-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"/>
                      </svg>
                    </span>
                    {/* flag */}
                    <img
                      src={flag(s.cc)}
                      alt={s.cc}
                      className="wp-tile-flag"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span className="wp-tile-name">{s.name}</span>
                    {active === s.id && (
                      <span className="wp-tile-check">
                        <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* select server button floating over player */}
        <button className="wp-select-btn" onClick={() => setShowGrid(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="18" height="2" rx="1"/>
            <rect x="3" y="11" width="18" height="2" rx="1"/>
            <rect x="3" y="17" width="18" height="2" rx="1"/>
          </svg>
          Select a server
        </button>

        {/* iframe */}
        <div className="wp-frame">
          <iframe
            ref={iframeRef}
            key={src}
            src={src}
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

        {/* Auto-next countdown overlay */}
        {countdown !== null && (
          <div className="wp-autonext-overlay">
            <div className="wp-autonext-box">
              <p className="wp-autonext-label">Next episode in</p>
              <div className="wp-autonext-ring">
                <svg viewBox="0 0 44 44" className="wp-autonext-svg">
                  <circle cx="22" cy="22" r="18" className="wp-ring-bg" />
                  <circle
                    cx="22" cy="22" r="18"
                    className="wp-ring-fill"
                    strokeDasharray={`${(2 * Math.PI * 18).toFixed(2)}`}
                    strokeDashoffset={`${((1 - countdown / 5) * 2 * Math.PI * 18).toFixed(2)}`}
                  />
                </svg>
                <span className="wp-autonext-num">{countdown}</span>
              </div>
              <div className="wp-autonext-btns">
                <button className="wp-bar-btn" onClick={goNext}>▶▶ Next Now</button>
                <button className="wp-bar-btn" onClick={cancelCountdown}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* bottom bar */}
      <div className="wp-bar">
        <span className="wp-active-label">
          <img src={flag(server.cc)} alt={server.cc} className="wp-bar-flag" onError={e => { e.currentTarget.style.display='none'; }} />
          {server.name}
        </span>
        <div className="wp-bar-actions">
          {/* Next episode — TV only */}
          {isTV && hasNext && (
            <button className="wp-bar-btn wp-bar-next" onClick={goNext} title="Next episode">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 4 15 12 5 20 5 4"/>
                <rect x="16" y="4" width="3" height="16" rx="1"/>
              </svg>
              Next
            </button>
          )}

          {/* Auto Next toggle — TV only */}
          {isTV && (
            <button
              className={`wp-bar-btn wp-bar-autonext${autoNext ? ' wp-bar-on' : ''}`}
              onClick={toggleAutoNext}
              title={autoNext ? 'Auto Next: On' : 'Auto Next: Off'}
            >
              <span className={`wp-toggle${autoNext ? ' wp-toggle--on' : ''}`} aria-hidden="true">
                <span className="wp-toggle-knob" />
              </span>
              Auto Next
            </button>
          )}

          {/* Watchlist */}
          <button className={`wp-bar-btn${onList ? ' wp-bar-on' : ''}`} onClick={toggleList}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={onList ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            {onList ? 'Watchlisted' : 'Add to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  );
}
