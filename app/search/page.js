import { Suspense } from 'react';
import Filters from '@/components/Filters';
import PosterCard from '@/components/PosterCard';
import { tmdb, REGION } from '@/lib/tmdb';
export const metadata = { title: 'Browse · BlackFlix' };
export default async function Search({ searchParams }) {
  const s = await searchParams;
  const q = s.q || '';
  const mode = ['movie', 'tv', 'anime', 'drama'].includes(s.type) ? s.type : 'movie';
  const kind = mode === 'movie' ? 'movie' : 'tv';
  const page = Math.max(1, Number(s.page) || 1);
  const date = kind === 'tv' ? 'first_air_date' : 'primary_release_date';
  const title = kind === 'tv' ? 'original_name' : 'original_title';
  const today = new Date().toISOString().slice(0, 10);
  const SORT = {
    top: 'vote_average.desc', az: `${title}.asc`, za: `${title}.desc`, latest: `${date}.desc`,
    oldest: `${date}.asc`, revenue: kind === 'movie' ? 'revenue.desc' : 'popularity.desc', votes: 'vote_count.desc',
  };
  const sort = SORT[s.sort] || 'popularity.desc';
  const base = mode === 'anime' ? '16' : mode === 'drama' ? '18' : '';
  const [genres, provs, ctry, d] = await Promise.all([
    tmdb(`/genre/${kind}/list`),
    tmdb(`/watch/providers/${kind}`, { watch_region: REGION }),
    tmdb('/configuration/countries'),
    q
      ? tmdb('/search/multi', { query: q, page })
      : tmdb(`/discover/${kind}`, {
          page, sort_by: sort, with_genres: [base, s.genre].filter(Boolean).join(','),
          with_original_language: mode === 'anime' ? 'ja' : '',
          with_watch_providers: s.provider, watch_region: REGION, with_origin_country: s.country,
          'vote_average.gte': s.rating,
          [kind === 'tv' ? 'first_air_date_year' : 'primary_release_year']: s.year,
          'vote_count.gte': s.sort === 'top' ? 300 : s.sort === 'oldest' ? 20 : '',
          [`${date}.lte`]: s.sort === 'latest' ? today : '',
        }),
  ]);
  const providers = (provs.results || []).sort((a, b) => a.display_priority - b.display_priority).slice(0, 150);
  const countries = Array.isArray(ctry) ? ctry.sort((a, b) => a.english_name.localeCompare(b.english_name)) : [];
  const items = (d.results || []).filter((i) => i.poster_path && (i.media_type || kind) !== 'person');
  const link = (p) => `/search?${new URLSearchParams({ ...s, page: p })}`;
  return (
    <div className="page">
      <Suspense fallback={null}><Filters genres={genres.genres} providers={providers} countries={countries} /></Suspense>
      {items.length ? (
        <div className="pgrid">{items.map((i) => <PosterCard key={(i.media_type || kind) + i.id} item={i} type={kind} />)}</div>
      ) : <p className="empty">No titles match these filters. Change a filter or press Reset.</p>}
      <p style={{ marginTop: 24 }}>
        {page > 1 && <a className="btn ghost" href={link(page - 1)}>Previous</a>}
        {page < Math.min(d.total_pages || 1, 500) && <a className="btn ghost" href={link(page + 1)}>Next</a>}
      </p>
    </div>
  );
}
