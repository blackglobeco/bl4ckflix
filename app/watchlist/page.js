'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { read } from '@/components/WatchButton';
export default function Watchlist() {
  const [l, setL] = useState(null);
  useEffect(() => setL(read()), []);
  return (
    <div className="page">
      <h1>Watchlist</h1>
      {l && !l.length && <p className="empty">Nothing saved yet. Open a title and choose Add to watchlist.</p>}
      <div className="grid">
        {(l || []).map((i) => (
          <Link key={i.type + i.id} href={`/${i.type}/${i.id}`} className="card">
            {i.poster ? <img src={`https://image.tmdb.org/t/p/w342${i.poster}`} alt={i.title} /> : <span className="ph">{i.title}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
