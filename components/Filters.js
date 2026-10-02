'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const TYPES = [['movie', 'Movies'], ['tv', 'TV Shows'], ['anime', 'Anime'], ['drama', 'Drama']];
const SORTS = [['top', 'Top Rated'], ['az', 'Title A-Z'], ['za', 'Title Z-A'], ['latest', 'Latest Release'], ['oldest', 'Oldest Release'], ['revenue', 'Revenue'], ['votes', 'Most Voted']];
const RATINGS = [9, 8, 7, 6, 5, 4].map((n) => [String(n), `${n}+ ⭐`]);
const NOW = new Date().getFullYear();
const YEARS = Array.from({ length: NOW - 1899 }, (_, i) => String(NOW - i)).map((y) => [y, y]);

function Dropdown({ label, allLabel, value, options, searchable, onChange }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    const out = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', out);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc); };
  }, []);
  const all = [['', allLabel || label], ...options];
  const cur = options.find(([v]) => v === value);
  const shown = all.filter(([, n]) => n.toLowerCase().includes(f.toLowerCase()));
  return (
    <div className="dd" ref={ref}>
      <button type="button" className="ddb" aria-haspopup="listbox" aria-expanded={open} onClick={() => { setOpen(!open); setF(''); }}>
        <span>{cur ? cur[1] : label}</span>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>
      </button>
      {open && (
        <div className="ddp">
          {searchable && <input className="dds" autoFocus value={f} onChange={(e) => setF(e.target.value)} placeholder={`Search ${label.toLowerCase()}...`} aria-label={`Search ${label}`} />}
          <ul role="listbox">
            {shown.map(([v, n]) => (
              <li key={v || 'all'} role="option" aria-selected={v === value}>
                <button type="button" onClick={() => { onChange(v); setOpen(false); }}>
                  <span className="ck">{v === value ? '✓' : ''}</span>{n}
                </button>
              </li>
            ))}
            {!shown.length && <li className="none">No matches</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Filters({ genres = [], providers = [], countries = [] }) {
  const r = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const go = (k, v) => {
    const p = new URLSearchParams(sp.toString());
    v ? p.set(k, v) : p.delete(k);
    if (k === 'type') p.delete('genre');
    p.delete('page');
    r.push(`/search?${p}`);
  };
  const g = (k) => sp.get(k) || '';
  const dd = (k, label, allLabel, options, searchable) => (
    <Dropdown label={label} allLabel={allLabel} value={g(k)} options={options} searchable={searchable} onChange={(v) => go(k, v)} />
  );
  return (
    <div className="fwrap">
      <form onSubmit={(e) => { e.preventDefault(); go('q', q.trim()); }}>
        <input className="sbar" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." aria-label="Search titles" />
      </form>
      <div className="fbar">
        {dd('type', 'Type', 'Type', TYPES)}
        {dd('genre', 'Genre', 'All Genres', genres.map((x) => [String(x.id), x.name]), true)}
        {dd('sort', 'Popular', 'Popular', SORTS)}
        {dd('year', 'Year', 'Year', YEARS, true)}
        {dd('provider', 'Network', 'All Networks', providers.map((p) => [String(p.provider_id), p.provider_name]), true)}
        {dd('country', 'Country', 'Country', countries.map((c) => [c.iso_3166_1, c.english_name]), true)}
        {dd('rating', 'Ratings', 'Ratings', RATINGS)}
        <button type="button" className="reset" onClick={() => { setQ(''); r.push('/search'); }}>↺ Reset</button>
      </div>
    </div>
  );
}
