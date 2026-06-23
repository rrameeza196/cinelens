// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, 'Username is required'],
//     unique: true,
//     trim: true,
//     minlength: [3, 'Username must be at least 3 characters'],
//     maxlength: [30, 'Username cannot exceed 30 characters'],
//     match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false // Don't return password by default
//   },
//   avatar: {
//     type: String,
//     default: ''
//   },
//   bio: {
//     type: String,
//     maxlength: [200, 'Bio cannot exceed 200 characters'],
//     default: ''
//   },
//   favoriteGenres: [{
//     type: String
//   }],
//   recentlyViewed: [{
//     movieId: { type: Number, required: true },
//     title: String,
//     posterPath: String,
//     viewedAt: { type: Date, default: Date.now }
//   }],
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// }, { timestamps: true });

// // Hash password before save
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Keep only last 20 recently viewed
// userSchema.methods.addToRecentlyViewed = function(movie) {
//   this.recentlyViewed = this.recentlyViewed.filter(m => m.movieId !== movie.movieId);
//   this.recentlyViewed.unshift(movie);
//   if (this.recentlyViewed.length > 20) {
//     this.recentlyViewed = this.recentlyViewed.slice(0, 20);
//   }
// };

// // Public profile (no sensitive data)
// userSchema.methods.toPublicJSON = function() {
//   return {
//     _id: this._id,
//     username: this.username,
//     email: this.email,
//     avatar: this.avatar,
//     bio: this.bio,
//     favoriteGenres: this.favoriteGenres,
//     recentlyViewed: this.recentlyViewed,
//     createdAt: this.createdAt
//   };
// };

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: ''
  },
  favoriteGenres: [{
    type: String
  }],
  recentlyViewed: [{
    movieId: { type: Number, required: true },
    title: String,
    posterPath: String,
    viewedAt: { type: Date, default: Date.now }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// ✅ FIX: Modern Mongoose async hook (Removed 'next' parameter and calls)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Keep only last 20 recently viewed
userSchema.methods.addToRecentlyViewed = function(movie) {
  this.recentlyViewed = this.recentlyViewed.filter(m => m.movieId !== movie.movieId);
  this.recentlyViewed.unshift(movie);
  if (this.recentlyViewed.length > 20) {
    this.recentlyViewed = this.recentlyViewed.slice(0, 20);
  }
};

// Public profile (no sensitive data)
userSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    favoriteGenres: this.favoriteGenres,
    recentlyViewed: this.recentlyViewed,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);