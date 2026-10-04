'use client';
import { useEffect, useState } from 'react';
import PosterCard from '@/components/PosterCard';
import { read } from '@/components/WatchButton';

export default function Watchlist() {
  const [items, setItems] = useState(null);
  useEffect(() => setItems(read()), []);

  return (
    <div className="page">
      <h1>Watchlist</h1>
      {items === null && <p className="empty">Loading…</p>}
      {items && !items.length && (
        <p className="empty">Nothing saved yet. Open a title and choose Add to watchlist.</p>
      )}
      {items && items.length > 0 && (
        <div className="pgrid">
          {items.map(i => (
            <div key={(i.media_type || i.type) + i.id} className="strip-item">
              <PosterCard item={i} type={i.media_type || i.type} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
