import { notFound } from 'next/navigation';
import Row from '@/components/Row';
import WatchButton from '@/components/WatchButton';
import { tmdb, img, REGION } from '@/lib/tmdb';
export default async function Detail({ params }) {
  const { type, id } = await params;
  if (!['movie', 'tv'].includes(type)) notFound();
  const d = await tmdb(`/${type}/${id}`, { append_to_response: 'videos,watch/providers,similar' });
  if (!d.id) notFound();
  const title = d.title || d.name;
  const yt = d.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const w = d['watch/providers']?.results?.[REGION];
  const groups = [['Stream', w?.flatrate], ['Rent', w?.rent], ['Buy', w?.buy]].filter(([, l]) => l?.length);
  return (
    <>
      <div className="detail">
        {d.poster_path && <img className="poster" src={img(d.poster_path, 'w500')} alt={title} />}
        <div>
          <h1>{title}</h1>
          <div className="meta">{(d.release_date || d.first_air_date || '').slice(0, 4)} · {d.vote_average?.toFixed(1)} rating · {d.genres?.map((g) => g.name).join(', ')}</div>
          <p>{d.overview}</p>
          {yt && <iframe className="trailer" src={`https://www.youtube-nocookie.com/embed/${yt.key}`} title={`${title} trailer`} allowFullScreen />}
          <div><WatchButton item={{ id: d.id, type, title, poster: d.poster_path }} /></div>
          <h2 style={{ margin: '24px 0 8px' }}>Where to watch</h2>
          {groups.length ? groups.map(([g, l]) => (
            <p key={g}><strong>{g}: </strong>{l.map((p) => p.provider_name).join(', ')}</p>
          )) : <p className="empty">No streaming info for {REGION} yet.</p>}
          {w?.link && <a className="btn ghost" href={w.link} target="_blank" rel="noopener noreferrer">See all options on JustWatch</a>}
        </div>
      </div>
      <Row title="More like this" items={d.similar?.results} type={type} />
    </>
  );
}
