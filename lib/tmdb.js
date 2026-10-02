const B = 'https://api.themoviedb.org/3';
export const REGION = process.env.TMDB_REGION || 'US';
export async function tmdb(path, params = {}) {
  const u = new URL(B + path);
  u.searchParams.set('api_key', process.env.TMDB_API_KEY || '');
  for (const [k, v] of Object.entries(params)) if (v) u.searchParams.set(k, v);
  try {
    const r = await fetch(u, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : { results: [] };
  } catch { return { results: [] }; }
}
export const img = (p, s = 'w342') => (p ? `https://image.tmdb.org/t/p/${s}${p}` : '');
