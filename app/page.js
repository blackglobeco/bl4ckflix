import Link from 'next/link';
import Row from '@/components/Row';
import HeroBanner from '@/components/HeroBanner';
import ContinueWatching from '@/components/ContinueWatching';
import { tmdb, img, REGION } from '@/lib/tmdb';

// Provider rows: [label, provider_id]
const PROVIDERS = [
  ['Netflix Originals',    8],
  ['Amazon Prime Shows',   9],
  ['Apple TV+ Shows',    350],
  ['Disney+ Shows',      337],
  ['Peacock TV Shows',   386],
  ['Max Shows',         1899],
];

export default async function Home() {
  const [trending, nowPlaying, trendingTV, allProviders, india, ...provRows] = await Promise.all([
    tmdb('/trending/all/week'),
    tmdb('/movie/now_playing', { region: REGION }),
    tmdb('/trending/tv/week'),
    tmdb('/watch/providers/tv', { watch_region: REGION }),
    tmdb('/discover/movie', { with_origin_country: 'IN', sort_by: 'popularity.desc' }),
    ...PROVIDERS.map(([, id]) =>
      tmdb('/discover/tv', { with_watch_providers: id, watch_region: REGION, sort_by: 'popularity.desc' })
    ),
  ]);

  // Banner: top 15 from trending/all with backdrop + meaningful overview
  const bannerItems = (trending.results || [])
    .filter(m => m.backdrop_path && (m.overview?.length > 40))
    .slice(0, 15);

  // Trending movies/tv from the all-trending endpoint
  const trendingMovies = (trending.results || []).filter(
    i => (i.media_type === 'movie') && i.poster_path
  );

  // Providers strip (all providers sorted by priority)
  const providerStrip = (allProviders.results || [])
    .sort((a, b) => a.display_priority - b.display_priority);

  return (
    <>
      {/* ── BANNER CAROUSEL ── */}
      {bannerItems.length ? (
        <HeroBanner items={bannerItems} />
      ) : (
        <div className="page">
          <p className="empty">Add TMDB_API_KEY to your environment to load titles.</p>
        </div>
      )}

      {/* ── PROVIDERS ── */}
      <section className="row">
        <h2>
          Providers
          <Link href="/providers">View All ({providerStrip.length})</Link>
        </h2>
        <div className="strip">
          {providerStrip.map(p => (
            <Link
              key={p.provider_id}
              href={`/search?provider=${p.provider_id}`}
              className="card"
              style={{ flexBasis: 72, aspectRatio: '1' }}
              title={p.provider_name}
            >
              <img src={img(p.logo_path, 'w92')} alt={p.provider_name} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── CONTINUE WATCHING (client — reads localStorage) ── */}
      <ContinueWatching />

      {/* ── NOW PLAYING ── */}
      <Row
        title="Now Playing"
        viewAllHref="/search?type=movie"
        items={nowPlaying.results}
        type="movie"
      />

      {/* ── TRENDING MOVIES ── */}
      <Row
        title="Trending Movies"
        viewAllHref="/search?type=movie"
        items={trendingMovies}
        type="movie"
      />

      {/* ── TRENDING TV SHOWS ── */}
      <Row
        title="Trending TV Shows"
        viewAllHref="/search?type=tv"
        items={trendingTV.results}
        type="tv"
      />

      {/* ── PROVIDER ROWS ── */}
      {PROVIDERS.map(([label, id], i) => (
        <Row
          key={id}
          title={label}
          viewAllHref={`/search?provider=${id}`}
          items={provRows[i]?.results}
          type="tv"
        />
      ))}

      {/* ── INDIAN MOVIES ── */}
      <Row
        title="Indian Movies"
        viewAllHref="/search?type=movie&country=IN"
        items={india.results}
        type="movie"
      />
    </>
  );
}
