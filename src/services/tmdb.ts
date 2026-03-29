const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const CACHE_KEY = 'cinematch-posters';

function loadCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, string>) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

// In-memory map so concurrent calls for the same ID don't fire duplicate requests
const inFlight = new Map<string, Promise<string | null>>();

export async function fetchPosterUrl(imdbId: string): Promise<string | null> {
  const token = import.meta.env.VITE_TMDB_READ_TOKEN as string;
  if (!token) return null;

  const cache = loadCache();
  if (cache[imdbId] !== undefined) {
    return cache[imdbId] || null;
  }

  if (inFlight.has(imdbId)) return inFlight.get(imdbId)!;

  const promise = (async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
        { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      const path: string | undefined = data.movie_results?.[0]?.poster_path;
      const url = path ? `${TMDB_IMAGE_BASE}${path}` : '';
      const updated = loadCache();
      updated[imdbId] = url;
      saveCache(updated);
      return url || null;
    } catch {
      return null;
    } finally {
      inFlight.delete(imdbId);
    }
  })();

  inFlight.set(imdbId, promise);
  return promise;
}
