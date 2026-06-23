import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { moviesAPI } from '../api';
import { useInfiniteScroll } from '../hooks';
import MovieCard from '../components/movie/MovieCard';
import MovieCardSkeleton from '../components/movie/MovieCardSkeleton';

const TABS = [
  { key: 'trending', label: '🔥 Trending', title: 'Trending Movies' },
  { key: 'popular', label: '📈 Popular', title: 'Popular Movies' },
  { key: 'top-rated', label: '⭐ Top Rated', title: 'All-Time Greats' },
  { key: 'upcoming', label: '📅 Upcoming', title: 'Coming Soon' },
  { key: 'now-playing', label: '🎭 Now Playing', title: 'Now Playing' },
];

const fetchers = {
  trending: (p) => moviesAPI.trending({ page: p }),
  popular: (p) => moviesAPI.popular({ page: p }),
  'top-rated': (p) => moviesAPI.topRated({ page: p }),
  upcoming: (p) => moviesAPI.upcoming({ page: p }),
  'now-playing': (p) => moviesAPI.nowPlaying({ page: p }),
};

export default function MoviesPage() {
  const { category = 'trending' } = useParams();
  const [activeTab, setActiveTab] = useState(category);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setLoading(true);
    fetchers[activeTab]?.(1).then(({ data }) => {
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      setLoading(false);
    }).catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [activeTab]);

  const loadMore = () => {
    if (loadingMore || page >= totalPages) return;
    const next = page + 1;
    setLoadingMore(true);
    fetchers[activeTab]?.(next).then(({ data }) => {
      setMovies(prev => [...prev, ...(data.results || [])]);
      setPage(next);
      setLoadingMore(false);
    }).catch(() => setLoadingMore(false));
  };

  const lastRef = useInfiniteScroll(loadMore, page < totalPages && page < 10);
  const current = TABS.find(t => t.key === activeTab);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-black mb-8">{current?.title}</motion.h1>

      {/* Tab bar */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scroll-container">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                : 'glass text-gray-400 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 20 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie, i) => (
              <MovieCard key={`${movie.id}-${i}`} movie={movie} index={i % 20} />
            ))}
          </div>
          <div ref={lastRef} className="py-8 flex justify-center">
            {loadingMore && (
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-fuchsia-400" />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
