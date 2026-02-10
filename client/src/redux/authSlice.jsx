import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/api'; 
import { auth, googleProvider } from '../config/firebase'; 
import { signInWithPopup } from 'firebase/auth';

// HELPER: Get User from Storage
const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.log(error);
        
        return null;
    }
};

// --- ASYNC THUNKS (Login/Register same as before) ---
export const login = createAsyncThunk('/auth/login', async(data, thunkApi) => {
    try {
        const res = await api.post('/auth/login', data);
        return res.data;
    } catch(error) {
        const errorMessage = error.response?.data?.message || error.message || 'Connection failed.';
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const register = createAsyncThunk('/auth/register', async (data, thunkApi) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Connection failed.';
    return thunkApi.rejectWithValue(errorMessage);
  }
});


export const googleLogin = createAsyncThunk('/auth/google', async (_, thunkApi) => {
    try {
        // 1. Popup Open
        const result = await signInWithPopup(auth, googleProvider);
        // 2. Get ID Token
        const idToken = await result.user.getIdToken();
        // 3. Send to Backend
        const res = await api.post('/auth/google', { idToken });
        return res.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Google Sign-In failed.';
        return thunkApi.rejectWithValue(errorMessage);
    }
});


// --- SLICE ---
const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        user: getUserFromStorage(), 
        role: localStorage.getItem("role") || null,
        accessToken : localStorage.getItem("accessToken") || null, 
    },
    
    reducers:{
      // ✅ FIX: Added setUser Reducer
      setUser: (state, action) => {
        const { user, role, accessToken } = action.payload;
        state.user = user;
        state.role = role;
        state.accessToken = accessToken;
        state.error = null;
      },

      logout: (state) => {
        state.user = null;
        state.role = null;
        state.accessToken = null;
        state.error = null;
        localStorage.clear(); 
      }
    },

    extraReducers: (builder) => {
        // Login Cases
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            const { data, accessToken, refreshToken } = action.payload;
            state.user = data;
            state.role = data.role;
            state.accessToken = accessToken;
            state.loading = false;
            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken); // Save Refresh Token
            localStorage.setItem("role", data.role);
            localStorage.setItem("user", JSON.stringify(data)); 
        })
        .addCase(login.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        // Register Cases
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(register.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })



        // GOOGLE CASES 
        .addCase(googleLogin.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(googleLogin.fulfilled, (state, action) => {
            const { data, accessToken, refreshToken } = action.payload;
            state.user = data;
            state.role = data.role;
            state.accessToken = accessToken;
            state.loading = false;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("role", data.role);
            localStorage.setItem("user", JSON.stringify(data)); 
        })
        .addCase(googleLogin.rejected, (state, action) => { state.error = action.payload; state.loading = false; })
    
    }
});

export default authSlice.reducer;
// ✅ EXPORT setUser HERE
export const { logout, setUser } = authSlice.actions;