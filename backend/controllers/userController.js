const User = require('../models/User');

// @GET /api/users/recently-viewed
const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('recentlyViewed');
    res.json({ recentlyViewed: user.recentlyViewed || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recently viewed' });
  }
};

// @DELETE /api/users/recently-viewed
const clearRecentlyViewed = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $set: { recentlyViewed: [] } });
    res.json({ message: 'Recently viewed cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

// @PUT /api/users/genres
const updateFavoriteGenres = async (req, res) => {
  try {
    const { genres } = req.body;
    if (!Array.isArray(genres)) {
      return res.status(400).json({ error: 'Genres must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { favoriteGenres: genres.slice(0, 5) } }, // max 5 genres
      { new: true }
    );

    res.json({ message: 'Genres updated', favoriteGenres: user.favoriteGenres });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update genres' });
  }
};

module.exports = { getRecentlyViewed, clearRecentlyViewed, updateFavoriteGenres };
