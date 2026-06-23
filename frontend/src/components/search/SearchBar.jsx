import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setSearchOpen } from '../../store/slices/uiSlice';
import { moviesAPI, imgUrl } from '../../api';
import { useDebounce } from '../../hooks';

export default function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const search = async () => {
      setLoading(true);
      try {
        const { data } = await moviesAPI.search({ query: debouncedQuery, page: 1 });
        setResults(data.results?.slice(0, 8) || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    };
    search();
  }, [debouncedQuery]);

  const close = () => dispatch(setSearchOpen(false));

  const goToMovie = (id) => {
    close();
    navigate(`/movie/${id}`);
  };

  const goToSearch = () => {
    if (!query.trim()) return;
    close();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center pt-20 px-4"
      style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)' }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-2xl"
      >
        {/* Search input */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') goToSearch();
              if (e.key === 'Escape') close();
            }}
            placeholder="Search movies, genres, actors..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl text-lg outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(232,121,249,0.3)',
              color: 'var(--text-primary)',
              boxShadow: '0 0 40px rgba(232,121,249,0.1)'
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="flex items-center gap-4 mt-3 px-2">
          <span className="text-xs text-gray-600">Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-mono">Enter</kbd> to search all results</span>
          <span className="text-xs text-gray-600"><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-mono">Esc</kbd> to close</span>
        </div>

        {/* Results */}
        {(results.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            {loading ? (
              <div className="p-6 text-center text-gray-500 text-sm">Searching...</div>
            ) : (
              results.map((movie) => (
                <motion.button
                  key={movie.id}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                  onClick={() => goToMovie(movie.id)}
                  className="w-full flex items-center gap-4 p-4 border-b last:border-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <img
                    src={movie.poster_path ? imgUrl(movie.poster_path, 'w92') : 'https://via.placeholder.com/40x60/12121f/ffffff?text=?'}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{movie.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {movie.release_date?.split('-')[0]}
                      {movie.vote_average > 0 && ` · ★ ${movie.vote_average.toFixed(1)}`}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              ))
            )}

            {!loading && results.length > 0 && (
              <button
                onClick={goToSearch}
                className="w-full p-3 text-sm text-fuchsia-400 hover:text-fuchsia-300 font-medium transition-colors"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                See all results for "{query}"
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
