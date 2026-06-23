import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { moviesAPI } from '../api';
import { useDebounce, useInfiniteScroll } from '../hooks';
import MovieCard from '../components/movie/MovieCard';
import MovieCardSkeleton from '../components/movie/MovieCardSkeleton';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  // New search
  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setTotalResults(0); return; }
    setSearchParams({ q: debouncedQuery });
    setPage(1);
    setLoading(true);
    moviesAPI.search({ query: debouncedQuery, page: 1 }).then(({ data }) => {
      setResults(data.results || []);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [debouncedQuery]);

  // Load more
  const loadMore = () => {
    if (loadingMore || page >= totalPages) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    moviesAPI.search({ query: debouncedQuery, page: nextPage }).then(({ data }) => {
      setResults(prev => [...prev, ...(data.results || [])]);
      setPage(nextPage);
      setLoadingMore(false);
    }).catch(() => setLoadingMore(false));
  };

  const lastRef = useInfiniteScroll(loadMore, page < totalPages);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Search bar */}
      <div className="mb-10">
        <div className="relative max-w-2xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search movies..."
            autoFocus
            className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg outline-none text-white placeholder:text-gray-600 transition-all"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(232,121,249,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        {totalResults > 0 && (
          <p className="text-sm text-gray-500 mt-3">
            Found <span className="text-white font-semibold">{totalResults.toLocaleString()}</span> results for "{debouncedQuery}"
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie, i) => (
              <MovieCard key={`${movie.id}-${i}`} movie={movie} index={i % 20} />
            ))}
          </div>
          {/* Infinite scroll sentinel */}
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
      ) : query && !loading ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">No results found</h2>
          <p className="text-gray-500">Try different keywords or check the spelling</p>
        </div>
      ) : !query ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold mb-2">Search for any movie</h2>
          <p className="text-gray-500">Type a title, actor, or genre above</p>
        </div>
      ) : null}
    </div>
  );
}
