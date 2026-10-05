'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isIOSChrome() {
  if (typeof navigator === 'undefined') return false;
  return isIOS() && /CriOS/.test(navigator.userAgent);
}

function isIOSFirefox() {
  if (typeof navigator === 'undefined') return false;
  return isIOS() && /FxiOS/.test(navigator.userAgent);
}

function isInStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

export default function NavBar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [deferredPrompt, setDeferred] = useState(null);
  const [installed, setInstalled]     = useState(false);
  const [iosModal, setIosModal]       = useState(false);
  const [swReady, setSwReady]         = useState(false);
  const router    = useRouter();
  const menuRef   = useRef(null);
  const searchRef = useRef(null);

  /* ── Register service worker ── */
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => setSwReady(true))
        .catch(() => {});
    }
    // Already installed as PWA
    if (isInStandaloneMode()) setInstalled(true);
  }, []);

  /* ── PWA install prompt (Chrome / Edge / Android Chrome) ── */
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferred(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setInstalled(true); setDeferred(null); });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setIosModal(true);
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferred(null);
    }
  };

  /* ── close on outside click ── */
  useEffect(() => {
    const out = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    const esc = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); setIosModal(false); } };
    document.addEventListener('mousedown', out);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc); };
  }, []);

  // Show button: not installed + (iOS, has deferred prompt, or SW registered on desktop/android)
  const showInstallBtn = !installed;

  return (
    <>
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

          {/* Install App */}
          {showInstallBtn && (
            <button
              className="topnav-icon-btn"
              aria-label="Install app"
              onClick={handleInstall}
              title="Install BLACKFLIX"
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
                {[
                  { href: '/',                    label: 'Home',           icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                  { href: '/search?type=movie',   label: 'Movies',         icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg> },
                  { href: '/search?type=tv',      label: 'Series',         icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg> },
                  { href: '/search?type=anime',   label: 'Anime',          icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
                  { href: '/search?type=drama',   label: 'Drama',          icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
                  { href: '/providers',           label: 'Providers',      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
                  { href: '/watchlist',           label: 'Watchlist',      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg> },
                  { href: '/continue-watching',   label: 'Continue Watch', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                  { href: '/settings',            label: 'Settings',       icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
                ].map(({ href, label, icon }) => (
                  <Link key={href} href={href} className="topnav-menu-item" onClick={() => setMenuOpen(false)}>
                    <span className="topnav-menu-icon">{icon}</span>
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── iOS "Add to Home Screen" modal ── */}
      {iosModal && (() => {
        const chrome  = isIOSChrome();
        const firefox = isIOSFirefox();
        const ShareIcon = () => (
          <svg style={{ display: 'inline', verticalAlign: 'middle', margin: '0 3px' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        );
        const steps = chrome ? [
          <>Tap the <strong style={{ color: '#fff' }}>Share</strong> button <ShareIcon /> at the top-right corner of Chrome</>,
          <>Tap <strong style={{ color: '#fff' }}>View More ∨</strong></>,
          <>Tap <strong style={{ color: '#fff' }}>Add to Home Screen</strong></>,
          <>Tap <strong style={{ color: '#fff' }}>Add</strong> to confirm</>,
        ] : firefox ? [
          <>Tap the <strong style={{ color: '#fff' }}>three-line menu</strong> (☰) at the bottom of Firefox</>,
          <>Tap <strong style={{ color: '#fff' }}>Share</strong>, then <strong style={{ color: '#fff' }}>Add to Home Screen</strong></>,
          <>Tap <strong style={{ color: '#fff' }}>Add</strong> to confirm</>,
        ] : [
          <>Tap the <strong style={{ color: '#fff' }}>three-dot menu</strong> (...) at the bottom-right corner of Safari</>,
          <>Tap the <strong style={{ color: '#fff' }}>Share</strong> button <ShareIcon /></>,
          <>Tap <strong style={{ color: '#fff' }}>View More ∨</strong></>,
          <>Tap <strong style={{ color: '#fff' }}>Add to Home Screen</strong></>,
          <>Tap <strong style={{ color: '#fff' }}>Add</strong> to confirm</>,
        ];
        const browserLabel = chrome ? 'Chrome' : firefox ? 'Firefox' : 'Safari';
        return (
          <div
            className="ios-modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setIosModal(false); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.75)', display: 'flex',
              alignItems: 'flex-end', justifyContent: 'center', padding: '0 16px 32px',
            }}
          >
            <div style={{
              background: '#1a1a1a', borderRadius: 16, padding: '28px 24px',
              width: '100%', maxWidth: 400, textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📲</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                Install BLACKFLIX
              </h3>
              <p style={{ margin: '0 0 20px', color: '#aaa', fontSize: 14, lineHeight: 1.6 }}>
                To install on your iPhone or iPad ({browserLabel}):
              </p>
              <ol style={{ textAlign: 'left', color: '#ccc', fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: '0 0 24px' }}>
                {steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              <button
                onClick={() => setIosModal(false)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                  background: '#e50914', color: '#fff', fontWeight: 700,
                  fontSize: 15, cursor: 'pointer',
                }}
              >
                Got it
              </button>
            </div>
          </div>
        );
      })()}
    </>
  );
}
