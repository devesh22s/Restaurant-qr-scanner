import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/api'; 

// ✅ HELPER: Refresh hone par LocalStorage se User Object wapas laane ke liye
const getUserFromStorage = () => {
    try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.log(error.response?.data?.message)
    return null;
  }
};

// --- ASYNC THUNKS ---

export const login = createAsyncThunk('/auth/login', async(data, thunkApi) => {
    try {
        const res = await api.post('/auth/login', data);
        return res.data;
    } catch(error) {
        console.log(error);
        const errorMessage = error.response?.data?.message || error.message || 'Connection failed.';
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const register = createAsyncThunk('/auth/register', async (data, thunkApi) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response?.data?.message || error.message || 'Connection failed.';
    return thunkApi.rejectWithValue(errorMessage);
  }
});

// --- SLICE ---

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        
        // ✅ FIX: Consolidated User Object (Isse 'undefined' name ki problem solve hogi)
        user: getUserFromStorage(), 
        
        // Standalone fields for easy access
        role: localStorage.getItem("role") || null,
        accessToken : localStorage.getItem("accessToken") || null, 
    },
    
    reducers:{
      logout: (state) => {
        state.user = null;
        state.role = null;
        state.accessToken = null;
        state.error = null;
        
        localStorage.clear(); // Sab saaf
      }
    },

    extraReducers: (builder) => {
        // --- LOGIN CASES ---
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            console.log("Login Success:", action.payload);
            const { data, accessToken, refreshToken } = action.payload;

            // 1. Update Redux State
            state.user = data; // Pura object (name, email, id, etc.)
            state.role = data.role;
            state.accessToken = accessToken;
            state.loading = false;

            // 2. Update LocalStorage (Persist Data)
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("role", data.role);
            
            // ✅ IMP: Pura user object stringify karke save karo (Refresh fix)
            localStorage.setItem("user", JSON.stringify(data)); 
        })
        .addCase(login.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        // --- REGISTER CASES ---
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            console.log("Register Success:", action.payload);
            state.loading = false;
        })
        .addCase(register.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });
    }
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;