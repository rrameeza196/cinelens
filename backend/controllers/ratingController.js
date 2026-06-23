const Rating = require('../models/Rating');

// @POST /api/ratings
const rateMovie = async (req, res) => {
  try {
    const { movieId, rating, review, movieTitle, posterPath } = req.body;

    if (!movieId || !rating) {
      return res.status(400).json({ error: 'Movie ID and rating are required' });
    }

    const ratingDoc = await Rating.findOneAndUpdate(
      { user: req.userId, movieId: Number(movieId) },
      { rating, review, movieTitle, posterPath },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ message: 'Rating saved', rating: ratingDoc });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to save rating' });
  }
};

// @GET /api/ratings/movie/:movieId
const getMovieRating = async (req, res) => {
  try {
    const { movieId } = req.params;
    const rating = await Rating.findOne({ user: req.userId, movieId: Number(movieId) });
    res.json({ rating: rating || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rating' });
  }
};

// @GET /api/ratings/user
const getUserRatings = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      Rating.find({ user: req.userId }).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
      Rating.countDocuments({ user: req.userId })
    ]);

    res.json({ ratings, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get ratings' });
  }
};

// @DELETE /api/ratings/:movieId
const deleteRating = async (req, res) => {
  try {
    const { movieId } = req.params;
    await Rating.findOneAndDelete({ user: req.userId, movieId: Number(movieId) });
    res.json({ message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rating' });
  }
};

module.exports = { rateMovie, getMovieRating, getUserRatings, deleteRating };
