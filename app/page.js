import Link from 'next/link';
import Row from '@/components/Row';
import { tmdb, img, REGION } from '@/lib/tmdb';
const P = [['Netflix', 8], ['Amazon Prime Video', 9], ['Apple TV+', 350], ['Disney+', 337], ['Peacock', 386], ['Max', 1899]];
export default async function Home() {
  const [tr, np, tv, pv, india, ...prov] = await Promise.all([
    tmdb('/trending/movie/week'), tmdb('/movie/now_playing', { region: REGION }), tmdb('/trending/tv/week'),
    tmdb('/watch/providers/tv', { watch_region: REGION }),
    tmdb('/discover/movie', { with_origin_country: 'IN', sort_by: 'popularity.desc' }),
    ...P.map(([, id]) => tmdb('/discover/tv', { with_watch_providers: id, watch_region: REGION, sort_by: 'popularity.desc' })),
  ]);
  const h = tr.results?.find((m) => m.backdrop_path);
  const provs = (pv.results || []).sort((a, b) => a.display_priority - b.display_priority).slice(0, 24);
  return (
    <>
      {h ? (
        <div className="hero" style={{ backgroundImage: `url(${img(h.backdrop_path, 'original')})` }}>
          <div>
            <h1>{h.title}</h1>
            <p>{h.overview}</p>
            <Link href={`/movie/${h.id}`} className="btn">Trailer and where to watch</Link>
          </div>
        </div>
      ) : <div className="page"><p className="empty">Add TMDB_API_KEY to your environment to load titles.</p></div>}
      <section className="row">
        <h2>Providers<Link href="/providers">See all</Link></h2>
        <div className="strip">
          {provs.map((p) => (
            <Link key={p.provider_id} href={`/search?type=tv&provider=${p.provider_id}`} className="card" style={{ flexBasis: 72, aspectRatio: '1' }} title={p.provider_name}>
              <img src={img(p.logo_path, 'w92')} alt={p.provider_name} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>
      <Row title="Now playing" items={np.results} type="movie" href="/search?type=movie" />
      <Row title="Trending movies" items={tr.results} type="movie" href="/search?type=movie" />
      <Row title="Trending series" items={tv.results} type="tv" href="/search?type=tv" />
      {P.map(([n, id], i) => <Row key={id} title={`${n} shows`} items={prov[i].results} type="tv" href={`/search?type=tv&provider=${id}`} />)}
      <Row title="Indian movies" items={india.results} type="movie" />
    </>
  );
}
