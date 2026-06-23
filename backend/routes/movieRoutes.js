const router = require('express').Router();
const {
  getTrending, getPopular, getTopRated, getUpcoming, getNowPlaying,
  searchMovies, getMovieDetails, getSimilarMovies, getRecommendations,
  getVideos, getByGenre, getGenres, getPersonalizedRecommendations
} = require('../controllers/movieController');
const { optionalAuth } = require('../middleware/auth');

// Lists
router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/top-rated', getTopRated);
router.get('/upcoming', getUpcoming);
router.get('/now-playing', getNowPlaying);
router.get('/search', searchMovies);
router.get('/genres/list', getGenres);
router.get('/genre/:genreId', getByGenre);
router.get('/personalized', optionalAuth, getPersonalizedRecommendations);

// Single movie
router.get('/:id', optionalAuth, getMovieDetails);
router.get('/:id/similar', getSimilarMovies);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id/videos', getVideos);

module.exports = router;
