import {createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios' 

export const login = createAsyncThunk('/base/login', async(data, thunkApi)=>{
    try{
        console.log(thunkApi);
        
        const res = await axios.post('http://localhost:3000/api/auth/login', data)
        return res.data
    }catch(error){
        console.log(error);
        const errorMessage = error.response?.data?.message || error.message || 'Connection failed. Please check if server is running.'
        return thunkApi.rejectWithValue(errorMessage)
        
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
    const errorMessage = error.response?.data?.message || error.message || 'Connection failed. Please check if server is running.'
    return thunkApi.rejectWithValue(errorMessage)
  }
});


const authSlice = createSlice({
    name : "auth",
    initialState: {
        loading: false,
        error : null,
        name: localStorage.getItem("name") || null,
        role:localStorage.getItem("role") || null,
        email: localStorage.getItem("email") || null,
        userId: localStorage.getItem("userId") || null,
        accessToken : null,
        refershToken: null


    },
    reducers:{
      logout: (state, )=>{
        state.name = null
        state.email = null
        state.userId = null
        state.role = null
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refershToken")
        localStorage.removeItem("name")
        localStorage.removeItem("email")
        localStorage.removeItem("role")
        localStorage.removeItem("userId")
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
            state.userId = action.payload.data._id
            state.accessToken = action.payload.accessToken
            state.refershToken = action.payload.refershToken
            state.role = action.payload.data.role

            localStorage.setItem("accessToken", action.payload.accessToken)
            localStorage.setItem("refershToken", action.payload.refershToken)
            localStorage.setItem("userId", action.payload.data._id)
            localStorage.setItem("email", action.payload.data.email)
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