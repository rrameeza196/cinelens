import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

export default function MovieRow({ title, subtitle, movies, loading, viewAllLink, cardSize = 'md' }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -500 : 500;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="relative">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 px-4 md:px-8">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-bold text-white"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Scroll buttons */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1"
            >
              View all
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="scroll-container flex gap-4 px-4 md:px-8 pb-4"
      >
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies?.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} size={cardSize} />
          ))
        }
      </div>

      {/* Fade edges */}
      <div className="absolute top-12 bottom-0 left-0 w-8 md:w-12 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%)' }} />
      <div className="absolute top-12 bottom-0 right-0 w-8 md:w-12 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, var(--bg-primary) 0%, transparent 100%)' }} />
    </section>
  );
}
