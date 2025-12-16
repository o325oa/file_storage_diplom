import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/index';

const token = localStorage.getItem('access');
let user = null;
const userString = localStorage.getItem('user');

if (userString && typeof userString === 'string') {
  try {
    user = JSON.parse(userString);
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    user = null;
  }
}

const initialState = {
  isAuthenticated: !!token,
  user: user,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/token/', credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: 'Login failed' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('access');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('access', action.payload.access);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

