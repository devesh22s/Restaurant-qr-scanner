import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// FIX 1: Import our custom API instance instead of raw axios
import api from '../lib/api'; 

export const login = createAsyncThunk('/auth/login', async(data, thunkApi) => {
    try {
        // FIX 2: Use api.post instead of axios.post
        // URL ab short ho gaya kyunki baseURL api.js mein set hai
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
    // FIX 3: Updated URL logic here as well
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response?.data?.message || error.message || 'Connection failed.';
    return thunkApi.rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
    name : "auth",
    initialState: {
        loading: false,
        error : null,
        name: localStorage.getItem("name") || null,
        role: localStorage.getItem("role") || null,
        email: localStorage.getItem("email") || null,
        userId: localStorage.getItem("userId") || null,
        accessToken : localStorage.getItem("accessToken") || null, // Load token from storage on refresh
        refershToken: null
    },
    reducers:{
      logout: (state) => {
        state.name = null;
        state.email = null;
        state.userId = null;
        state.role = null;
        state.accessToken = null;
        state.refershToken = null;
        
        localStorage.clear(); // Clear everything
      }
    },

    extraReducers: (builder) => {
        // LOGIN CASES
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            console.log("Login Success:", action.payload);
            const { data, accessToken, refreshToken } = action.payload;

            state.name = data.name;
            state.email = data.email;
            state.userId = data._id;
            state.role = data.role;
            state.accessToken = accessToken;
            state.refershToken = refreshToken;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userId", data._id);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", data.name);
            
            state.loading = false;
        })
        .addCase(login.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        // REGISTER CASES
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            console.log("Register Success:", action.payload);
            state.loading = false;
            // Registration doesn't usually auto-login, so we don't set state here 
            // unless backend returns token on register too.
        })
        .addCase(register.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });
    }
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;