import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Adventure'];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(s => s.auth);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated]);

  const handleStep1 = (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    const result = await dispatch(registerUser({ ...form, favoriteGenres: selectedGenres }));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Welcome to CineLens 🎬');
      navigate('/');
    }
  };

  const toggleGenre = (g) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : prev.length < 5 ? [...prev, g] : prev
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-sm">C</div>
          <span className="font-black text-xl">Cine<span className="text-gradient">Lens</span></span>
        </Link>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-fuchsia-500' : 'bg-white/10'}`} />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-3xl font-black mb-2">Create account</h1>
            <p className="text-gray-500 mb-8">Join millions of movie lovers</p>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleStep1} className="space-y-4">
              {[
                { field: 'username', label: 'Username', type: 'text', placeholder: 'cooluser123' },
                { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label className="text-sm font-medium text-gray-400 block mb-2">{label}</label>
                  <input
                    type={type}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    placeholder={placeholder}
                    required
                    className="w-full px-4 py-3.5 rounded-xl outline-none text-white placeholder:text-gray-600 transition-all"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '15px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(232,121,249,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full px-4 py-3.5 pr-12 rounded-xl outline-none text-white placeholder:text-gray-600"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '15px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(232,121,249,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.98 }} type="submit"
                className="w-full py-4 rounded-xl font-bold text-black text-sm mt-2"
                style={{ background: 'linear-gradient(135deg, #e879f9, #a78bfa)' }}>
                Continue →
              </motion.button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-black mb-2">Pick your genres</h1>
            <p className="text-gray-500 mb-2">Select up to 5 favorites for personalized picks</p>
            <p className="text-xs text-gray-600 mb-6">{selectedGenres.length}/5 selected</p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {GENRES.map(genre => (
                <motion.button
                  key={genre}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleGenre(genre)}
                  className={`p-3 rounded-xl text-sm font-semibold text-left transition-all ${
                    selectedGenres.includes(genre)
                      ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300'
                      : 'glass text-gray-400 hover:text-white'
                  }`}
                  style={{ border: `1px solid ${selectedGenres.includes(genre) ? 'rgba(232,121,249,0.4)' : 'var(--border)'}` }}
                >
                  <span className="mr-2">{selectedGenres.includes(genre) ? '✓' : '+'}</span>
                  {genre}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="px-6 py-4 rounded-xl glass text-gray-400 hover:text-white text-sm font-semibold transition-colors">
                Back
              </button>
              <motion.button whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading}
                className="flex-1 py-4 rounded-xl font-bold text-black text-sm disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #e879f9, #a78bfa)' }}>
                {loading ? 'Creating account...' : 'Start Watching 🎬'}
              </motion.button>
            </div>
          </>
        )}

        <p className="text-center text-gray-500 text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
