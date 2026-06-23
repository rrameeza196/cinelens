import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { moviesAPI, ratingsAPI, imgUrl, backdropUrl } from '../api';
import { openTrailerModal } from '../store/slices/uiSlice';
import { useWatchlist } from '../hooks';
import MovieRow from '../components/movie/MovieRow';
import StarRating from '../components/common/StarRating';
import toast from 'react-hot-toast';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { inWatchlist, toggle } = useWatchlist(movie);

  useEffect(() => {
    setLoading(true);
    setMovie(null);
    Promise.all([
      moviesAPI.details(id),
      moviesAPI.similar(id),
    ]).then(([detailRes, simRes]) => {
      setMovie(detailRes.data);
      setSimilar(simRes.data.results?.slice(0, 15));
      setLoading(false);
    }).catch(() => { setLoading(false); navigate('/404'); });

    if (isAuthenticated) {
      ratingsAPI.getForMovie(id).then(({ data }) => {
        if (data.rating) {
          setUserRating(data.rating.rating);
          setReview(data.rating.review || '');
        }
      }).catch(() => {});
    }

    window.scrollTo(0, 0);
  }, [id]);

  const openTrailer = () => {
    const trailer = movie?.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer')
      || movie?.videos?.results?.[0];
    if (trailer) dispatch(openTrailerModal({ key: trailer.key, title: movie.title }));
    else toast.error('No trailer available');
  };

  const submitRating = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!userRating) { toast.error('Select a rating first'); return; }
    setRatingLoading(true);
    try {
      await ratingsAPI.rate({
        movieId: movie.id,
        rating: userRating,
        review,
        movieTitle: movie.title,
        posterPath: movie.poster_path
      });
      toast.success('Rating saved!');
    } catch { toast.error('Failed to save rating'); }
    finally { setRatingLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="skeleton h-[500px] w-full" />
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8 space-y-4">
          <div className="skeleton h-10 w-1/2 rounded" />
          <div className="skeleton h-5 w-1/3 rounded" />
          <div className="skeleton h-32 w-full rounded" />
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const trailer = movie.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  const director = movie.credits?.crew?.find(c => c.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <div className="min-h-screen">
      {/* Backdrop Hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {movie.backdrop_path && (
          <img
            src={backdropUrl(movie.backdrop_path)}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.2) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(0deg, rgba(10,10,15,1) 0%, transparent 60%)'
        }} />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 z-10 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors glass px-3 py-2 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-8 items-end md:items-end"
          >
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <img
                src={movie.poster_path ? imgUrl(movie.poster_path, 'w342') : ''}
                alt={movie.title}
                className="w-44 rounded-xl shadow-2xl"
                style={{ border: '2px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {movie.genres?.slice(0, 3).map(g => (
                  <span key={g.id} className="px-2 py-1 rounded-md text-xs font-semibold glass text-gray-300">
                    {g.name}
                  </span>
                ))}
                {movie.adult && (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">18+</span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-2">{movie.title}</h1>

              {movie.tagline && (
                <p className="text-gray-400 italic mb-4 text-lg">"{movie.tagline}"</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-amber-400 text-base">★</span>
                    <span className="font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-500">({(movie.vote_count / 1000).toFixed(1)}k)</span>
                  </span>
                )}
                {movie.release_date && <span className="text-gray-400">{movie.release_date.split('-')[0]}</span>}
                {runtime && <span className="text-gray-400">{runtime}</span>}
                {movie.original_language && (
                  <span className="uppercase text-xs font-bold glass px-2 py-1 rounded">
                    {movie.original_language}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={openTrailer}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {trailer ? 'Watch Trailer' : 'No Trailer'}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={toggle}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    inWatchlist
                      ? 'bg-fuchsia-500 text-white'
                      : 'glass-strong text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-1 mb-10 p-1 glass rounded-xl w-fit">
          {['overview', 'cast', 'rate'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold mb-4">Overview</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">{movie.overview}</p>

                  {director && (
                    <div className="mt-6 flex items-center gap-3 p-4 glass rounded-xl w-fit">
                      <span className="text-gray-500 text-sm">Directed by</span>
                      <span className="font-bold text-white">{director.name}</span>
                    </div>
                  )}
                </div>

                {/* Details sidebar */}
                <div className="space-y-4">
                  {[
                    { label: 'Status', value: movie.status },
                    { label: 'Budget', value: movie.budget > 0 ? `$${(movie.budget / 1e6).toFixed(1)}M` : null },
                    { label: 'Revenue', value: movie.revenue > 0 ? `$${(movie.revenue / 1e6).toFixed(1)}M` : null },
                    { label: 'Original Title', value: movie.original_title !== movie.title ? movie.original_title : null },
                  ].filter(d => d.value).map(({ label, value }) => (
                    <div key={label} className="p-4 glass rounded-xl">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                      <div className="font-semibold text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cast' && (
            <motion.div key="cast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-bold mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {cast.map(person => (
                  <div key={person.id} className="text-center glass rounded-xl p-4 hover:bg-white/5 transition-colors">
                    <img
                      src={person.profile_path ? imgUrl(person.profile_path, 'w185') : `https://via.placeholder.com/100x100/1a1a2e/ffffff?text=${person.name[0]}`}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                      style={{ border: '2px solid var(--border-strong)' }}
                    />
                    <div className="font-semibold text-white text-sm leading-tight">{person.name}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{person.character}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'rate' && (
            <motion.div key="rate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="max-w-lg">
                <h2 className="text-xl font-bold mb-2">Rate This Movie</h2>
                {!isAuthenticated && (
                  <p className="text-gray-400 text-sm mb-6">
                    <a href="/login" className="text-fuchsia-400 hover:underline">Sign in</a> to rate and review
                  </p>
                )}
                <div className="glass rounded-2xl p-6 space-y-6">
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">Your Rating</label>
                    <StarRating
                      value={userRating}
                      onChange={setUserRating}
                      size="lg"
                      readonly={!isAuthenticated}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Review (optional)</label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      disabled={!isAuthenticated}
                      placeholder="Share your thoughts about this movie..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none disabled:opacity-50"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={submitRating}
                    disabled={!isAuthenticated || ratingLoading}
                    className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white font-bold rounded-xl text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    {ratingLoading ? 'Saving...' : 'Save Rating'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="mt-20">
            <MovieRow
              title="Similar Movies"
              subtitle="You might also enjoy these"
              movies={similar}
              loading={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
