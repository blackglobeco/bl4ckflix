import { notFound } from 'next/navigation';
import Link from 'next/link';
import Row from '@/components/Row';
import WatchButton from '@/components/WatchButton';
import CastSection from '@/components/CastSection';
import { tmdb, img, REGION } from '@/lib/tmdb';

export async function generateMetadata({ params }) {
  const { type, id } = await params;
  const d = await tmdb(`/${type}/${id}`);
  const title = d.title || d.name || 'BlackFlix';
  const desc = d.overview || 'Find what to watch and where to stream it.';
  const image = d.backdrop_path ? `https://image.tmdb.org/t/p/w1280${d.backdrop_path}` : null;
  return {
    title: `${title} · BlackFlix`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: type === 'movie' ? 'video.movie' : 'video.tv_show',
      images: image ? [{ url: image, width: 1280, height: 720 }] : [],
    },
  };
}

export default async function Detail({ params }) {
  const { type, id } = await params;
  if (!['movie', 'tv'].includes(type)) notFound();
  const d = await tmdb(`/${type}/${id}`, { append_to_response: 'videos,watch/providers,similar,credits' });
  if (!d.id) notFound();

  const title = d.title || d.name;
  const year = (d.release_date || d.first_air_date || '').slice(0, 4);
  const yt = d.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const w = d['watch/providers']?.results?.[REGION];
  const groups = [['Stream', w?.flatrate], ['Rent', w?.rent], ['Buy', w?.buy]].filter(([, l]) => l?.length);

  const cast = d.credits?.cast?.slice(0, 12) || [];
  const director = d.credits?.crew?.find(c => c.job === 'Director');
  const creator = d.created_by?.[0];

  return (
    <>
      {d.backdrop_path && (
        <div className="detail-hero" style={{ backgroundImage: `url(${img(d.backdrop_path, 'original')})` }} />
      )}
      <div className="detail">
        {d.poster_path && <img className="poster" src={img(d.poster_path, 'w500')} alt={title} />}
        <div>
          <h1>{title}</h1>
          <div className="meta">
            {year}
            {d.vote_average > 0 && <> · <span className="rating-num">★ {d.vote_average.toFixed(1)}/10</span></>}
            {d.runtime && <> · {d.runtime} min</>}
            {d.number_of_seasons && <> · {d.number_of_seasons} season{d.number_of_seasons > 1 ? 's' : ''}</>}
          </div>

          {d.genres?.length > 0 && (
            <div className="genre-chips">
              {d.genres.map(g => (
                <Link key={g.id} href={`/search?type=${type}&genre=${g.id}`} className="genre-chip">{g.name}</Link>
              ))}
            </div>
          )}

          {(director || creator) && (
            <p className="meta" style={{ marginTop: 6 }}>
              {director ? `Directed by ${director.name}` : `Created by ${creator.name}`}
            </p>
          )}

          <p style={{ marginTop: 12, marginBottom: 18 }}>{d.overview}</p>

          <div className="detail-actions">
            <Link href={`/watch/${type}/${id}`} className="btn">▶ Watch Now</Link>
            <WatchButton item={{ id: d.id, type, title, poster: d.poster_path }} />
            <a className="btn ghost" href={`https://www.imdb.com/find?q=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">⬇ Download</a>
          </div>

          {yt && (
            <div style={{ marginTop: 20 }}>
              <h2 style={{ marginBottom: 10 }}>Trailer</h2>
              <iframe className="trailer" src={`https://www.youtube-nocookie.com/embed/${yt.key}`} title={`${title} trailer`} allowFullScreen />
            </div>
          )}

          <h2 style={{ margin: '24px 0 8px' }}>Where to Watch</h2>
          {groups.length ? groups.map(([g, l]) => (
            <p key={g}><strong>{g}: </strong>{l.map((p) => p.provider_name).join(', ')}</p>
          )) : <p className="empty">No streaming info for {REGION} yet.</p>}
          {w?.link && <a className="btn ghost" style={{ marginTop: 12, display: 'inline-block' }} href={w.link} target="_blank" rel="noopener noreferrer">See all options on JustWatch ↗</a>}
        </div>
      </div>

      {cast.length > 0 && <CastSection cast={cast} />}

      <Row title="You may also like" items={d.similar?.results} type={type} />
    </>
  );
}
