import Link from 'next/link';
import { tmdb, REGION } from '@/lib/tmdb';
export const metadata = { title: 'Providers · BlackFlix' };
export default async function Providers() {
  const d = await tmdb('/watch/providers/movie', { watch_region: REGION });
  const l = (d.results || []).sort((a, b) => a.display_priority - b.display_priority);
  return (
    <div className="page">
      <h1>Providers</h1>
      <div className="chips">
        {l.map((p) => <Link key={p.provider_id} href={`/search?provider=${p.provider_id}`}>{p.provider_name}</Link>)}
      </div>
    </div>
  );
}
