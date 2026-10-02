import Row from '@/components/Row';
import { tmdb, REGION } from '@/lib/tmdb';
export default async function Search({ searchParams }) {
  const { q = '', type = 'movie', provider = '', page = '1' } = await searchParams;
  const d = q
    ? await tmdb('/search/multi', { query: q, page })
    : await tmdb(`/discover/${type}`, { with_watch_providers: provider, watch_region: REGION, sort_by: 'popularity.desc', page });
  const items = (d.results || []).filter((i) => i.poster_path && (i.media_type || type) !== 'person');
  const n = Number(page);
  const qs = (p) => `?${new URLSearchParams({ q, type, provider, page: p })}`;
  return (
    <div className="page">
      <h1>{q ? `Results for "${q}"` : type === 'tv' ? 'Series' : 'Movies'}</h1>
      <form className="filters">
        <input name="q" defaultValue={q} placeholder="Search titles" />
        <select name="type" defaultValue={type}><option value="movie">Movies</option><option value="tv">Series</option></select>
        <input name="provider" defaultValue={provider} placeholder="Provider ID" size="10" />
        <button className="btn">Apply</button>
      </form>
      {items.length ? (
        <div className="grid">
          {items.map((i) => {
            const t = i.media_type || type;
            return <a key={t + i.id} className="card" href={`/${t}/${i.id}`}><img src={`https://image.tmdb.org/t/p/w342${i.poster_path}`} alt={i.title || i.name} loading="lazy" /></a>;
          })}
        </div>
      ) : <p className="empty">No titles found. Try another search or filter.</p>}
      <p style={{ marginTop: 20 }}>
        {n > 1 && <a className="btn ghost" href={qs(n - 1)}>Previous</a>}
        {n < (d.total_pages || 1) && <a className="btn ghost" href={qs(n + 1)}>Next</a>}
      </p>
    </div>
  );
}
