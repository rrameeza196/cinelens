// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { watchlistAPI } from '../../api';
// import toast from 'react-hot-toast';

// export const fetchWatchlist = createAsyncThunk('watchlist/fetch', async () => {
//   const { data } = await watchlistAPI.get();
//   return data;
// });

// export const addToWatchlist = createAsyncThunk('watchlist/add', async (movie, { rejectWithValue }) => {
//   try {
//     const { data } = await watchlistAPI.add(movie);
//     toast.success(`Added "${movie.title}" to watchlist`);
//     return data.item;
//   } catch (err) {
//     if (err.response?.status === 409) {
//       toast.error('Already in watchlist');
//     }
//     return rejectWithValue(err.response?.data?.error);
//   }
// });

// export const removeFromWatchlist = createAsyncThunk('watchlist/remove', async ({ movieId, title }, { rejectWithValue }) => {
//   try {
//     await watchlistAPI.remove(movieId);
//     toast.success(`Removed "${title}" from watchlist`);
//     return movieId;
//   } catch (err) {
//     return rejectWithValue(err.response?.data?.error);
//   }
// });

// const watchlistSlice = createSlice({
//   name: 'watchlist',
//   initialState: {
//     items: [],
//     total: 0,
//     loading: false,
//     loaded: false,
//     movieIds: new Set(),
//   },
//   reducers: {
//     clearWatchlist: (state) => {
//       state.items = [];
//       state.total = 0;
//       state.loaded = false;
//       state.movieIds = new Set();
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWatchlist.pending, (s) => { s.loading = true; })
//       .addCase(fetchWatchlist.fulfilled, (s, { payload }) => {
//         s.loading = false;
//         s.loaded = true;
//         s.items = payload.results;
//         s.total = payload.total;
//         s.movieIds = new Set(payload.results.map(i => i.movieId));
//       })
//       .addCase(addToWatchlist.fulfilled, (s, { payload }) => {
//         s.items.unshift(payload);
//         s.total += 1;
//         s.movieIds.add(payload.movieId);
//       })
//       .addCase(removeFromWatchlist.fulfilled, (s, { payload }) => {
//         s.items = s.items.filter(i => i.movieId !== payload);
//         s.total -= 1;
//         s.movieIds.delete(payload);
//       });
//   }
// });

// export const { clearWatchlist } = watchlistSlice.actions;
// export default watchlistSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { watchlistAPI } from '../../api';
import toast from 'react-hot-toast';

// Async Thunks
export const fetchWatchlist = createAsyncThunk('watchlist/fetch', async () => {
  const { data } = await watchlistAPI.get();
  return data;
});

export const addToWatchlist = createAsyncThunk('watchlist/add', async (movie, { rejectWithValue }) => {
  try {
    const { data } = await watchlistAPI.add(movie);
    toast.success(`Added "${movie.title}" to watchlist`);
    return data.item;
  } catch (err) {
    if (err.response?.status === 409) {
      toast.error('Already in watchlist');
    }
    return rejectWithValue(err.response?.data?.error);
  }
});

export const removeFromWatchlist = createAsyncThunk('watchlist/remove', async ({ movieId, title }, { rejectWithValue }) => {
  try {
    await watchlistAPI.remove(movieId);
    toast.success(`Removed "${title}" from watchlist`);
    return movieId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

// Watchlist Slice
const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    loaded: false,
    movieIds: [], // ✅ FIXED: Changed from new Set() to standard Array for Redux serializability
  },
  reducers: {
    clearWatchlist: (state) => {
      state.items = [];
      state.total = 0;
      state.loaded = false;
      state.movieIds = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Watchlist Cases
      .addCase(fetchWatchlist.pending, (s) => { 
        s.loading = true; 
      })
      .addCase(fetchWatchlist.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.loaded = true;
        
        // ✅ FIXED: Checks if data comes inside '.results' object or direct as an Array
        const watchlistItems = payload?.results || (Array.isArray(payload) ? payload : []);
        
        s.items = watchlistItems;
        s.total = payload?.total || watchlistItems.length;
        
        // ✅ FIXED: Map IDs safely into a standard array
        s.movieIds = watchlistItems.map(i => i.movieId || i.id);
      })
      
      // Add to Watchlist Cases
      .addCase(addToWatchlist.fulfilled, (s, { payload }) => {
        if (payload) {
          s.items.unshift(payload);
          s.total += 1;
          s.movieIds.push(payload.movieId || payload.id);
        }
      })
      
      // Remove from Watchlist Cases
      .addCase(removeFromWatchlist.fulfilled, (s, { payload }) => {
        s.items = s.items.filter(i => (i.movieId !== payload && i.id !== payload));
        s.total -= 1;
        s.movieIds = s.movieIds.filter(id => id !== payload);
      });
  }
});

export const { clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;