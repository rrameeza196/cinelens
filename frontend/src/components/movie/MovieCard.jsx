import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWatchlist } from '../../hooks';
import { imgUrl } from '../../api';

const PLACEHOLDER = 'https://via.placeholder.com/300x450/12121f/ffffff?text=No+Image';

export default function MovieCard({ movie, index = 0, size = 'md' }) {
  const navigate = useNavigate();
  const { inWatchlist, toggle } = useWatchlist(movie);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  const poster = imgError || !movie.poster_path
    ? PLACEHOLDER
    : imgUrl(movie.poster_path, size === 'lg' ? 'w500' : 'w342');

  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.split('-')[0];

  const sizeClasses = {
    sm: 'min-w-[140px] w-[140px]',
    md: 'min-w-[180px] w-[180px]',
    lg: 'min-w-[220px] w-[220px]',
    xl: 'min-w-[280px] w-[280px]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      className={`${sizeClasses[size]} flex-shrink-0 group relative cursor-pointer`}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      {/* Card */}
      <div
        className="relative rounded-xl overflow-hidden movie-card-glow transition-all duration-300"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-white text-xs font-bold">{rating}</span>
            </div>
          )}

          {/* Watchlist button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              inWatchlist
                ? 'bg-fuchsia-500 text-white'
                : 'bg-black/70 text-gray-300 opacity-0 group-hover:opacity-100'
            }`}
          >
            {inWatchlist ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </motion.button>

          {/* Quick view overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
                className="flex-1 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                View Details
              </motion.button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1 group-hover:text-fuchsia-300 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {year && <span className="text-xs text-gray-500">{year}</span>}
            {movie.vote_count > 0 && (
              <span className="text-xs text-gray-600">• {(movie.vote_count / 1000).toFixed(1)}k votes</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
