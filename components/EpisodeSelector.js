'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'a2359193b290a3bc03ecf35b7eb907ff';
const imgUrl = (p, s = 'w300') => p ? `https://image.tmdb.org/t/p/${s}${p}` : null;

async function fetchSeason(showId, season) {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/tv/${showId}/season/${season}?api_key=${TMDB_KEY}`
    );
    return r.ok ? r.json() : null;
  } catch { return null; }
}

export default function EpisodeSelector({ id, type, seasons, currentSeason, currentEpisode }) {
  const router = useRouter();
  const [season, setSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchSeason(id, season).then(data => {
      setEpisodes(data?.episodes || []);
      setLoading(false);
    });
  }, [id, season]);

  // scroll active episode into view
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [episodes]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => dropRef.current && !dropRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const changeSeason = (s) => {
    setSeason(s);
    setOpen(false);
    router.push(`/watch/${type}/${id}?s=${s}&e=1`);
  };

  const changeEpisode = (e) => {
    router.push(`/watch/${type}/${id}?s=${season}&e=${e}`);
  };

  const isActive = (ep) => ep.season_number === Number(season) && ep.episode_number === Number(currentEpisode);

  return (
    <div className="eps-root page">
      <div className="eps-header">
        <h2>Episodes</h2>
        {/* Season dropdown */}
        <div className="eps-season-wrap" ref={dropRef}>
          <button
            className="eps-season-btn"
            onClick={() => setOpen(v => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            Season {season}
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 8l5 5 5-5" />
            </svg>
          </button>
          {open && (
            <ul className="eps-season-list" role="listbox">
              {Array.from({ length: seasons }, (_, i) => i + 1).map(s => (
                <li key={s} role="option" aria-selected={s === season}>
                  <button
                    className={s === season ? 'eps-season-opt eps-season-opt--active' : 'eps-season-opt'}
                    onClick={() => changeSeason(s)}
                  >
                    Season {s}
                    {s === season && (
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Episode list */}
      <div className="eps-list">
        {loading ? (
          <div className="eps-loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="eps-skeleton" />
            ))}
          </div>
        ) : episodes.map(ep => {
          const active = isActive(ep);
          return (
            <button
              key={ep.episode_number}
              ref={active ? activeRef : null}
              className={`eps-card${active ? ' eps-card--active' : ''}`}
              onClick={() => changeEpisode(ep.episode_number)}
            >
              {/* Number */}
              <span className="eps-num">{ep.episode_number}</span>

              {/* Thumbnail */}
              <div className="eps-thumb">
                {imgUrl(ep.still_path) ? (
                  <img src={imgUrl(ep.still_path)} alt={ep.name} loading="lazy" />
                ) : (
                  <div className="eps-thumb-blank">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".4">
                      <rect x="2" y="7" width="20" height="15" rx="2" /><polyline points="17 2 12 7 7 2" />
                    </svg>
                  </div>
                )}
                {active && (
                  <div className="eps-play-over">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="eps-info">
                <span className="eps-title">{ep.name}</span>
                {ep.runtime && <span className="eps-runtime">{ep.runtime} min</span>}
                {ep.overview && <p className="eps-overview">{ep.overview}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
