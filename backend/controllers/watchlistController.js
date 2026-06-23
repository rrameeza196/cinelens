const Watchlist = require('../models/Watchlist');

// @GET /api/watchlist
const getWatchlist = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Watchlist.find({ user: req.userId })
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Watchlist.countDocuments({ user: req.userId })
    ]);

    res.json({
      results: items,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

// @POST /api/watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { movieId, title, posterPath, backdropPath, overview, releaseDate, voteAverage, genres } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({ error: 'Movie ID and title are required' });
    }

    const existing = await Watchlist.findOne({ user: req.userId, movieId });
    if (existing) {
      return res.status(409).json({ error: 'Movie already in watchlist' });
    }

    const item = await Watchlist.create({
      user: req.userId,
      movieId, title, posterPath, backdropPath, overview, releaseDate, voteAverage, genres
    });

    res.status(201).json({ message: 'Added to watchlist', item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};

// @DELETE /api/watchlist/:movieId
const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const result = await Watchlist.findOneAndDelete({ user: req.userId, movieId: Number(movieId) });

    if (!result) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};

// @GET /api/watchlist/check/:movieId
const checkInWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const exists = await Watchlist.exists({ user: req.userId, movieId: Number(movieId) });
    res.json({ inWatchlist: !!exists });
  } catch (error) {
    res.status(500).json({ error: 'Check failed' });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist, checkInWatchlist };
