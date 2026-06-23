import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a1a3e 100%)'
          }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(232,121,249,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(167,139,250,0.1) 0%, transparent 50%)'
        }} />
        {/* Floating movie cards visual */}
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-center">
          <div className="text-6xl mb-6">🎬</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Your cinematic<br />
            <span className="text-gradient">universe awaits.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
            Discover, track, and get personalized recommendations for every movie you'll ever love.
          </p>
          <div className="flex gap-6 mt-10">
            {['🎭', '🚀', '👻', '💕', '🔍'].map((emoji, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
                className="w-12 h-12 glass rounded-xl flex items-center justify-center text-2xl"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-sm">C</div>
            <span className="font-black text-xl">Cine<span className="text-gradient">Lens</span></span>
          </Link>

          <h1 className="text-3xl font-black mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-400 block mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3.5 rounded-xl outline-none text-white placeholder:text-gray-600 transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  fontSize: '15px'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(232,121,249,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl outline-none text-white placeholder:text-gray-600 transition-all"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    fontSize: '15px'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(232,121,249,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-black text-sm transition-opacity disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #e879f9, #a78bfa)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
