import Link from 'next/link';
import Row from '@/components/Row';
import { tmdb, img, REGION } from '@/lib/tmdb';
const P = [['Netflix', 8], ['Amazon Prime Video', 9], ['Disney Plus', 337], ['Apple TV+', 350], ['Max', 1899]];
export default async function Home() {
  const [tr, np, tv, ...prov] = await Promise.all([
    tmdb('/trending/movie/week'), tmdb('/movie/now_playing', { region: REGION }), tmdb('/trending/tv/week'),
    ...P.map(([, id]) => tmdb('/discover/tv', { with_watch_providers: id, watch_region: REGION, sort_by: 'popularity.desc' })),
  ]);
  const h = tr.results?.find((m) => m.backdrop_path);
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
      <Row title="Trending movies" items={tr.results} type="movie" href="/search?type=movie" />
      <Row title="Now playing" items={np.results} type="movie" />
      <Row title="Trending series" items={tv.results} type="tv" href="/search?type=tv" />
      {P.map(([n, id], i) => <Row key={id} title={`Popular on ${n}`} items={prov[i].results} type="tv" href={`/search?type=tv&provider=${id}`} />)}
    </>
  );
}
