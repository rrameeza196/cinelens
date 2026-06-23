import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { updateProfile } from '../store/slices/authSlice';
import { ratingsAPI, userAPI, imgUrl } from '../api';
import StarRating from '../components/common/StarRating';

const GENRES = ['Action','Comedy','Drama','Horror','Romance','Sci-Fi','Thriller','Documentary','Animation','Adventure'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ bio: user?.bio || '', avatar: user?.avatar || '' });
  const [selectedGenres, setSelectedGenres] = useState(user?.favoriteGenres || []);
  const [ratings, setRatings] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    ratingsAPI.getUserRatings().then(({ data }) => setRatings(data.ratings || [])).catch(() => {});
    userAPI.getRecentlyViewed().then(({ data }) => setRecentlyViewed(data.recentlyViewed || [])).catch(() => {});
  }, [isAuthenticated]);

  const saveProfile = async () => {
    setSaving(true);
    await dispatch(updateProfile({ ...form, favoriteGenres: selectedGenres }));
    setSaving(false);
  };

  const toggleGenre = (g) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : prev.length < 5 ? [...prev, g] : prev
    );
  };

  if (!isAuthenticated || !user) return null;

  const joined = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-12">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden"
            style={{ border: '3px solid rgba(232,121,249,0.3)', background: 'var(--bg-elevated)' }}>
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gradient">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black">{user.username}</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email} · Joined {joined}</p>
          {user.bio && <p className="text-gray-300 mt-2 text-sm max-w-lg">{user.bio}</p>}
        </div>
        <div className="flex gap-4 text-center">
          <div className="glass rounded-xl p-4 min-w-[80px]">
            <div className="text-2xl font-black text-fuchsia-400">{ratings.length}</div>
            <div className="text-xs text-gray-500 mt-1">Ratings</div>
          </div>
          <div className="glass rounded-xl p-4 min-w-[80px]">
            <div className="text-2xl font-black text-violet-400">{recentlyViewed.length}</div>
            <div className="text-xs text-gray-500 mt-1">Watched</div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 p-1 glass rounded-xl w-fit">
        {[
          { key: 'profile', label: 'Edit Profile' },
          { key: 'ratings', label: `Ratings (${ratings.length})` },
          { key: 'history', label: 'Watch History' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
          <div className="glass rounded-2xl p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-400 block mb-2">Avatar URL</label>
              <input value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 rounded-xl outline-none text-white placeholder:text-gray-600"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(232,121,249,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 block mb-2">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={3} maxLength={200} placeholder="Tell people about your movie taste..."
                className="w-full px-4 py-3 rounded-xl outline-none text-white placeholder:text-gray-600 resize-none"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(232,121,249,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <p className="text-xs text-gray-600 mt-1 text-right">{form.bio.length}/200</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-1">Favorite Genres</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedGenres.length}/5 selected — used for personalized recommendations</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GENRES.map(g => (
                <button key={g} onClick={() => toggleGenre(g)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedGenres.includes(g)
                      ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
                      : 'glass text-gray-400 hover:text-white'
                  }`}
                  style={{ border: `1px solid ${selectedGenres.includes(g) ? 'rgba(232,121,249,0.4)' : 'var(--border)'}` }}>
                  {selectedGenres.includes(g) ? '✓ ' : ''}{g}
                </button>
              ))}
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={saveProfile} disabled={saving}
            className="px-8 py-3.5 rounded-xl font-bold text-black text-sm disabled:opacity-60 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #e879f9, #a78bfa)' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </motion.div>
      )}

      {tab === 'ratings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {ratings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">⭐</div>
              <p className="text-gray-500">You haven't rated any movies yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratings.map(r => (
                <div key={r._id}
                  onClick={() => navigate(`/movie/${r.movieId}`)}
                  className="flex gap-4 p-4 glass rounded-2xl cursor-pointer hover:bg-white/5 transition-all group">
                  <img
                    src={r.posterPath ? imgUrl(r.posterPath, 'w92') : 'https://via.placeholder.com/60x90/12121f/fff?text=?'}
                    alt={r.movieTitle}
                    className="w-12 h-18 rounded-lg object-cover flex-shrink-0"
                    style={{ height: '72px' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-fuchsia-300 transition-colors line-clamp-1">{r.movieTitle}</div>
                    <StarRating value={r.rating} readonly size="sm" />
                    {r.review && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.review}</p>}
                    <p className="text-xs text-gray-600 mt-1">{new Date(r.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {tab === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {recentlyViewed.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🕐</div>
              <p className="text-gray-500">No watch history yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {recentlyViewed.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/movie/${item.movieId}`)}
                  className="cursor-pointer group">
                  <div className="rounded-xl overflow-hidden mb-2 glass aspect-[2/3]">
                    <img
                      src={item.posterPath ? imgUrl(item.posterPath, 'w154') : 'https://via.placeholder.com/100x150/12121f/fff?text=?'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1 group-hover:text-white transition-colors">{item.title}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
