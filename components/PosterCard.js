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
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState('right');
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => setOn(read().some((x) => x.id === item.id && x.type === t)), [item.id, t]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const l = read().filter((x) => !(x.id === item.id && x.type === t));
    if (!on) l.unshift({ id: item.id, type: t, title, poster: item.poster_path });
    write(l); setOn(!on);
  };

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;
        if (spaceRight < 280 && spaceLeft > spaceRight) setPos('left');
        else setPos('right');
      }
      setHovered(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`pc-wrap${hovered ? ' pc-wrap--hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/${t}/${item.id}`} className="pc" title={title}>
        <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt={title} loading="lazy" />
        <button className="bm" onClick={toggle} aria-label={on ? 'Remove from watchlist' : 'Add to watchlist'} aria-pressed={on}>{on ? '✓' : '+'}</button>
        <div className="pc-badges">
          {item.vote_average > 0 && <span className="badge rate">★ {item.vote_average.toFixed(1)}</span>}
          {year && <span className="badge year">{year}</span>}
          {lang && lang !== 'en' && <span className="badge lang">{lang.toUpperCase()}</span>}
        </div>
      </Link>

      {hovered && (
        <div className={`pc-popup pc-popup--${pos}`}>
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
              {lang && <span className="pc-popup-lang">{lang.toUpperCase()}</span>}
            </div>
            <p className="pc-popup-title">{title}</p>
            {overview && <p className="pc-popup-overview">{overview.length > 120 ? overview.slice(0, 120) + '…' : overview}</p>}
            <div className="pc-popup-actions">
              <Link href={`/watch/${t}/${item.id}`} className="pc-popup-watch" onClick={(e) => e.stopPropagation()}>
                ▶ Watch Now
              </Link>
              <button className={`pc-popup-bm${on ? ' pc-popup-bm--on' : ''}`} onClick={toggle} aria-label={on ? 'Remove from watchlist' : 'Add to watchlist'}>
                {on ? '✓' : '+'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
