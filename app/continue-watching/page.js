'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readHistory } from '@/components/ContinueWatching';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m || 1} minute${m !== 1 ? 's' : ''} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h !== 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d !== 1 ? 's' : ''} ago`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function ContinueWatchingPage() {
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => setItems(readHistory()), []);

  const remove = (id, type) => {
    setItems(prev => {
      const next = prev.filter(x => !(x.id === id && x.type === type));
      try { localStorage.setItem('blackflix:history', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clearAll = () => {
    setItems([]);
    try { localStorage.removeItem('blackflix:history'); } catch {}
  };

  if (!items) return null;

  const filtered = query.trim()
    ? items.filter(i => i.title?.toLowerCase().includes(query.toLowerCase()))
    : items;

  // Group by date
  const groups = [];
  const seen = new Set();
  filtered.forEach(i => {
    const label = formatDate(i.ts);
    if (!seen.has(label)) { seen.add(label); groups.push({ label, items: [] }); }
    groups[groups.length - 1].items.push(i);
  });

  return (
    <div className="page cw-page">
      <div className="cw-topbar">
        <input
          className="cw-search"
          placeholder="Search Continue Watching..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {items.length > 0 && (
          <button className="cw-clear-all" onClick={clearAll}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            Clear All
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="empty">{query ? 'No results match your search.' : 'Nothing watched yet. Start watching something!'}</p>
      )}

      {groups.map(g => (
        <div key={g.label} className="cw-group">
          <h2 className="cw-date">{g.label}</h2>
          <div className="cw-grid">
            {g.items.map(i => (
              <div key={i.type + i.id} className="cw-item">
                <Link href={`/watch/${i.type}/${i.id}`} className="cw-thumb">
                  {i.poster
                    ? <img src={`https://image.tmdb.org/t/p/w342${i.poster}`} alt={i.title} loading="lazy" />
                    : <span className="ph">{i.title}</span>
                  }
                  <div className="cw-play-overlay">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div className="cw-time-bar">{timeAgo(i.ts)}</div>
                </Link>
                <button className="cw-remove" onClick={() => remove(i.id, i.type)} aria-label="Remove">✕</button>
                <button className="cw-wl-btn" aria-label="Watchlist">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
