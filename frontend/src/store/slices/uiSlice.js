import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    movieModal: { open: false, movieId: null },
    trailerModal: { open: false, videoKey: null, title: '' },
    searchOpen: false,
    mobileMenuOpen: false,
  },
  reducers: {
    openMovieModal: (state, { payload }) => {
      state.movieModal = { open: true, movieId: payload };
    },
    closeMovieModal: (state) => {
      state.movieModal = { open: false, movieId: null };
    },
    openTrailerModal: (state, { payload }) => {
      state.trailerModal = { open: true, videoKey: payload.key, title: payload.title };
    },
    closeTrailerModal: (state) => {
      state.trailerModal = { open: false, videoKey: null, title: '' };
    },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    setSearchOpen: (state, { payload }) => { state.searchOpen = payload; },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
  }
});

export const {
  openMovieModal, closeMovieModal,
  openTrailerModal, closeTrailerModal,
  toggleSearch, setSearchOpen,
  toggleMobileMenu
} = uiSlice.actions;
export default uiSlice.reducer;
