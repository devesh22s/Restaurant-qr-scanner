import {createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios' 

export const login = createAsyncThunk('/base/login', async(data)=>{
    try{
        const res = await axios.post('http://localhost:3000/api/auth/base/login', (data, thunkApi))
        return res.data
    }catch(error){
        console.log(error);
        
    }
} )
const authSlice = createSlice({
    name : "auth",
    initialState: {
        loading: false,
        error : null,
        name: null,
        email: null,
        role:null,
        accessToken : null,
        refershToken: null


    },
    reducer:{},

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
            localStorage.setItem("refershToken", action.payload.refershToken)
            
        }).addCase(login.rejected, (state, action)=>{
            state.error = action.payload
        })
    }

})

console.log(authSlice);

export default authSlice.reducer