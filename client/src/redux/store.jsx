import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import guestReducer from './guestSlice'
import menuReducer from './menuSlice'
import cartReducer from './cartSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
          guest : guestReducer,
        menu : menuReducer,
        cart: cartReducer
    }
})
export default store