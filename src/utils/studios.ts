// Canonical major studio names shown as individual filter options.
// Everything else maps to 'Independent'.
export const MAJOR_STUDIOS = [
  'Warner Bros.',
  'Paramount',
  'Disney',
  'Universal',
  '20th Century Fox',
  'Sony / Columbia',
  'MGM',
  'New Line Cinema',
  'DreamWorks',
  'Miramax',
  'Studio Ghibli',
  'Netflix',
] as const;

export type MajorStudio = typeof MAJOR_STUDIOS[number];
export const INDEPENDENT = 'Independent' as const;

// Ordered patterns — first match wins
const PATTERNS: Array<[RegExp, string]> = [
  [/studio\s*ghibli/i,                       'Studio Ghibli'],
  [/new\s*line/i,                            'New Line Cinema'],
  [/dreamworks/i,                            'DreamWorks'],
  [/miramax/i,                               'Miramax'],
  [/netflix/i,                               'Netflix'],
  [/warner/i,                                'Warner Bros.'],
  [/universal/i,                             'Universal'],
  [/paramount/i,                             'Paramount'],
  [/pixar|buena\s*vista|touchstone|hollywood\s*pictures|walt\s*disney|disney/i, 'Disney'],
  [/columbia|sony|tri.?star/i,               'Sony / Columbia'],
  [/20th\s*century|fox\s*film|fox\s*search|lucasfilm/i, '20th Century Fox'],
  [/mgm|metro.goldwyn|united\s*artists/i,    'MGM'],
];

/** Map a raw studio string from any source to a canonical name. */
export function normalizeStudio(raw: string): string {
  for (const [re, name] of PATTERNS) {
    if (re.test(raw)) return name;
  }
  return INDEPENDENT;
}
