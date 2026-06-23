import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  fetchTrending, fetchPopular, fetchTopRated, fetchGenres, fetchPersonalized
} from '../store/slices/moviesSlice';
import HeroSection from '../components/home/HeroSection';
import MovieRow from '../components/movie/MovieRow';

const GENRES = [
  { id: 28, name: 'Action', emoji: '💥', color: '#ef4444' },
  { id: 35, name: 'Comedy', emoji: '😂', color: '#f59e0b' },
  { id: 27, name: 'Horror', emoji: '👻', color: '#8b5cf6' },
  { id: 10749, name: 'Romance', emoji: '💕', color: '#ec4899' },
  { id: 878, name: 'Sci-Fi', emoji: '🚀', color: '#06b6d4' },
  { id: 18, name: 'Drama', emoji: '🎭', color: '#84cc16' },
  { id: 12, name: 'Adventure', emoji: '🗺️', color: '#f97316' },
  { id: 80, name: 'Crime', emoji: '🔍', color: '#6b7280' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { trending, popular, topRated, personalized } = useSelector(s => s.movies);
  const { isAuthenticated, user } = useSelector(s => s.auth);

  useEffect(() => {
    if (!trending.loaded) dispatch(fetchTrending({ timeWindow: 'week' }));
    if (!popular.loaded) dispatch(fetchPopular());
    if (!topRated.loaded) dispatch(fetchTopRated());
    dispatch(fetchPersonalized());
    dispatch(fetchGenres());
  }, []);

  const personalizedTitle = {
    'because_you_watched': `Because You Watched "${personalized.basedOn?.title || ''}"`,
    'by_genre': `Top ${personalized.basedOn} Films`,
    'trending': 'Trending For You',
    'popular': 'Popular Right Now',
  }[personalized.type] || 'Recommended For You';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Content */}
      <div className="space-y-14 py-14" style={{ background: 'var(--bg-primary)' }}>
        {/* Genre Quick Nav */}
        <section className="px-4 md:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scroll-container">
            {GENRES.map((genre, i) => (
              <motion.div
                key={genre.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/genre/${genre.id}`}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: `${genre.color}15`,
                    border: `1px solid ${genre.color}30`,
                    color: genre.color
                  }}
                >
                  <span>{genre.emoji}</span>
                  {genre.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Personalized */}
        {isAuthenticated && personalized.loaded && personalized.results.length > 0 && (
          <section>
            <div className="flex items-center gap-3 px-4 md:px-8 mb-1">
              {personalized.type === 'because_you_watched' && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                  AI PICKS
                </span>
              )}
            </div>
            <MovieRow
              title={personalizedTitle}
              movies={personalized.results}
              loading={personalized.loading}
              cardSize="lg"
            />
          </section>
        )}

        {/* Trending */}
        <MovieRow
          title="Trending This Week"
          subtitle="What the world is watching right now"
          movies={trending.results}
          loading={trending.loading}
          viewAllLink="/movies/trending"
          cardSize="lg"
        />

        {/* Popular */}
        <MovieRow
          title="Popular Movies"
          movies={popular.results}
          loading={popular.loading}
          viewAllLink="/movies/popular"
        />

        {/* Top Rated */}
        <MovieRow
          title="All-Time Greats"
          subtitle="The highest rated films ever made"
          movies={topRated.results}
          loading={topRated.loading}
          viewAllLink="/movies/top-rated"
        />

        {/* Genre Spotlight */}
        <section className="px-4 md:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Browse by Genre</h2>
              <p className="text-sm text-gray-500 mt-1">Find your perfect watch</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GENRES.slice(0, 8).map((genre, i) => (
              <motion.div
                key={genre.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/genre/${genre.id}`}
                  className="block p-6 rounded-2xl relative overflow-hidden group transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${genre.color}20, ${genre.color}05)`,
                    border: `1px solid ${genre.color}20`,
                  }}
                >
                  <span className="text-3xl mb-3 block">{genre.emoji}</span>
                  <span className="font-bold text-white">{genre.name}</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `${genre.color}10` }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
