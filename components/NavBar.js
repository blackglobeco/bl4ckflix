'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [deferredPrompt, setDeferred] = useState(null);
  const [installed, setInstalled]     = useState(false);
  const menuRef  = useRef(null);
  const searchRef = useRef(null);

  /* ── PWA install prompt ── */
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferred(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferred(null);
  };

  /* ── close on outside click ── */
  useEffect(() => {
    const out = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    const esc = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); } };
    document.addEventListener('mousedown', out);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc); };
  }, []);

  return (
    <nav className="topnav">
      {/* Logo */}
      <Link href="/" className="topnav-logo">BLACKFLIX</Link>

      <span className="topnav-sp" />

      {/* Icon cluster */}
      <div className="topnav-icons">

        {/* Search */}
        <div className="topnav-search-wrap" ref={searchRef}>
          <button
            className={`topnav-icon-btn${searchOpen ? ' active' : ''}`}
            aria-label="Search"
            onClick={() => setSearchOpen(v => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          {searchOpen && (
            <form
              className="topnav-search-dropdown"
              action="/search"
              onSubmit={() => setSearchOpen(false)}
            >
              <input
                name="q"
                placeholder="Search titles…"
                aria-label="Search"
                autoFocus
              />
              <button type="submit" aria-label="Go">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </form>
          )}
        </div>

        {/* Install App — shows when PWA prompt is available and not yet installed */}
        {!installed && (
          <button
            className="topnav-icon-btn"
            aria-label="Install app"
            onClick={handleInstall}
            title="Install BlackFlix"
            style={{ opacity: deferredPrompt ? 1 : 0.35, cursor: deferredPrompt ? 'pointer' : 'default' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        )}

        {/* Settings */}
        <Link href="/settings" className="topnav-icon-btn" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </Link>

        {/* Menu (hamburger) */}
        <div className="topnav-menu-wrap" ref={menuRef}>
          <button
            className={`topnav-icon-btn${menuOpen ? ' active' : ''}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {menuOpen && (
            <div className="topnav-menu-panel">
              <Link href="/search?type=movie" onClick={() => setMenuOpen(false)}>Movies</Link>
              <Link href="/search?type=tv"    onClick={() => setMenuOpen(false)}>Series</Link>
              <Link href="/search?type=anime" onClick={() => setMenuOpen(false)}>Anime</Link>
              <Link href="/search?type=drama" onClick={() => setMenuOpen(false)}>Drama</Link>
              <Link href="/providers"         onClick={() => setMenuOpen(false)}>Providers</Link>
              <Link href="/watchlist"         onClick={() => setMenuOpen(false)}>Watchlist</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
