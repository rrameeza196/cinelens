const tmdb = require('../utils/tmdb');
const User = require('../models/User');

// @GET /api/movies/trending
const getTrending = async (req, res) => {
  try {
    const { timeWindow = 'week', page = 1 } = req.query;
    const data = await tmdb.trending(timeWindow, page);
    res.json(data);
  } catch (error) {
    console.error('Trending error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
};

// @GET /api/movies/popular
const getPopular = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdb.popular(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
};

// @GET /api/movies/top-rated
const getTopRated = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdb.topRated(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top rated movies' });
  }
};

// @GET /api/movies/upcoming
const getUpcoming = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdb.upcoming(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
};

// @GET /api/movies/now-playing
const getNowPlaying = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdb.nowPlaying(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch now playing movies' });
  }
};

// @GET /api/movies/search
const searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query?.trim()) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const data = await tmdb.search(query.trim(), page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

// @GET /api/movies/:id
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid movie ID' });

    const data = await tmdb.movieDetails(id);

    // Track recently viewed if user is authenticated
    if (req.user) {
      req.user.addToRecentlyViewed({
        movieId: data.id,
        title: data.title,
        posterPath: data.poster_path
      });
      await req.user.save().catch(() => {}); // Non-blocking
    }

    res.json(data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};

// @GET /api/movies/:id/similar
const getSimilarMovies = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const data = await tmdb.similar(id, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar movies' });
  }
};

// @GET /api/movies/:id/recommendations
const getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const data = await tmdb.recommendations(id, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

// @GET /api/movies/:id/videos
const getVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdb.videos(id);
    // Return only YouTube trailers/teasers
    const filtered = data.results.filter(
      v => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type)
    );
    res.json({ ...data, results: filtered });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

// @GET /api/movies/genre/:genreId
const getByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;
    const data = await tmdb.byGenre(genreId, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies by genre' });
  }
};

// @GET /api/movies/genres/list
const getGenres = async (req, res) => {
  try {
    const data = await tmdb.genres();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

// @GET /api/movies/personalized - Content-based recommendations
const getPersonalizedRecommendations = async (req, res) => {
  try {
    if (!req.user) {
      // Return popular if not logged in
      const data = await tmdb.popular();
      return res.json({ ...data, type: 'popular' });
    }

    const { favoriteGenres, recentlyViewed } = req.user;

    // If they have recently viewed movies, get recommendations from most recent
    if (recentlyViewed?.length > 0) {
      const lastWatched = recentlyViewed[0];
      const [recs, similar] = await Promise.allSettled([
        tmdb.recommendations(lastWatched.movieId),
        tmdb.similar(lastWatched.movieId)
      ]);

      const results = [
        ...(recs.status === 'fulfilled' ? recs.value.results : []),
        ...(similar.status === 'fulfilled' ? similar.value.results : [])
      ];

      // Deduplicate
      const seen = new Set();
      const unique = results.filter(m => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });

      return res.json({
        results: unique.slice(0, 20),
        total_results: unique.length,
        type: 'because_you_watched',
        basedOn: lastWatched
      });
    }

    // If they have genre preferences, discover by genre
    if (favoriteGenres?.length > 0) {
      const genreMap = {
        'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35,
        'Crime': 80, 'Documentary': 99, 'Drama': 18, 'Fantasy': 14,
        'Horror': 27, 'Mystery': 9648, 'Romance': 10749, 'Science Fiction': 878,
        'Thriller': 53, 'War': 10752
      };

      const genreId = genreMap[favoriteGenres[0]];
      if (genreId) {
        const data = await tmdb.byGenre(genreId);
        return res.json({ ...data, type: 'by_genre', basedOn: favoriteGenres[0] });
      }
    }

    // Fallback to trending
    const data = await tmdb.trending('week');
    res.json({ ...data, type: 'trending' });
  } catch (error) {
    console.error('Personalized recs error:', error);
    res.status(500).json({ error: 'Failed to fetch personalized recommendations' });
  }
};

module.exports = {
  getTrending, getPopular, getTopRated, getUpcoming, getNowPlaying,
  searchMovies, getMovieDetails, getSimilarMovies, getRecommendations,
  getVideos, getByGenre, getGenres, getPersonalizedRecommendations
};
