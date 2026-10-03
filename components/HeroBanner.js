'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function HeroBanner({ items = [] }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const go = useCallback((next) => {
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 350);
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setTimeout(() => go((idx + 1) % items.length), 7000);
    return () => clearTimeout(t);
  }, [idx, items.length, go]);

  if (!items.length) return null;
  const h = items[idx];
  const type = h.media_type || (h.title ? 'movie' : 'tv');
  const title = h.title || h.name;
  const year = (h.release_date || h.first_air_date || '').slice(0, 4);

  return (
    <div className="hero-carousel">
      {/* backdrop */}
      <div
        className={`hc-backdrop${fading ? ' hc-fade' : ''}`}
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${h.backdrop_path})` }}
      />
      {/* gradient layers */}
      <div className="hc-grad-bottom" />
      <div className="hc-grad-left" />

      {/* content */}
      <div className={`hc-content${fading ? ' hc-fade' : ''}`}>
        {/* title logo or text */}
        <div className="hc-title-wrap">
          <span className="hc-title">{title}</span>
        </div>

        <div className="hc-meta">
          <span className="hc-badge hc-badge-type">{type === 'movie' ? 'Movie' : 'TV'}</span>
          {h.vote_average > 0 && (
            <span className="hc-badge hc-badge-rate">★ {h.vote_average.toFixed(1)}</span>
          )}
          {year && <span className="hc-year">{year}</span>}
        </div>

        <p className="hc-overview">{h.overview}</p>

        <div className="hc-actions">
          <Link href={`/watch/${type}/${h.id}`} className="hc-btn hc-btn-play">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Play
          </Link>
          <Link href={`/${type}/${h.id}`} className="hc-btn hc-btn-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8" strokeLinecap="round"/><line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round"/></svg>
            See More
          </Link>
        </div>
      </div>

      {/* dot indicators */}
      <div className="hc-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`hc-dot${i === idx ? ' hc-dot-active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* prev / next arrows */}
      <button className="hc-arrow hc-arrow-prev" onClick={() => go((idx - 1 + items.length) % items.length)} aria-label="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button className="hc-arrow hc-arrow-next" onClick={() => go((idx + 1) % items.length)} aria-label="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}
