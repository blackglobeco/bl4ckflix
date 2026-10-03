import Link from 'next/link';
import { tmdb, img, REGION } from '@/lib/tmdb';
export const metadata = { title: 'Streaming Providers · BlackFlix' };
export default async function Providers() {
  const [m, t] = await Promise.all([
    tmdb('/watch/providers/movie', { watch_region: REGION }),
    tmdb('/watch/providers/tv', { watch_region: REGION }),
  ]);
  const map = new Map();
  [...(m.results || []), ...(t.results || [])].forEach((p) => map.set(p.provider_id, p));
  const list = [...map.values()].sort((a, b) => a.display_priority - b.display_priority);
  return (
    <div className="page">
      <h1>Streaming Providers <span className="provider-count">({list.length})</span></h1>
      {list.length ? (
        <div className="prov">
          {list.map((p) => (
            <Link key={p.provider_id} href={`/search?type=tv&provider=${p.provider_id}`} className="pv">
              <img src={img(p.logo_path, 'w92')} alt="" loading="lazy" />
              <span>{p.provider_name}</span>
            </Link>
          ))}
        </div>
      ) : <p className="empty">No providers loaded. Check that TMDB_API_KEY is set.</p>}
    </div>
  );
}
