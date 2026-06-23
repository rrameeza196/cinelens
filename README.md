# 🎬 CineLens

A full-stack movie discovery and tracking web app built with the **MERN stack**. Browse trending movies, get personalized recommendations, manage your watchlist, rate films, and search across thousands of titles — all powered by the TMDB API.



\## 🌐 Live Demo

🔗 Live App: https://cinelens-indol.vercel.app

🔗 \*\*Backend API:\*\* https://cinelens-production.up.railway.app



\---

## 🖥️ Live Features

* 🔐 **JWT Authentication** — Register, login, and stay logged in securely
* 🎯 **Personalized Recommendations** — Based on your watch history and favorite genres
* 🎥 **Hero Section** — Auto-rotating trending movies with trailer previews
* 🔍 **Search** — Search across thousands of movies in real time
* 📋 **Watchlist** — Add/remove movies, persisted to your account
* ⭐ **Ratings** — Rate any movie and view your rating history
* 🎭 **Browse by Genre** — Filter movies by Action, Horror, Comedy, Sci-Fi, and more
* 👤 **Profile Page** — Update bio, avatar, and favorite genres
* 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

\---

## 🛠️ Tech Stack

### Frontend

|Tech|Purpose|
|-|-|
|React 19|UI components and pages|
|Vite|Dev server and bundler|
|Redux Toolkit|Global state (auth, movies, watchlist)|
|React Router v7|Client-side routing and navigation|
|Tailwind CSS v4|Styling and dark theme|
|Framer Motion|Page transitions and animations|
|Axios|HTTP requests to the backend API|
|React Hot Toast|Success/error notifications|

### Backend

|Tech|Purpose|
|-|-|
|Node.js|JavaScript runtime|
|Express.js|REST API server|
|MongoDB Atlas|Cloud database|
|Mongoose|Database models and queries|
|JWT|Secure authentication tokens|
|bcryptjs|Password hashing|
|express-validator|Input validation|
|Helmet|HTTP security headers|
|Morgan|Request logging|
|express-rate-limit|API rate limiting (100 req / 15 min)|

### External

|Tech|Purpose|
|-|-|
|TMDB API|Movie data, posters, trailers, genres|

\---

## 📁 Project Structure

```
cinelens/
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance + all API calls
│   │   ├── components/
│   │   │   ├── common/      # ProtectedRoute, ErrorBoundary, StarRating
│   │   │   ├── home/        # HeroSection
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── movie/       # MovieCard, MovieRow, TrailerModal, Skeleton
│   │   │   └── search/      # SearchBar
│   │   ├── hooks/           # useWatchlist, useDebounce, useScrollY, etc.
│   │   ├── pages/           # All page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── MovieDetailsPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── WatchlistPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── GenrePage.jsx
│   │   │   ├── MoviesPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   └── store/           # Redux store + slices
│   │       └── slices/      # authSlice, moviesSlice, watchlistSlice, uiSlice
│   ├── .env.example
│   └── vite.config.js
│
└── backend/
    ├── config/              # MongoDB connection
    ├── controllers/         # Business logic per feature
    │   ├── authController.js
    │   ├── movieController.js
    │   ├── watchlistController.js
    │   ├── ratingController.js
    │   └── userController.js
    ├── middleware/          # JWT auth middleware (strict + optional)
    ├── models/              # Mongoose schemas
    │   ├── User.js
    │   ├── Watchlist.js
    │   └── Rating.js
    ├── routes/              # Express route definitions
    ├── utils/               # TMDB API helper, JWT token util
    ├── .env.example
    └── server.js
```

\---

## 🚀 Getting Started

### Prerequisites

* Node.js v18+
* A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
* A free [TMDB API key](https://www.themoviedb.org/settings/api)

\---

### 1\. Clone the repo

```bash
git clone https://github.com/YOUR\_USERNAME/cinelens.git
cd cinelens
```

\---

### 2\. Set up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
PORT=5000
NODE\_ENV=development
MONGO\_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cinelens
JWT\_SECRET=your\_super\_secret\_key\_minimum\_32\_characters
JWT\_EXPIRES\_IN=7d
TMDB\_API\_KEY=your\_tmdb\_api\_key\_here
CLIENT\_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

You should see:

```
🎬 CineLens API running on port 5000
📺 Environment: development
✅ MongoDB Connected: ...
```

\---

### 3\. Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

The default value works for local development:

```env
VITE\_API\_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

\---

## 🔌 API Endpoints

### Auth — `/api/auth`

|Method|Route|Auth|Description|
|-|-|-|-|
|POST|`/register`|❌|Create new account|
|POST|`/login`|❌|Login and get JWT token|
|GET|`/me`|✅|Get logged-in user profile|
|PUT|`/update-profile`|✅|Update bio, avatar, genres|
|PUT|`/change-password`|✅|Change password|

### Movies — `/api/movies`

|Method|Route|Auth|Description|
|-|-|-|-|
|GET|`/trending`|❌|Trending movies this week|
|GET|`/popular`|❌|Most popular movies|
|GET|`/top-rated`|❌|Highest rated movies|
|GET|`/upcoming`|❌|Upcoming releases|
|GET|`/now-playing`|❌|Currently in theatres|
|GET|`/search?query=`|❌|Search movies|
|GET|`/genres/list`|❌|All genre categories|
|GET|`/genre/:genreId`|❌|Movies by genre|
|GET|`/:id`|Optional|Movie details + track view|
|GET|`/:id/similar`|❌|Similar movies|
|GET|`/:id/recommendations`|❌|TMDB recommendations|
|GET|`/:id/videos`|❌|Trailers and teasers|
|GET|`/personalized`|Optional|Smart recommendations|

### Watchlist — `/api/watchlist`

|Method|Route|Auth|Description|
|-|-|-|-|
|GET|`/`|✅|Get user's watchlist|
|POST|`/`|✅|Add movie to watchlist|
|DELETE|`/:movieId`|✅|Remove from watchlist|
|GET|`/check/:movieId`|✅|Check if movie is in watchlist|

### Ratings — `/api/ratings`

|Method|Route|Auth|Description|
|-|-|-|-|
|POST|`/`|✅|Rate a movie|
|GET|`/movie/:movieId`|❌|Get ratings for a movie|
|GET|`/user`|✅|Get user's own ratings|
|DELETE|`/:movieId`|✅|Delete a rating|

### Users — `/api/users`

|Method|Route|Auth|Description|
|-|-|-|-|
|GET|`/recently-viewed`|✅|Get recently viewed movies|
|DELETE|`/recently-viewed`|✅|Clear watch history|
|PUT|`/genres`|✅|Update favorite genres|

\---

## ⚙️ How Personalized Recommendations Work

The `/api/movies/personalized` endpoint uses a 3-tier fallback logic:

1. **Recently watched** → Fetches TMDB recommendations + similar movies based on the last movie you viewed, deduplicates them, and returns the top 20
2. **Favorite genres** → If no watch history, discovers movies by your top selected genre
3. **Trending fallback** → If no history or genres, returns this week's trending movies

\---

## 🔒 Security Features

* Passwords hashed with **bcryptjs** (12 salt rounds)
* JWT tokens expire after **7 days**
* HTTP headers secured with **Helmet**
* API rate limited to **100 requests per 15 minutes**
* CORS restricted to the frontend origin
* Input validation on all auth routes via **express-validator**
* Passwords never returned in API responses (`select: false`)

\---

## 🌍 Environment Variables

### Backend `.env`

|Variable|Required|Description|
|-|-|-|
|`PORT`|No|Server port (default: 5000)|
|`NODE\_ENV`|No|`development` or `production`|
|`MONGO\_URI`|✅|MongoDB Atlas connection string|
|`JWT\_SECRET`|✅|Secret key for signing tokens (min 32 chars)|
|`JWT\_EXPIRES\_IN`|No|Token expiry (default: 7d)|
|`TMDB\_API\_KEY`|✅|Your TMDB API key|
|`CLIENT\_URL`|No|Frontend URL for CORS (default: localhost:5173)|

### Frontend `.env`

|Variable|Required|Description|
|-|-|-|
|`VITE\_API\_URL`|No|Backend API base URL (default: localhost:5000/api)|

\---

## 📦 Scripts

### Backend

```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Start without nodemon (production)
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

\---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

\---

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

\---

## 🙏 Acknowledgements

* [TMDB](https://www.themoviedb.org/) for the movie data API
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for the free database tier
* [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling
* [Framer Motion](https://www.framer.com/motion/) for the smooth animations

