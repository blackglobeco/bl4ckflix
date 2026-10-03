import Link from 'next/link';
import Row from '@/components/Row';
import HeroBanner from '@/components/HeroBanner';
import { tmdb, img, REGION } from '@/lib/tmdb';

const P = [['Netflix', 8], ['Amazon Prime Video', 9], ['Apple TV+', 350], ['Disney+', 337], ['Peacock', 386], ['Max', 1899]];

export default async function Home() {
  const [tr, np, tv, pv, india, ...prov] = await Promise.all([
    tmdb('/trending/all/week'),
    tmdb('/movie/now_playing', { region: REGION }),
    tmdb('/trending/tv/week'),
    tmdb('/watch/providers/tv', { watch_region: REGION }),
    tmdb('/discover/movie', { with_origin_country: 'IN', sort_by: 'popularity.desc' }),
    ...P.map(([, id]) => tmdb('/discover/tv', { with_watch_providers: id, watch_region: REGION, sort_by: 'popularity.desc' })),
  ]);

  // Banner items: top 15 trending with backdrop
  const bannerItems = (tr.results || [])
    .filter((m) => m.backdrop_path && (m.overview?.length > 40))
    .slice(0, 15);

  const provs = (pv.results || []).sort((a, b) => a.display_priority - b.display_priority);

  return (
    <>
      {bannerItems.length ? (
        <HeroBanner items={bannerItems} />
      ) : (
        <div className="page"><p className="empty">Add TMDB_API_KEY to your environment to load titles.</p></div>
      )}

      {/* Providers strip */}
      <section className="row">
        <h2>Providers<Link href="/providers">See all ({provs.length})</Link></h2>
        <div className="strip">
          {provs.map((p) => (
            <Link key={p.provider_id} href={`/search?type=tv&provider=${p.provider_id}`} className="card" style={{ flexBasis: 72, aspectRatio: '1' }} title={p.provider_name}>
              <img src={img(p.logo_path, 'w92')} alt={p.provider_name} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

      <Row title="Now Playing" items={np.results} type="movie" href="/search?type=movie" />
      <Row title="Trending Movies" items={(tr.results || []).filter(i => (i.media_type || 'movie') === 'movie')} type="movie" href="/search?type=movie" />
      <Row title="Trending Series" items={tv.results} type="tv" href="/search?type=tv" />
      {P.map(([n, id], i) => <Row key={id} title={`${n} Shows`} items={prov[i].results} type="tv" href={`/search?type=tv&provider=${id}`} />)}
      <Row title="Indian Movies" items={india.results} type="movie" />
    </>
  );
}
