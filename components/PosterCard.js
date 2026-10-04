'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { read, write } from '@/components/WatchButton';

export default function PosterCard({ item, type }) {
  const t = item.media_type || type;
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const lang = item.original_language;
  const overview = item.overview || '';
  const [on, setOn] = useState(false);
  const [popup, setPopup] = useState(null); // {top, left, side}
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => setOn(read().some((x) => x.id === item.id && x.type === t)), [item.id, t]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const l = read().filter((x) => !(x.id === item.id && x.type === t));
    if (!on) l.unshift({ ...item, type: t, media_type: t });
    write(l); setOn(!on);
  };

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      if (!cardRef.current) return;
      const r = cardRef.current.getBoundingClientRect();
      const POPUP_W = 270;
      const mid = r.top + r.height / 2;
      const spaceRight = window.innerWidth - r.right;
      const side = spaceRight >= POPUP_W + 12 ? 'right' : 'left';
      const left = side === 'right' ? r.right + 10 : r.left - POPUP_W - 10;
      // clamp vertically
      const POPUP_H = 320;
      let top = mid - POPUP_H / 2;
      top = Math.max(8, Math.min(top, window.innerHeight - POPUP_H - 8));
      setPopup({ top, left, side });
    }, 280);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setPopup(null);
  };

  return (
    <div
      ref={cardRef}
      className={`pc-wrap${popup ? ' pc-wrap--hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/${t}/${item.id}`} className="pc" title={title}>
        <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt={title} loading="lazy" />
        <button className="bm" onClick={toggle} aria-label={on ? 'Remove from watchlist' : 'Add to watchlist'} aria-pressed={on}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
        </button>
        <div className="pc-badges">
          {item.vote_average > 0 && <span className="badge rate">★ {item.vote_average.toFixed(1)}</span>}
          {year && <span className="badge year">{year}</span>}
          {lang && lang !== 'en' && <span className="badge lang">{lang.toUpperCase()}</span>}
        </div>
      </Link>

      {popup && (
        <div
          className="pc-popup"
          style={{ position: 'fixed', top: popup.top, left: popup.left, width: 270 }}
          onMouseEnter={() => clearTimeout(timerRef.current)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="pc-popup-inner">
            {item.backdrop_path && (
              <div className="pc-popup-banner">
                <img src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`} alt="" />
              </div>
            )}
            <div className="pc-popup-meta">
              <span className="pc-popup-type">{t === 'movie' ? 'Movie' : 'TV Show'}</span>
              {item.vote_average > 0 && <span className="pc-popup-rating">★ {item.vote_average.toFixed(1)}</span>}
              {year && <span className="pc-popup-year">🗓 {year}</span>}
              {lang && lang !== 'en' && <span className="pc-popup-lang">{lang.toUpperCase()}</span>}
            </div>
            <p className="pc-popup-title">{title}</p>
            {overview && <p className="pc-popup-overview">{overview.length > 120 ? overview.slice(0, 120) + '…' : overview}</p>}
            <div className="pc-popup-actions">
              <Link href={`/watch/${t}/${item.id}`} className="pc-popup-watch" onClick={(e) => e.stopPropagation()}>
                ▶ Watch Now
              </Link>
              <button className={`pc-popup-bm${on ? ' pc-popup-bm--on' : ''}`} onClick={toggle} aria-label={on ? 'Remove from watchlist' : 'Add to watchlist'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
