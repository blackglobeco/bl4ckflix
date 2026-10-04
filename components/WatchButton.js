'use client';
import { useEffect, useState } from 'react';
import { isInList, toggleItem, readList, writeList } from '@/lib/watchlist';

// Keep legacy named exports so watchlist/page.js `import { read }` still works.
export const read  = readList;
export const write = writeList;

export default function WatchButton({ item }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isInList(item.type || item.media_type, item.id));
  }, [item.id, item.type, item.media_type]);

  const toggle = () => {
    const next = toggleItem(item);
    setOn(next);
  };

  return (
    <button className="btn ghost" onClick={toggle}>
      {on ? 'Remove from watchlist' : 'Add to watchlist'}
    </button>
  );
}
