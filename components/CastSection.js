import { img } from '@/lib/tmdb';

export default function CastSection({ cast = [] }) {
  if (!cast.length) return null;
  return (
    <section className="cast-section row">
      <h2>Cast</h2>
      <div className="strip cast-strip">
        {cast.map(p => (
          <div key={p.id} className="cast-card">
            <div className="cast-avatar">
              {p.profile_path
                ? <img src={img(p.profile_path, 'w185')} alt={p.name} loading="lazy" />
                : <span>{p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
              }
            </div>
            <div className="cast-info">
              <span className="cast-name">{p.name}</span>
              {p.character && <span className="cast-char">{p.character}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
