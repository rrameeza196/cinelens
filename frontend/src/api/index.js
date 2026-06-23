import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Main API instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinelens_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cinelens_token');
      localStorage.removeItem('cinelens_user');
      // Only redirect if not already on auth page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Image URL helpers
export const imgUrl = (path, size = 'w500') =>
  path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
export const backdropUrl = (path) =>
  path ? `${TMDB_IMAGE_BASE}/original${path}` : null;

// ============ AUTH ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ============ MOVIES ============
export const moviesAPI = {
  trending: (params) => api.get('/movies/trending', { params }),
  popular: (params) => api.get('/movies/popular', { params }),
  topRated: (params) => api.get('/movies/top-rated', { params }),
  upcoming: (params) => api.get('/movies/upcoming', { params }),
  nowPlaying: (params) => api.get('/movies/now-playing', { params }),
  search: (params) => api.get('/movies/search', { params }),
  details: (id) => api.get(`/movies/${id}`),
  similar: (id, params) => api.get(`/movies/${id}/similar`, { params }),
  recommendations: (id, params) => api.get(`/movies/${id}/recommendations`, { params }),
  videos: (id) => api.get(`/movies/${id}/videos`),
  byGenre: (genreId, params) => api.get(`/movies/genre/${genreId}`, { params }),
  genres: () => api.get('/movies/genres/list'),
  personalized: () => api.get('/movies/personalized'),
};

// ============ WATCHLIST ============
export const watchlistAPI = {
  get: (params) => api.get('/watchlist', { params }),
  add: (data) => api.post('/watchlist', data),
  remove: (movieId) => api.delete(`/watchlist/${movieId}`),
  check: (movieId) => api.get(`/watchlist/check/${movieId}`),
};

// ============ RATINGS ============
export const ratingsAPI = {
  rate: (data) => api.post('/ratings', data),
  getForMovie: (movieId) => api.get(`/ratings/movie/${movieId}`),
  getUserRatings: (params) => api.get('/ratings/user', { params }),
  delete: (movieId) => api.delete(`/ratings/${movieId}`),
};

// ============ USER ============
export const userAPI = {
  getRecentlyViewed: () => api.get('/users/recently-viewed'),
  clearHistory: () => api.delete('/users/recently-viewed'),
  updateGenres: (genres) => api.put('/users/genres', { genres }),
};

export default api;
