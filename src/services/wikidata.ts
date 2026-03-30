import type { Genre, Movie } from '../types';

const ENDPOINT = 'https://query.wikidata.org/sparql';
const CACHE_KEY = 'cinematch-wikidata-v1';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Order matters — more specific keywords first
const GENRE_KEYWORDS: Array<[string, Genre]> = [
  ['science fiction', 'Sci-Fi'],
  ['animated',        'Animation'],
  ['animation',       'Animation'],
  ['documentary',     'Documentary'],
  ['adventure',       'Adventure'],
  ['thriller',        'Thriller'],
  ['romance',         'Romance'],
  ['romantic',        'Romance'],
  ['fantasy',         'Fantasy'],
  ['horror',          'Horror'],
  ['comedy',          'Comedy'],
  ['crime',           'Crime'],
  ['action',          'Action'],
  ['drama',           'Drama'],
];

const GENRE_COLORS: Record<Genre, string> = {
  Action:      'from-red-800 to-red-950',
  Comedy:      'from-yellow-700 to-amber-900',
  Drama:       'from-blue-800 to-blue-950',
  Horror:      'from-red-950 to-zinc-900',
  'Sci-Fi':    'from-cyan-800 to-slate-950',
  Thriller:    'from-purple-800 to-zinc-950',
  Romance:     'from-pink-700 to-rose-950',
  Animation:   'from-green-700 to-teal-900',
  Documentary: 'from-orange-700 to-amber-950',
  Fantasy:     'from-indigo-700 to-violet-950',
  Crime:       'from-zinc-600 to-zinc-900',
  Adventure:   'from-amber-700 to-orange-950',
};

function mapGenres(genreStr: string): Genre[] {
  const lower = genreStr.toLowerCase();
  const seen = new Set<Genre>();
  for (const [keyword, genre] of GENRE_KEYWORDS) {
    if (lower.includes(keyword)) seen.add(genre);
    if (seen.size >= 3) break;
  }
  return [...seen];
}

// Fetch ~500 notable films that have English Wikipedia articles.
// We use SAMPLE() aggregates to collapse multi-valued properties (director, actor, genre)
// into one row per film, which avoids cartesian-product blowup.
const QUERY = `
SELECT DISTINCT ?imdbId
  (SAMPLE(?title) AS ?title)
  (YEAR(MIN(?date)) AS ?year)
  (SAMPLE(?dirLabel) AS ?director)
  (SAMPLE(?actorLabel) AS ?mainActor)
  (GROUP_CONCAT(DISTINCT ?genreLabel; SEPARATOR="|") AS ?genres)
  (SAMPLE(?desc) AS ?description)
WHERE {
  ?film wdt:P31 wd:Q11424 ;
        wdt:P345 ?imdbId ;
        wdt:P57  ?dir ;
        wdt:P161 ?actor ;
        wdt:P136 ?genre ;
        wdt:P577 ?date .
  ?article schema:about ?film ;
           schema:isPartOf <https://en.wikipedia.org/> .
  ?film  rdfs:label ?title      FILTER(LANG(?title)      = "en") .
  ?dir   rdfs:label ?dirLabel   FILTER(LANG(?dirLabel)   = "en") .
  ?actor rdfs:label ?actorLabel FILTER(LANG(?actorLabel) = "en") .
  ?genre rdfs:label ?genreLabel FILTER(LANG(?genreLabel) = "en") .
  OPTIONAL { ?film schema:description ?desc FILTER(LANG(?desc) = "en") }
  FILTER(YEAR(?date) >= 1970 && YEAR(?date) <= 2024)
}
GROUP BY ?imdbId
LIMIT 500
`.trim();

interface Cached { movies: Movie[]; at: number }

export async function fetchWikidataMovies(): Promise<Movie[]> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const c: Cached = JSON.parse(raw);
      if (Date.now() - c.at < CACHE_TTL) return c.movies;
    }
  } catch {}

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch(
      `${ENDPOINT}?query=${encodeURIComponent(QUERY)}&format=json`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/sparql-results+json',
          'User-Agent': 'CineMatch/1.0 (movie suggestion app; github.com)',
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const bindings: Record<string, { value: string }>[] = data.results?.bindings ?? [];

    const movies: Movie[] = bindings.flatMap((b) => {
      const imdbId = b.imdbId?.value ?? '';
      if (!imdbId.startsWith('tt')) return [];

      const genres = mapGenres(b.genres?.value ?? '');
      if (genres.length === 0) return [];

      const year = parseInt(b.year?.value ?? '0', 10);
      if (!year) return [];

      const title = b.title?.value ?? '';
      if (!title) return [];

      return [{
        id: imdbId,
        title,
        year,
        director:    b.director?.value  ?? 'Unknown',
        mainActor:   b.mainActor?.value ?? 'Unknown',
        genres,
        description: b.description?.value ?? `A ${year} ${genres[0].toLowerCase()} film.`,
        posterColor: GENRE_COLORS[genres[0]],
        rating: 7.0,
      } satisfies Movie];
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify({ movies, at: Date.now() }));
    return movies;
  } finally {
    clearTimeout(timeout);
  }
}
