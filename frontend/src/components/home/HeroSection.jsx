import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { backdropUrl, imgUrl, moviesAPI } from '../../api';
import { openTrailerModal } from '../../store/slices/uiSlice';
import { useWatchlist } from '../../hooks';

export default function HeroSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const featured = movies[current];
  const { inWatchlist, toggle } = useWatchlist(featured);

  useEffect(() => {
    moviesAPI.trending({ timeWindow: 'week' }).then(({ data }) => {
      setMovies(data.results?.slice(0, 5) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Auto-advance
  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % movies.length), 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const openTrailer = async () => {
    if (!featured) return;
    try {
      const { data } = await moviesAPI.videos(featured.id);
      const trailer = data.results?.[0];
      if (trailer) dispatch(openTrailerModal({ key: trailer.key, title: featured.title }));
    } catch {}
  };

  if (loading) {
    return <div className="h-screen skeleton" />;
  }

  if (!featured) return null;

  return (
    <div className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={backdropUrl(featured.backdrop_path)}
            alt={featured.title}
            className="w-full h-full object-cover"
          />
          {/* Overlays */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(10,10,15,0.9) 0%, rgba(10,10,15,0.4) 50%, rgba(10,10,15,0.2) 100%)'
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(0deg, rgba(10,10,15,1) 0%, rgba(10,10,15,0.3) 40%, transparent 70%)'
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* Tags */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 rounded-md text-xs font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                TRENDING #{current + 1}
              </span>
              <span className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                ★ {featured.vote_average?.toFixed(1)}
              </span>
              <span className="text-gray-400 text-sm">
                {featured.release_date?.split('-')[0]}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-4 tracking-tight">
              {featured.title}
            </h1>

            {/* Overview */}
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 line-clamp-3 max-w-xl">
              {featured.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/movie/${featured.id}`)}
                className="flex items-center gap-2 px-8 py-3.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                View Details
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openTrailer}
                className="flex items-center gap-2 px-8 py-3.5 glass-strong text-white font-bold rounded-xl text-sm hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Trailer
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggle}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  inWatchlist
                    ? 'bg-fuchsia-500 text-white'
                    : 'glass-strong text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="flex items-center gap-2 mt-8">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-2 bg-fuchsia-400'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
