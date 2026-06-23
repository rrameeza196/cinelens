import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../store/slices/watchlistSlice';

// Debounce hook
export const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// Watchlist toggle hook
export const useWatchlist = (movie) => {
  const dispatch = useDispatch();
  const { movieIds } = useSelector(s => s.watchlist);
  const { isAuthenticated } = useSelector(s => s.auth);

  const inWatchlist = movieIds.includes(movie?.id || movie?.movieId);

  const toggle = useCallback((e) => {
    e?.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (!movie) return;

    if (inWatchlist) {
      dispatch(removeFromWatchlist({ movieId: movie.id, title: movie.title }));
    } else {
      dispatch(addToWatchlist({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        overview: movie.overview,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        genres: movie.genres?.map(g => g.name) || movie.genre_ids || []
      }));
    }
  }, [dispatch, inWatchlist, movie, isAuthenticated]);

  return { inWatchlist, toggle };
};

// Infinite scroll hook
export const useInfiniteScroll = (callback, hasMore) => {
  const observer = useRef();
  const lastRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) callback();
    });
    if (node) observer.current.observe(node);
  }, [callback, hasMore]);
  return lastRef;
};

// Local storage hook
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const set = (v) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  };

  return [value, set];
};

// Window scroll position
export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return scrollY;
};

// Click outside hook
export const useClickOutside = (callback) => {
  const ref = useRef();
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) callback(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [callback]);
  return ref;
};
