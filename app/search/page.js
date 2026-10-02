import { Suspense } from 'react';
import Filters from '@/components/Filters';
import PosterCard from '@/components/PosterCard';
import Pagination from '@/components/Pagination';
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
  const base = mode === 'anime' ? '16' : mode === 'drama' ? '18' : '';
  const args = {
    sort_by: SORT[s.sort] || 'popularity.desc', with_genres: [base, s.genre].filter(Boolean).join(','),
    with_original_language: mode === 'anime' ? 'ja' : '', with_watch_providers: s.provider,
    watch_region: REGION, with_origin_country: s.country, 'vote_average.gte': s.rating,
    [kind === 'tv' ? 'first_air_date_year' : 'primary_release_year']: s.year,
    'vote_count.gte': s.sort === 'top' ? 300 : s.sort === 'oldest' ? 20 : '',
    [`${date}.lte`]: s.sort === 'latest' ? today : '',
  };
  // 40 posters per page = two TMDB pages of 20
  const get = (n) => (q ? tmdb('/search/multi', { query: q, page: n }) : tmdb(`/discover/${kind}`, { ...args, page: n }));
  const [genres, provs, ctry, a, b] = await Promise.all([
    tmdb(`/genre/${kind}/list`),
    tmdb(`/watch/providers/${kind}`, { watch_region: REGION }),
    tmdb('/configuration/countries'),
    get(page * 2 - 1),
    get(page * 2),
  ]);
  const total = Math.min(Math.ceil(Math.min(a.total_pages || 1, 500) / 2), 250);
  const providers = (provs.results || []).sort((x, y) => x.display_priority - y.display_priority).slice(0, 150);
  const countries = Array.isArray(ctry) ? ctry.sort((x, y) => x.english_name.localeCompare(y.english_name)) : [];
  const seen = new Set();
  const items = [...(a.results || []), ...(b.results || [])].filter((i) => {
    const k = (i.media_type || kind) + i.id;
    if (!i.poster_path || (i.media_type || kind) === 'person' || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return (
    <div className="page sp">
      <Suspense fallback={null}><Filters genres={genres.genres} providers={providers} countries={countries} /></Suspense>
      {items.length ? (
        <div className="pgrid">{items.map((i) => <PosterCard key={(i.media_type || kind) + i.id} item={i} type={kind} />)}</div>
      ) : <p className="empty">No titles match these filters. Change a filter or press Reset.</p>}
      <Pagination page={page} total={total} params={s} />
    </div>
  );
}
