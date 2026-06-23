# 🎬 CineLens — Premium Movie Discovery Platform

A full-stack movie recommendation platform built with React + Node.js, powered by the TMDB API.

---

## 🚀 Tech Stack

| Layer      | Tech                                             |
|------------|--------------------------------------------------|
| Frontend   | React 18 + Vite, Tailwind CSS, Framer Motion    |
| State      | Redux Toolkit + React Hot Toast                  |
| Backend    | Node.js + Express.js (MVC)                       |
| Database   | MongoDB Atlas (Mongoose)                         |
| Auth       | JWT + bcryptjs                                   |
| API        | TMDB (The Movie Database)                        |
| Deploy     | Frontend → Vercel · Backend → Render             |

---

## 📁 Project Structure

```
cinelens/
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios API clients
│   │   ├── components/   # Reusable UI components
│   │   │   ├── common/   # StarRating, ProtectedRoute
│   │   │   ├── home/     # HeroSection
│   │   │   ├── layout/   # Navbar, Footer
│   │   │   ├── movie/    # MovieCard, MovieRow, TrailerModal
│   │   │   └── search/   # SearchBar
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Route-level pages
│   │   ├── store/        # Redux slices
│   │   └── main.jsx
│   └── .env.example
└── backend/
    ├── config/           # DB connection
    ├── controllers/      # Business logic
    ├── middleware/        # Auth middleware
    ├── models/           # Mongoose schemas
    ├── routes/           # Express routers
    ├── utils/            # TMDB service, JWT helpers
    ├── server.js
    └── .env.example
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd cinelens

# Backend
cd backend
npm install
cp .env.example .env    # Fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env    # Fill in your values
```

### 2. Get Your API Keys

**TMDB API Key:**
1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Sign up / log in
3. Request an API key (free)
4. Copy the **API Key (v3 auth)**

**MongoDB Atlas:**
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with password
4. Get the connection string (replace `<password>`)

### 3. Environment Variables

**backend/.env:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cinelens
JWT_SECRET=your_super_secret_32_char_key_here
JWT_EXPIRES_IN=7d
TMDB_API_KEY=your_tmdb_api_key
CLIENT_URL=http://localhost:5173
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev     # Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev     # Runs on http://localhost:5173
```

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Push to GitHub → Import in Vercel
# Add env: VITE_API_URL=https://your-render-url.onrender.com/api
```

### Backend → Render

1. Push backend folder to GitHub
2. New Web Service on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all env variables from `.env.example`

---

## 🗃️ MongoDB Models

### User
```
username, email, password (hashed), avatar, bio,
favoriteGenres[], recentlyViewed[], createdAt
```

### Watchlist
```
user (ref), movieId, title, posterPath, overview,
releaseDate, voteAverage, genres[], addedAt
```

### Rating
```
user (ref), movieId, rating (0.5–5), review,
movieTitle, posterPath, createdAt
```

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register    — Create account
POST /api/auth/login       — Sign in
GET  /api/auth/me          — Get current user
PUT  /api/auth/update-profile
```

### Movies (public)
```
GET /api/movies/trending
GET /api/movies/popular
GET /api/movies/top-rated
GET /api/movies/upcoming
GET /api/movies/now-playing
GET /api/movies/search?query=...
GET /api/movies/:id
GET /api/movies/:id/similar
GET /api/movies/:id/recommendations
GET /api/movies/:id/videos
GET /api/movies/genre/:genreId
GET /api/movies/genres/list
GET /api/movies/personalized  (auth optional)
```

### Watchlist (auth required)
```
GET    /api/watchlist
POST   /api/watchlist
DELETE /api/watchlist/:movieId
GET    /api/watchlist/check/:movieId
```

### Ratings (auth required)
```
POST   /api/ratings
GET    /api/ratings/user
GET    /api/ratings/movie/:movieId
DELETE /api/ratings/:movieId
```

---

## ✨ Features

- 🎬 TMDB API integration (trending, popular, top-rated, search)
- 🤖 Personalized recommendations (content-based filtering)
- 📋 Watchlist with MongoDB persistence
- ⭐ Half-star rating system with reviews
- 🎥 YouTube trailer modal
- 🔍 Debounced search with instant results
- ♾️ Infinite scroll on browse pages
- 🏠 Hero section with auto-rotating featured movies
- 🎭 Browse by genre
- 🕐 Watch history tracking
- 🛡️ JWT auth with protected routes
- 📱 Fully responsive (mobile/tablet/desktop)
- ✨ Framer Motion page transitions + card animations
- 💀 Skeleton loading states
- 🌌 Dark cinematic theme with glassmorphism

---

## 📸 Pages

| Page | Route |
|------|-------|
| Landing | `/` (guest) |
| Home Dashboard | `/` (logged in) |
| Login | `/login` |
| Register | `/register` |
| Movie Details | `/movie/:id` |
| Search | `/search?q=...` |
| Genre | `/genre/:id` |
| Browse | `/movies` |
| Watchlist | `/watchlist` |
| Profile | `/profile` |

---

Built with 🎬 by CineLens
