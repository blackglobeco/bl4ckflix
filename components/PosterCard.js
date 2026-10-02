'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { read, write } from '@/components/WatchButton';
export default function PosterCard({ item, type }) {
  const t = item.media_type || type;
  const title = item.title || item.name;
  const [on, setOn] = useState(false);
  useEffect(() => setOn(read().some((x) => x.id === item.id && x.type === t)), [item.id, t]);
  const toggle = (e) => {
    e.preventDefault();
    const l = read().filter((x) => !(x.id === item.id && x.type === t));
    if (!on) l.unshift({ id: item.id, type: t, title, poster: item.poster_path });
    write(l); setOn(!on);
  };
  return (
    <Link href={`/${t}/${item.id}`} className="pc" title={title}>
      <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt={title} loading="lazy" />
      <button className="bm" onClick={toggle} aria-label={on ? 'Remove from watchlist' : 'Add to watchlist'} aria-pressed={on}>{on ? '✓' : '+'}</button>
      {item.vote_average > 0 && <span className="rate">★ {item.vote_average.toFixed(1)}</span>}
    </Link>
  );
}
