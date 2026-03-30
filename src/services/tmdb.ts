// Fetches movie posters from Wikipedia's free REST API — no API key required.
// Results are cached in localStorage so each movie is only fetched once.

const WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary';
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

function wikiSlug(title: string): string {
  return title.replace(/ /g, '_').replace(/'/g, "'");
}

// Ordered list of Wikipedia article title patterns to try
function candidateSlugs(title: string, year: number): string[] {
  const base = wikiSlug(title);
  return [
    `${base}_(film)`,
    `${base}_(${year}_film)`,
    base,
  ];
}

// In-memory map so concurrent calls for the same ID don't fire duplicate requests
const inFlight = new Map<string, Promise<string | null>>();

export async function fetchPosterUrl(
  id: string,
  title: string,
  year: number
): Promise<string | null> {
  const cache = loadCache();
  if (cache[id] !== undefined) return cache[id] || null;

  if (inFlight.has(id)) return inFlight.get(id)!;

  const promise = (async () => {
    for (const slug of candidateSlugs(title, year)) {
      try {
        const res = await fetch(`${WIKI_SUMMARY}/${encodeURIComponent(slug)}`);
        if (!res.ok) continue;
        const data = await res.json();
        const url: string = data.thumbnail?.source ?? '';
        if (url) {
          const updated = loadCache();
          updated[id] = url;
          saveCache(updated);
          return url;
        }
      } catch {
        // try next candidate
      }
    }
    // No poster found — cache empty string so we don't retry
    const updated = loadCache();
    updated[id] = '';
    saveCache(updated);
    return null;
  })();

  inFlight.set(id, promise);
  promise.finally(() => inFlight.delete(id));
  return promise;
}
