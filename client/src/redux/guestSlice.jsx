import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api'; // Use custom api

export const createSession = createAsyncThunk('/session/create', async (data, thunkApi) => {
  try {
    // data contains { qrslug, deviceId }
    const res = await api.post('/session/create', data); 
    return res.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message);
  }
});

const guestSlice = createSlice({
  name: 'guest',
  initialState: {
    sessionToken: localStorage.getItem('sessionToken') || null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSession.pending, (state) => { state.loading = true; })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        // Backend: { success: true, data: { sessionToken: "..." } }
        const token = action.payload.data.sessionToken;
        state.sessionToken = token;
        localStorage.setItem('sessionToken', token);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default guestSlice.reducer;