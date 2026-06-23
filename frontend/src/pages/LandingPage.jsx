import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

const FEATURES = [
  { icon: '🎬', title: 'Discover Movies', desc: 'Browse thousands of films across every genre imaginable' },
  { icon: '🤖', title: 'AI Recommendations', desc: 'Get personalized picks based on what you watch and love' },
  { icon: '📋', title: 'Smart Watchlist', desc: 'Save movies to watch later with one click from anywhere' },
  { icon: '⭐', title: 'Rate & Review', desc: 'Share your opinions and build your cinematic taste profile' },
  { icon: '🔥', title: 'Trending Now', desc: 'Always know what the world is watching this week' },
  { icon: '🎭', title: 'Browse Genres', desc: 'Deep dive into Action, Horror, Romance, Sci-Fi and more' },
];

export default function LandingPage() {
  const { isAuthenticated } = useSelector(s => s.auth);
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
            width: '800px', height: '800px',
            background: 'radial-gradient(circle, rgba(232,121,249,0.08) 0%, transparent 70%)',
          }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="max-w-4xl relative z-10">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm font-semibold text-fuchsia-300"
            style={{ border: '1px solid rgba(232,121,249,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
            Powered by TMDB · 100% Free
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight">
            Your movie life,<br />
            <span className="text-gradient">reimagined.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover films you'll love, track what you watch, and get personalized recommendations — all in one beautiful, cinematic experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-black text-base"
                style={{ background: 'linear-gradient(135deg, #e879f9, #a78bfa)' }}>
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
            <Link to="/login" className="px-10 py-4 rounded-2xl font-bold text-white glass text-base hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 text-gray-600 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Features */}
      <div className="py-24 px-4 md:px-8 max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need</h2>
          <p className="text-gray-500 text-lg">One platform for your entire movie life</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 hover:bg-white/5 transition-all group"
              style={{ border: '1px solid var(--border)' }}>
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-bold mb-2 group-hover:text-fuchsia-300 transition-colors">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 px-4 text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to start watching<br /><span className="text-gradient">smarter?</span>
          </h2>
          <Link to="/register"
            className="inline-flex items-center gap-2 px-12 py-5 rounded-2xl font-bold text-black text-lg"
            style={{ background: 'linear-gradient(135deg, #e879f9, #a78bfa)' }}>
            Create Free Account →
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t py-10 px-8 text-center text-sm text-gray-600" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-xs">C</div>
          <span className="font-bold text-white">CineLens</span>
        </div>
        <p>Powered by <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-fuchsia-400 hover:underline">TMDB</a> · Built with ❤️ for film lovers</p>
      </footer>
    </div>
  );
}
