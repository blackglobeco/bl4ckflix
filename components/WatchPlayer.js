'use client';
import { useState } from 'react';

// Free embed sources — these proxy TMDB IDs to embeddable players
const SOURCES = [
  { id: 'vidsrc', label: 'VidSrc', movie: (id) => `https://vidsrc.to/embed/movie/${id}`, tv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { id: 'superembed', label: 'SuperEmbed', movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
  { id: '2embed', label: '2Embed', movie: (id) => `https://www.2embed.cc/embed/${id}`, tv: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` },
  { id: 'embedsu', label: 'EmbedSU', movie: (id) => `https://embed.su/embed/movie/${id}`, tv: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}` },
];

export default function WatchPlayer({ type, id, season, episode, title }) {
  const [src, setSrc] = useState(SOURCES[0].id);
  const active = SOURCES.find(s => s.id === src) || SOURCES[0];
  const url = type === 'movie' ? active.movie(id) : active.tv(id, season, episode);

  return (
    <div className="player-outer">
      <div className="server-bar">
        <span className="server-label">Server:</span>
        {SOURCES.map(s => (
          <button
            key={s.id}
            className={`server-btn${src === s.id ? ' active' : ''}`}
            onClick={() => setSrc(s.id)}
          >{s.label}</button>
        ))}
      </div>
      <div className="player-frame">
        <iframe
          key={url}
          src={url}
          title={`Watch ${title}`}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
        />
      </div>
      <p className="player-note">If one server doesn't work, try another. Content is hosted by third-party providers.</p>
    </div>
  );
}
