const router = require('express').Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist, checkInWatchlist } = require('../controllers/watchlistController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);
router.get('/check/:movieId', checkInWatchlist);

module.exports = router;
