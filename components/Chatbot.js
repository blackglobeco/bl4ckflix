'use client';
import { useState } from 'react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  return (
    <div className="chatbot-wrap">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <span>Support</span>
            <button onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>
          <div className="chatbot-body">
            <p>Need help? Try these quick links:</p>
            <ul>
              <li><a href="/search">Browse all titles</a></li>
              <li><a href="/providers">Find a provider</a></li>
              <li><a href="/continue-watching">Continue your watching</a></li>
              <li><a href="/watchlist">Your watchlist</a></li>
              <li><a href="/settings">Change settings</a></li>
            </ul>
            <p className="chatbot-note">BLACKFLIX Support</p>
          </div>
        </div>
      )}
      <button className="chatbot-btn" onClick={() => setOpen(!open)} aria-label="Open support">
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
