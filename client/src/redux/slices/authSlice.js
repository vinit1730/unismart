import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    await API.post('/auth/send-otp', { email });
    return email;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Error running access check.'); }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Invalid code matching error.'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    loading: false,
    otpSent: false,
    currentEmail: '',
    error: null
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null; state.token = null; state.otpSent = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state, action) => { state.loading = false; state.otpSent = true; state.currentEmail = action.payload; })
      .addCase(sendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; state.user = action.payload.user; })
      .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;