'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NavBar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [deferredPrompt, setDeferred] = useState(null);
  const [installed, setInstalled]     = useState(false);
  const router    = useRouter();
  const menuRef   = useRef(null);
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
        <button
          className={`topnav-icon-btn${searchOpen ? ' active' : ''}`}
          aria-label="Search"
          onClick={() => setSearchOpen(v => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {/* Full-screen search overlay */}
        {searchOpen && (
          <div
            className="search-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
          >
            <form
              className="search-overlay-form"
              onSubmit={(e) => {
                e.preventDefault();
                const q = e.currentTarget.q.value.trim();
                setSearchOpen(false);
                router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
              }}
            >
              <div className="search-overlay-pill">
                {/* Filter label (decorative) */}
                <span className="search-overlay-filter">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                    <line x1="11" y1="18" x2="13" y2="18"/>
                  </svg>
                  Filter
                </span>
                <span className="search-overlay-divider" />
                <input
                  name="q"
                  className="search-overlay-input"
                  placeholder="Search Here..."
                  aria-label="Search"
                  autoFocus
                />
                <button type="submit" className="search-overlay-submit" aria-label="Search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

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
              <Link href="/providers"           onClick={() => setMenuOpen(false)}>Providers</Link>
              <Link href="/watchlist"           onClick={() => setMenuOpen(false)}>Watchlist</Link>
              <Link href="/continue-watching"   onClick={() => setMenuOpen(false)}>Continue Watching</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
