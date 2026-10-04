import { notFound } from 'next/navigation';
import Link from 'next/link';
import WatchPlayer from '@/components/WatchPlayer';
import EpisodeSelector from '@/components/EpisodeSelector';
import { tmdb, img, REGION } from '@/lib/tmdb';

export async function generateMetadata({ params }) {
  const { type, id } = await params;
  const d = await tmdb(`/${type}/${id}`);
  const title = d.title || d.name || 'Watch';
  return {
    title: `Watch ${title} · BlackFlix`,
    openGraph: {
      title: `Watch ${title} · BlackFlix`,
      description: d.overview,
      images: d.backdrop_path ? [{ url: `https://image.tmdb.org/t/p/w1280${d.backdrop_path}` }] : [],
    },
  };
}

export default async function WatchPage({ params, searchParams }) {
  const { type, id } = await params;
  if (!['movie', 'tv'].includes(type)) notFound();
  const sp = await searchParams;
  const season = Number(sp.s) || 1;
  const episode = Number(sp.e) || 1;

  const d = await tmdb(`/${type}/${id}`, { append_to_response: 'credits,similar' });
  if (!d.id) notFound();

  const title = d.title || d.name;
  const seasons = type === 'tv' ? (d.number_of_seasons || 1) : null;

  const backdrop = d.backdrop_path
    ? `https://image.tmdb.org/t/p/original${d.backdrop_path}`
    : null;

  return (
    <>
      {backdrop && (
        <div
          className="watch-bg"
          style={{ backgroundImage: `url(${backdrop})` }}
          aria-hidden="true"
        />
      )}
      <div className="watch-page">
        <div className="watch-player-wrap">
          <WatchPlayer type={type} id={id} season={season} episode={episode} title={title} poster={d.poster_path} totalSeasons={seasons} />
        </div>
        <div className="watch-info">
          <div className="watch-title-row">
            <div>
              <h1 className="watch-title">{title}</h1>
              <div className="meta">
                {(d.release_date || d.first_air_date || '').slice(0, 4)}
                {d.vote_average > 0 && <> · <span className="rating-num">★ {d.vote_average.toFixed(1)}/10</span></>}
                {d.runtime && <> · {d.runtime} min</>}
              </div>
            </div>
            <Link href={`/${type}/${id}`} className="btn ghost">← Details</Link>
          </div>
          {d.genres?.length > 0 && (
            <div className="genre-chips">
              {d.genres.map(g => <span key={g.id} className="genre-chip">{g.name}</span>)}
            </div>
          )}
          <p className="watch-overview">{d.overview}</p>
        </div>
      </div>

      {type === 'tv' && seasons && (
        <EpisodeSelector
          id={id}
          type={type}
          seasons={seasons}
          currentSeason={season}
          currentEpisode={episode}
        />
      )}

      {d.similar?.results?.length > 0 && (
        <section className="row">
          <h2>You may also like</h2>
          <div className="strip">
            {d.similar.results.slice(0, 20).filter(i => i.poster_path).map(i => (
              <Link key={i.id} href={`/watch/${type}/${i.id}`} className="card" title={i.title || i.name}>
                <img src={img(i.poster_path)} alt={i.title || i.name} loading="lazy" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
