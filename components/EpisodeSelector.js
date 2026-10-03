'use client';
import { useRouter } from 'next/navigation';

export default function EpisodeSelector({ id, type, seasons, currentSeason, currentEpisode }) {
  const router = useRouter();

  const handleSeason = (e) => {
    router.push(`/watch/${type}/${id}?s=${e.target.value}&e=1`);
  };

  const handleEpisode = (e) => {
    router.push(`/watch/${type}/${id}?s=${currentSeason}&e=${e.target.value}`);
  };

  return (
    <div className="ep-nav page">
      <h2>Episodes</h2>
      <div className="ep-selectors">
        <label>
          Season
          <select value={currentSeason} onChange={handleSeason}>
            {Array.from({ length: seasons }, (_, i) => i + 1).map(s => (
              <option key={s} value={s}>Season {s}</option>
            ))}
          </select>
        </label>
        <label>
          Episode
          <select value={currentEpisode} onChange={handleEpisode}>
            {Array.from({ length: 50 }, (_, i) => i + 1).map(e => (
              <option key={e} value={e}>Episode {e}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
