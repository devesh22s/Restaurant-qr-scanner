import {createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios' 

export const login = createAsyncThunk('/base/login', async(data, thunkApi)=>{
    try{
        console.log(thunkApi);
        
        const res = await axios.post('http://localhost:3000/api/auth/login', data)
        return res.data
    }catch(error){
        console.log(error);
        return thunkApi.rejectWithValue(error.response.data.message)
        
    }
} )

export const register = createAsyncThunk('/base/register', async (data, thunkApi) => {
  try {
    console.log(thunkApi)
    const res = await axios.post(
      'http://localhost:3000/api/auth/register',
      data
    );
    return res.data;
  } catch (error) {
    console.log(error)
    return thunkApi.rejectWithValue(error.response.data.message)
  }
});


const authSlice = createSlice({
    name : "auth",
    initialState: {
        loading: false,
        error : null,
        name: localStorage.get("name") || null,
        role:localStorage.get("role") || null,
        email: null,
        accessToken : null,
        refershToken: null


    },
    reducer:{
      logout: (state, )=>{
        state.name = null
        state.email = null
        state.role = null
        localStorage.removeItem("accessToken")
        localStorage.removeItem("name")
        localStorage.removeItem("role")
        state.refershToken = null
        state.accessToken = null
      }
    },

    extraReducers: (builder)=>{
        builder.addCase(login.pending, (state)=>{
            state.loading = true
        }).addCase(login.fulfilled, (state, action)=>{

            console.log(action.payload);
            state.name = action.payload.data.name
            state.email = action.payload.data.email
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.role = action.payload.data.role

            localStorage.setItem("accessToken", action.payload.accessToken)
            localStorage.setItem("refreshToken", action.payload.refreshToken)
            state.loading = false;

            localStorage.setItem("role", action.payload.data.role)
            localStorage.setItem("name", action.payload.data.name)
            
        }).addCase(login.rejected, (state, action)=>{
            console.log(action.payload)
        state.error = action.payload;
        state.loading = false

        }).addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log(action.payload)
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        console.log(action.payload)
        state.error = action.payload;
        state.loading = false
      });
    }

})

// console.log(authSlice);

export default authSlice.reducer
export const {logout} = authSlice.actions