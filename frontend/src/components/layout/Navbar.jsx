import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../store/slices/authSlice';
import { toggleSearch } from '../../store/slices/uiSlice';
import { useScrollY } from '../../hooks';
import SearchBar from '../search/SearchBar';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { searchOpen } = useSelector(s => s.ui);
  const scrollY = useScrollY();
  const [profileOpen, setProfileOpen] = useState(false);

  const scrolled = scrollY > 20;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/genre/28', label: 'Action' },
    { to: '/genre/878', label: 'Sci-Fi' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
        style={{
          background: scrolled
            ? 'rgba(10,10,15,0.95)'
            : 'linear-gradient(180deg, rgba(10,10,15,0.8) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-sm">
              C
            </div>
            <span className="font-black text-xl tracking-tight">
              Cine<span className="text-gradient">Lens</span>
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === to
                    ? 'text-fuchsia-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search trigger */}
            <button
              onClick={() => dispatch(toggleSearch())}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {isAuthenticated ? (
              <>
                {/* Watchlist */}
                <Link
                  to="/watchlist"
                  className="hidden sm:flex w-9 h-9 rounded-full glass items-center justify-center text-gray-400 hover:text-fuchsia-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </Link>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-fuchsia-500 transition-all"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-52 glass-strong rounded-xl p-2 shadow-2xl"
                        style={{ border: '1px solid rgba(232,121,249,0.2)' }}
                      >
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                          <div className="text-sm font-semibold">{user?.username}</div>
                          <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>
                        {[
                          { to: '/profile', icon: '👤', label: 'Profile' },
                          { to: '/watchlist', icon: '🎬', label: 'Watchlist' },
                          { to: '/settings', icon: '⚙️', label: 'Settings' },
                        ].map(({ to, icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <span>{icon}</span> {label}
                          </Link>
                        ))}
                        <button
                          onClick={() => { dispatch(logout()); setProfileOpen(false); navigate('/'); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1"
                        >
                          <span>🚪</span> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && <SearchBar />}
      </AnimatePresence>
    </>
  );
}
