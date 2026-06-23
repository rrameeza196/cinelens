const router = require('express').Router();
const { rateMovie, getMovieRating, getUserRatings, deleteRating } = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.post('/', rateMovie);
router.get('/user', getUserRatings);
router.get('/movie/:movieId', getMovieRating);
router.delete('/:movieId', deleteRating);

module.exports = router;
