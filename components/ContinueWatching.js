'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { img } from '@/lib/tmdb';

const HISTORY_KEY = 'blackflix:history';

// Called from WatchPlayer on load — exported so WatchPlayer can import it
export function recordWatch({ id, type, title, poster }) {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const filtered = raw.filter(x => !(x.id === id && x.type === type));
    filtered.unshift({ id, type, title, poster, ts: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 40)));
  } catch {}
}

export function readHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

export default function ContinueWatching() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    setItems(readHistory());
  }, []);

  // Don't render anything server-side or if history is empty
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
            key={i.type + i.id}
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
