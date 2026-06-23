const router = require('express').Router();
const { getRecentlyViewed, clearRecentlyViewed, updateFavoriteGenres } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.get('/recently-viewed', getRecentlyViewed);
router.delete('/recently-viewed', clearRecentlyViewed);
router.put('/genres', updateFavoriteGenres);

module.exports = router;
