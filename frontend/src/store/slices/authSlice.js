import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';

// Thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('cinelens_token', data.token);
    localStorage.setItem('cinelens_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('cinelens_token', data.token);
    localStorage.setItem('cinelens_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.getMe();
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.updateProfile(profileData);
    localStorage.setItem('cinelens_user', JSON.stringify(data.user));
    toast.success('Profile updated!');
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Update failed');
  }
});

const savedUser = (() => {
  try { return JSON.parse(localStorage.getItem('cinelens_user')); } catch { return null; }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    token: localStorage.getItem('cinelens_token'),
    isAuthenticated: !!localStorage.getItem('cinelens_token'),
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('cinelens_token');
      localStorage.removeItem('cinelens_user');
      toast.success('Logged out');
    },
    clearError: (state) => { state.error = null; },
    setInitialized: (state) => { state.initialized = true; },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // Register
    builder.addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // FetchMe
    builder.addCase(fetchMe.fulfilled, (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
      state.initialized = true;
    })
      .addCase(fetchMe.rejected, (state) => {
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('cinelens_token');
      });

    // UpdateProfile
    builder.addCase(updateProfile.fulfilled, (state, { payload }) => { state.user = payload; });
  }
});

export const { logout, clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
