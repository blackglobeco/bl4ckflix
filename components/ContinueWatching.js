'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { img } from '@/lib/tmdb';
import { readHistory, recordWatch as _recordWatch } from '@/lib/history';

// Re-export so WatchPlayer's existing import still works.
export { recordWatch } from '@/lib/history';
export { readHistory } from '@/lib/history';

export default function ContinueWatching() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    setItems(readHistory());
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="row">
      <h2>
        Continue Watching
        <Link href="/continue-watching">View All</Link>
      </h2>
      <div className="strip">
        {items.slice(0, 20).map(i => (
          <Link
            key={`${i.type}-${i.id}`}
            href={`/watch/${i.type}/${i.id}`}
            className="card cw-card"
            title={i.title}
          >
            {i.poster
              ? <img src={img(i.poster)} alt={i.title} loading="lazy" />
              : <span className="ph">{i.title}</span>
            }
            <div className="cw-overlay">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
