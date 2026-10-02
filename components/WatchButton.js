'use client';
import { useEffect, useState } from 'react';
const K = 'blackflix:list';
export const read = () => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; } };
export const write = (l) => localStorage.setItem(K, JSON.stringify(l));
export default function WatchButton({ item }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(read().some((x) => x.id === item.id && x.type === item.type)), [item.id, item.type]);
  const toggle = () => {
    const l = read().filter((x) => !(x.id === item.id && x.type === item.type));
    if (!on) l.unshift(item);
    write(l); setOn(!on);
  };
  return <button className="btn ghost" onClick={toggle}>{on ? 'Remove from watchlist' : 'Add to watchlist'}</button>;
}
