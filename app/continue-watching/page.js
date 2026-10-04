'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readHistory, removeFromHistory, clearHistory } from '@/lib/history';
import { isInList, toggleItem } from '@/lib/watchlist';

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

/** Individual card — owns its own watchlist toggle state. */
function CWItem({ item, onRemove }) {
  const [onList, setOnList] = useState(false);

  useEffect(() => {
    setOnList(isInList(item.type, item.id));
  }, [item.id, item.type]);

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleItem({
      id:         item.id,
      type:       item.type,
      title:      item.title,
      poster_path: item.poster || null,
    });
    setOnList(next);
  };

  return (
    <div className="cw-item">
      <Link href={`/watch/${item.type}/${item.id}`} className="cw-thumb">
        {item.poster
          ? <img src={`https://image.tmdb.org/t/p/w342${item.poster}`} alt={item.title} loading="lazy" />
          : <span className="ph">{item.title}</span>
        }
        <div className="cw-play-overlay">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div className="cw-time-bar">{timeAgo(item.ts)}</div>
      </Link>

      <button
        className="cw-remove"
        onClick={() => onRemove(item.id, item.type)}
        aria-label="Remove from history"
      >✕</button>

      <button
        className={`cw-wl-btn${onList ? ' cw-wl-btn--on' : ''}`}
        onClick={handleWatchlist}
        aria-label={onList ? 'Remove from watchlist' : 'Add to watchlist'}
        aria-pressed={onList}
        title={onList ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={onList ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>
      </button>
    </div>
  );
}

export default function ContinueWatchingPage() {
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => setItems(readHistory()), []);

  const remove = (id, type) => {
    setItems(removeFromHistory(type, id));
  };

  const clearAll = () => {
    clearHistory();
    setItems([]);
  };

  if (!items) return null;

  const filtered = query.trim()
    ? items.filter(i => i.title?.toLowerCase().includes(query.toLowerCase()))
    : items;

  // Group by calendar date
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Clear All
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="empty">
          {query ? 'No results match your search.' : 'Nothing watched yet. Start watching something!'}
        </p>
      )}

      {groups.map(g => (
        <div key={g.label} className="cw-group">
          <h2 className="cw-date">{g.label}</h2>
          <div className="cw-grid">
            {g.items.map(i => (
              <CWItem key={`${i.type}-${i.id}`} item={i} onRemove={remove} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
