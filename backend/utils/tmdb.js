const axios = require('axios');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

// Axios instance with auth
const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: TMDB_KEY },
  timeout: 10000
});

// Helper to build image URL
const imageUrl = (path, size = 'w500') => 
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const tmdbService = {
  // Search movies
  search: async (query, page = 1) => {
    const { data } = await tmdb.get('/search/movie', {
      params: { query, page, include_adult: false }
    });
    return data;
  },

  // Get trending movies
  trending: async (timeWindow = 'week', page = 1) => {
    const { data } = await tmdb.get(`/trending/movie/${timeWindow}`, { params: { page } });
    return data;
  },

  // Get popular movies
  popular: async (page = 1) => {
    const { data } = await tmdb.get('/movie/popular', { params: { page } });
    return data;
  },

  // Get top rated
  topRated: async (page = 1) => {
    const { data } = await tmdb.get('/movie/top_rated', { params: { page } });
    return data;
  },

  // Get upcoming
  upcoming: async (page = 1) => {
    const { data } = await tmdb.get('/movie/upcoming', { params: { page } });
    return data;
  },

  // Get movie details
  movieDetails: async (movieId) => {
    const { data } = await tmdb.get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits,videos,similar,recommendations,images' }
    });
    return data;
  },

  // Get movies by genre
  byGenre: async (genreId, page = 1) => {
    const { data } = await tmdb.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
        include_adult: false
      }
    });
    return data;
  },

  // Get all genres
  genres: async () => {
    const { data } = await tmdb.get('/genre/movie/list');
    return data;
  },

  // Get movie recommendations
  recommendations: async (movieId, page = 1) => {
    const { data } = await tmdb.get(`/movie/${movieId}/recommendations`, { params: { page } });
    return data;
  },

  // Get similar movies
  similar: async (movieId, page = 1) => {
    const { data } = await tmdb.get(`/movie/${movieId}/similar`, { params: { page } });
    return data;
  },

  // Get movie videos (trailers)
  videos: async (movieId) => {
    const { data } = await tmdb.get(`/movie/${movieId}/videos`);
    return data;
  },

  // Multi-search (movies + people + shows)
  multiSearch: async (query, page = 1) => {
    const { data } = await tmdb.get('/search/multi', {
      params: { query, page, include_adult: false }
    });
    return data;
  },

  // Now playing
  nowPlaying: async (page = 1) => {
    const { data } = await tmdb.get('/movie/now_playing', { params: { page } });
    return data;
  },

  imageUrl
};

module.exports = tmdbService;
