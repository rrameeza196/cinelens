const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0.5,
    max: 5,
    // Allow half-star ratings
    validate: {
      validator: v => v % 0.5 === 0,
      message: 'Rating must be a multiple of 0.5'
    }
  },
  review: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters'],
    default: ''
  },
  movieTitle: String,
  posterPath: String
}, { timestamps: true });

// One rating per user per movie
ratingSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
