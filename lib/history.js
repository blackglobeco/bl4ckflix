/**
 * lib/history.js — Continue Watching history helpers.
 *
 * Item shape: { id: Number, type, title, poster, ts }
 *   `poster` is a TMDB path string (e.g. "/abc.jpg") — consistent with
 *   the img() helper in lib/tmdb.js and the inline URLs in the UI.
 *
 * id is ALWAYS stored as a Number for consistent strict-equality checks.
 */

const KEY  = 'blackflix:history';
const MAX  = 40;
const norm = (id) => Number(id);
const key  = (type, id) => `${type}-${norm(id)}`;

export function readHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function writeHistory(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

/** Push a watched title to the top of history, deduplicating by (type, id). */
export function recordWatch({ id, type, title, poster }) {
  const list = readHistory().filter(x => key(x.type, x.id) !== key(type, id));
  list.unshift({ id: norm(id), type, title, poster: poster || null, ts: Date.now() });
  writeHistory(list.slice(0, MAX));
}

/** Remove one entry from history. */
export function removeFromHistory(type, id) {
  const next = readHistory().filter(x => key(x.type, x.id) !== key(type, id));
  writeHistory(next);
  return next;
}

/** Clear all history. */
export function clearHistory() {
  writeHistory([]);
}
