import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWatchlist, removeFromWatchlist } from '../store/slices/watchlistSlice';
import { imgUrl } from '../api';

export default function WatchlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading, loaded } = useSelector(s => s.watchlist);
  const { isAuthenticated } = useSelector(s => s.auth);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!loaded) dispatch(fetchWatchlist());
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black">My Watchlist</h1>
            <p className="text-gray-500 mt-1">
              {total > 0 ? `${total} movie${total !== 1 ? 's' : ''} saved` : 'Nothing saved yet'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-36 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6">📽️</div>
            <h2 className="text-2xl font-bold mb-3">Your watchlist is empty</h2>
            <p className="text-gray-500 mb-8">Save movies you want to watch later</p>
            <Link to="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #e879f9, #a78bfa)' }}>
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.03 }}
                  className="group flex gap-4 p-4 rounded-2xl glass hover:bg-white/5 transition-all cursor-pointer"
                  onClick={() => navigate(`/movie/${item.movieId}`)}
                >
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.posterPath ? imgUrl(item.posterPath, 'w154') : 'https://via.placeholder.com/80x120/12121f/fff?text=?'}
                      alt={item.title}
                      className="w-16 h-24 object-cover rounded-xl"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white group-hover:text-fuchsia-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      {item.releaseDate && (
                        <span className="text-xs text-gray-500">{item.releaseDate.split('-')[0]}</span>
                      )}
                      {item.voteAverage > 0 && (
                        <span className="text-xs text-amber-400">★ {item.voteAverage?.toFixed(1)}</span>
                      )}
                    </div>
                    {item.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.genres.slice(0, 3).map(g => (
                          <span key={g} className="px-2 py-0.5 rounded text-xs glass text-gray-400">{g}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-600 line-clamp-2">{item.overview}</p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromWatchlist({ movieId: item.movieId, title: item.title }));
                    }}
                    className="flex-shrink-0 self-start w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
