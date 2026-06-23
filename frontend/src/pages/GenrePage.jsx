import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { moviesAPI } from '../api';
import { useInfiniteScroll } from '../hooks';
import MovieCard from '../components/movie/MovieCard';
import MovieCardSkeleton from '../components/movie/MovieCardSkeleton';

export default function GenrePage() {
  const { genreId } = useParams();
  const genres = useSelector(s => s.movies.genres);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const genreName = genres.find(g => g.id === parseInt(genreId))?.name || 'Movies';

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setLoading(true);
    moviesAPI.byGenre(genreId, { page: 1 }).then(({ data }) => {
      setMovies(data.results || []);
      setTotalPages(data.total_pages);
      setLoading(false);
    }).catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [genreId]);

  const loadMore = () => {
    if (loadingMore || page >= totalPages) return;
    const next = page + 1;
    setLoadingMore(true);
    moviesAPI.byGenre(genreId, { page: next }).then(({ data }) => {
      setMovies(prev => [...prev, ...(data.results || [])]);
      setPage(next);
      setLoadingMore(false);
    }).catch(() => setLoadingMore(false));
  };

  const lastRef = useInfiniteScroll(loadMore, page < totalPages);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black">{genreName}</h1>
        <p className="text-gray-500 mt-1">Explore the best {genreName.toLowerCase()} films</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => <MovieCardSkeleton key={i} />)}
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
