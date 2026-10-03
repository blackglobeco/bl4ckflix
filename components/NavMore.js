'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function NavMore() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const out = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', out);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc); };
  }, []);
  return (
    <div className="nav-more" ref={ref}>
      <button className="nav-more-btn" onClick={() => setOpen(!open)} aria-haspopup="true" aria-expanded={open}>
        More <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>
      </button>
      {open && (
        <div className="nav-more-panel">
          <Link href="/settings" onClick={() => setOpen(false)}>⚙ Settings</Link>
          <Link href="/search?type=drama" onClick={() => setOpen(false)}>🎭 Drama</Link>
        </div>
      )}
    </div>
  );
}
