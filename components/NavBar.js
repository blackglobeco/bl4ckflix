'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [deferredPrompt, setDeferred] = useState(null);
  const [installed, setInstalled]     = useState(false);
  const menuRef   = useRef(null);
  const searchRef = useRef(null);
  const pathname  = usePathname();

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

  /* ── close on outside click / route change ── */
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

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

  const is = (href) => pathname === href || pathname.startsWith(href + '?');

  return (
    <>
      {/* ── TOP NAV ── */}
      <nav className="topnav">
        <Link href="/" className="topnav-logo">BLACKFLIX</Link>
        <span className="topnav-sp" />
        <div className="topnav-icons">

          {/* Search */}
          <div className="topnav-search-wrap" ref={searchRef}>
            <button className={`topnav-icon-btn${searchOpen ? ' active' : ''}`} aria-label="Search" onClick={() => setSearchOpen(v => !v)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            {searchOpen && (
              <form className="topnav-search-dropdown" action="/search" onSubmit={() => setSearchOpen(false)}>
                <input name="q" placeholder="Search titles…" aria-label="Search" autoFocus />
                <button type="submit" aria-label="Go">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </form>
            )}
          </div>

          {/* Install */}
          {!installed && (
            <button className="topnav-icon-btn" aria-label="Install app" onClick={handleInstall} title="Install BlackFlix"
              style={{ opacity: deferredPrompt ? 1 : 0.35, cursor: deferredPrompt ? 'pointer' : 'default' }}>
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

          {/* Hamburger — desktop only; mobile uses bottom bar */}
          <div className="topnav-menu-wrap topnav-desktop-only" ref={menuRef}>
            <button className={`topnav-icon-btn${menuOpen ? ' active' : ''}`} aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
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
                <Link href="/settings"          onClick={() => setMenuOpen(false)}>Settings</Link>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobnav">
        <Link href="/"                  className={`mobnav-item${pathname === '/' ? ' mobnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </Link>
        <Link href="/search"            className={`mobnav-item${pathname === '/search' ? ' mobnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Search</span>
        </Link>
        <Link href="/search?type=movie" className={`mobnav-item${pathname.includes('type=movie') ? ' mobnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
          <span>Movies</span>
        </Link>
        <Link href="/search?type=tv"    className={`mobnav-item${pathname.includes('type=tv') ? ' mobnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
          <span>Series</span>
        </Link>
        <Link href="/search?type=anime" className={`mobnav-item${pathname.includes('type=anime') ? ' mobnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>Anime</span>
        </Link>
        <Link href="/settings"          className={`mobnav-item${pathname === '/settings' ? ' mobnav-active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          <span>Settings</span>
        </Link>
        {/* More — opens full-screen slide-up panel */}
        <button className={`mobnav-item${menuOpen ? ' mobnav-active' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="More">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
          <span>More</span>
        </button>
      </nav>

      {/* ── MOBILE MORE PANEL (slide-up) ── */}
      {menuOpen && (
        <div className="mob-more-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mob-more-panel" onClick={e => e.stopPropagation()}>
            <div className="mob-more-handle" />
            <Link href="/search?type=drama"   className="mob-more-item" onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              Drama
            </Link>
            <Link href="/providers"            className="mob-more-item" onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Providers
            </Link>
            <Link href="/watchlist"            className="mob-more-item" onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              Watchlist
            </Link>
            <Link href="/anime"                className="mob-more-item" onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Anime Movies
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
