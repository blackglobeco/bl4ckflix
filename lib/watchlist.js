/**
 * lib/watchlist.js — single source of truth for the watchlist.
 *
 * Canonical item shape stored in localStorage:
 *   { id: Number, type: string, title: string,
 *     poster_path: string|null, backdrop_path: string|null,
 *     vote_average: number, release_date: string, first_air_date: string,
 *     original_language: string, overview: string }
 *
 * id is ALWAYS stored as a Number so strict equality works across all
 * components regardless of whether id came from a URL param (string)
 * or a TMDB API response (number).
 */

const KEY = 'blackflix:list';

const norm = (id) => Number(id);
const key  = (type, id) => `${type}-${norm(id)}`;

/** Read the list and deduplicate by (type, id), keeping first occurrence. */
export function readList() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    const seen = new Set();
    return raw.filter((x) => {
      const k = key(x.type || x.media_type, x.id);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  } catch {
    return [];
  }
}

/** Persist the list. */
export function writeList(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

/** Returns true if (type, id) is in the watchlist. */
export function isInList(type, id) {
  return readList().some((x) => key(x.type || x.media_type, x.id) === key(type, id));
}

/**
 * Toggle an item in/out of the watchlist.
 * Accepts any shape the caller has; normalises to canonical before storing.
 * Returns the new "is in list" boolean.
 */
export function toggleItem(raw) {
  const type  = raw.type || raw.media_type || 'movie';
  const id    = norm(raw.id);
  const k     = key(type, id);

  const list  = readList();
  const wasIn = list.some((x) => key(x.type || x.media_type, x.id) === k);
  const next  = list.filter((x) => key(x.type || x.media_type, x.id) !== k);

  if (!wasIn) {
    next.unshift({
      id,
      type,
      title:              raw.title             || raw.name             || '',
      poster_path:        raw.poster_path        || raw.poster           || null,
      backdrop_path:      raw.backdrop_path                              || null,
      vote_average:       raw.vote_average                               || 0,
      release_date:       raw.release_date                               || '',
      first_air_date:     raw.first_air_date                             || '',
      original_language:  raw.original_language                          || '',
      overview:           raw.overview                                   || '',
    });
  }

  writeList(next);
  return !wasIn; // new "in list" state
}
