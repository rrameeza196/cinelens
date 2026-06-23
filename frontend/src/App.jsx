import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { store } from './store';
import { fetchMe, setInitialized } from './store/slices/authSlice';
import { fetchWatchlist } from './store/slices/watchlistSlice';
import { fetchGenres } from './store/slices/moviesSlice';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import TrailerModal from './components/movie/TrailerModal';
import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchPage from './pages/SearchPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';
import GenrePage from './pages/GenrePage';
import MoviesPage from './pages/MoviesPage';
import NotFoundPage from './pages/NotFoundPage';

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 }
};

// No navbar/footer on auth pages
const AUTH_PAGES = ['/login', '/register', '/landing'];

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, initialized } = useSelector(s => s.auth);
  const hideChrome = AUTH_PAGES.includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem('cinelens_token');
    if (token) {
      dispatch(fetchMe());
    } else {
      dispatch(setInitialized());
    }
    dispatch(fetchGenres());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWatchlist());
    }
  }, [isAuthenticated]);

  return (
    <div className="noise">
      {!hideChrome && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} {...PAGE_TRANSITION}>
          <Routes location={location}>
            {/* Public */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/genre/:genreId" element={<GenrePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:category" element={<MoviesPage />} />

            {/* Home — landing for guests, dashboard for users */}
            <Route path="/" element={
              initialized && !isAuthenticated
                ? <LandingPage />
                : <HomePage />
            } />

            {/* Protected */}
            <Route path="/watchlist" element={
              <ProtectedRoute><WatchlistPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {!hideChrome && <Footer />}
      <TrailerModal />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#f0f0f8',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Outfit, sans-serif',
          },
          success: { iconTheme: { primary: '#e879f9', secondary: '#1a1a2e' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1a1a2e' } },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}
