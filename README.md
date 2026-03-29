# CineMatch

A Netflix-style movie suggestion app that learns your taste. Pick your favorite genres, rate movies, and watch your feed adapt in real time.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)

## Features

- **Genre onboarding** — pick 3 genres to seed your initial preferences
- **Smart suggestions** — movies are scored and ranked based on genre weights that evolve with your ratings
- **Like / Dislike / Watch Later** — each action updates your preference weights instantly; liked movies move to their own tab
- **Liked & Watch Later tabs** — dedicated pages for movies you've saved
- **Movie popup** — title, year, rating, director, main actor, description, and a "Similar to movies you liked" section showing up to 3 matched picks from your liked list
- **Real movie posters** — fetched from TMDB by IMDb ID, cached in localStorage; gradient fallback when no key is set
- **100-movie dataset** — curated across 12 genres with multi-genre overlap for richer recommendations
- **Fully client-side** — no backend, all state persisted in localStorage via Zustand

## How the recommendation engine works

Each of the 12 genres has a weight (default 1.0, boosted to 1.4 for your 3 chosen genres). Every movie is scored:

```
score = baseRating + Σ(genreWeight × 1.5 for each matching genre) − seenPenalty
```

When you **like** a movie, each of its genres gains `+0.15` (max 2.0).
When you **dislike** a movie, each of its genres loses `−0.10` (min 0.0).
The feed re-ranks immediately after every action.

## Tech stack

| Layer | Library |
|---|---|
| Build | Vite 5 |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 (dark theme) |
| Animation | Framer Motion |
| State | Zustand with `persist` middleware |
| Posters | TMDB API (optional) |

## Getting started

```bash
npm install
npm run dev
```

### Enabling real movie posters (optional)

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to **Settings → API** and copy your **API Read Access Token** (the long JWT)
3. Create a `.env.local` file in the project root:

```env
VITE_TMDB_READ_TOKEN=your_token_here
```

4. Restart the dev server. Posters load on first view and are cached permanently in localStorage — each movie only hits the API once.

## Project structure

```
src/
├── components/
│   ├── feed/          # MovieFeed, MovieCard
│   ├── layout/        # NavBar
│   ├── onboarding/    # GenreSelector, GenreCard
│   ├── popup/         # MoviePopup, ActionBar
│   └── ui/            # Badge, IconButton
├── data/
│   └── movies.ts      # 100-movie static dataset
├── hooks/
│   ├── useMovieSuggestions.ts
│   └── usePoster.ts
├── services/
│   └── tmdb.ts        # TMDB fetch + localStorage cache
├── store/
│   └── useAppStore.ts # Zustand store
├── types/
│   └── index.ts
└── utils/
    ├── cn.ts
    └── preferenceEngine.ts
```
