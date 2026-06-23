import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { moviesAPI } from '../../api';

export const fetchTrending = createAsyncThunk('movies/trending', async (params) => {
  const { data } = await moviesAPI.trending(params);
  return data;
});

export const fetchPopular = createAsyncThunk('movies/popular', async (params) => {
  const { data } = await moviesAPI.popular(params);
  return data;
});

export const fetchTopRated = createAsyncThunk('movies/topRated', async (params) => {
  const { data } = await moviesAPI.topRated(params);
  return data;
});

export const fetchGenres = createAsyncThunk('movies/genres', async () => {
  const { data } = await moviesAPI.genres();
  return data.genres;
});

export const fetchPersonalized = createAsyncThunk('movies/personalized', async () => {
  const { data } = await moviesAPI.personalized();
  return data;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: { results: [], loading: false, loaded: false },
    popular: { results: [], loading: false, loaded: false },
    topRated: { results: [], loading: false, loaded: false },
    personalized: { results: [], loading: false, loaded: false, type: null, basedOn: null },
    genres: [],
    genresLoaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (s) => { s.trending.loading = true; })
      .addCase(fetchTrending.fulfilled, (s, { payload }) => {
        s.trending = { results: payload.results, loading: false, loaded: true };
      })
      .addCase(fetchPopular.pending, (s) => { s.popular.loading = true; })
      .addCase(fetchPopular.fulfilled, (s, { payload }) => {
        s.popular = { results: payload.results, loading: false, loaded: true };
      })
      .addCase(fetchTopRated.pending, (s) => { s.topRated.loading = true; })
      .addCase(fetchTopRated.fulfilled, (s, { payload }) => {
        s.topRated = { results: payload.results, loading: false, loaded: true };
      })
      .addCase(fetchGenres.fulfilled, (s, { payload }) => {
        s.genres = payload;
        s.genresLoaded = true;
      })
      .addCase(fetchPersonalized.pending, (s) => { s.personalized.loading = true; })
      .addCase(fetchPersonalized.fulfilled, (s, { payload }) => {
        s.personalized = { results: payload.results || [], loading: false, loaded: true, type: payload.type, basedOn: payload.basedOn };
      });
  }
});

export default moviesSlice.reducer;
