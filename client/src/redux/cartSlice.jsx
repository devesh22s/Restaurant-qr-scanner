import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api"; // Use our custom axios instance

// Add to Cart (No userId needed in body)
export const addedTOCart = createAsyncThunk("/cart/add", async ({ menuItemId, quantity = 1 }, thunkApi) => {
    try {
      const res = await api.post("/cart/add", {
        menuItemId,
        quantity,
      });
      // Backend response: { success: true, message: "...", data: cart }
      return res.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add item";
      return thunkApi.rejectWithValue(errorMessage);
    }
  }
);

// Get Cart (No userId param needed, Headers will tell whose cart it is)
export const getCart = createAsyncThunk("/cart/get", async (_, thunkApi) => {
    try {
      const res = await api.get("/cart/my-cart");
      return res.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Remove Item
export const removeItemFromCart = createAsyncThunk("/cart/remove", async({ menuItemId }, thunkApi) => {
  try {
    // Note: Delete method mein data body mein bhejne ka tarika thoda alag hota hai
    const res = await api.delete("/cart/remove", { data: { menuItemId } }); 
    return res.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message);
  }
});

// Increase Qty
export const increaseItemQuantity = createAsyncThunk("/cart/increase", async({ menuItemId }, thunkApi) => {
  try {
    const res = await api.patch("/cart/increase", { menuItemId }); // Changed to Body instead of Query for security
    return res.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message);
  }
});

// Decrease Qty
export const decreaseItemQuantity = createAsyncThunk("/cart/decrease", async({ menuItemId }, thunkApi) => {
  try {
    const res = await api.patch("/cart/decrease", { menuItemId });
    return res.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState:{
    cart: null,
    items: [],
    totalCartPrice: 0,
    loading: false,
    error: null,
  }, 
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.items = [];
      state.totalCartPrice = 0;
    },
  },
  extraReducers: (builder) => {
      // Common logic for all fulfilled cart actions (Update state with new cart from backend)
      const updateCartState = (state, action) => {
          state.loading = false;
          state.cart = action.payload;
          state.items = action.payload.items;
          state.totalCartPrice = action.payload.totalCartPrice;
      };

      // Get Cart
      builder.addCase(getCart.pending, (state) => { state.loading = true; })
             .addCase(getCart.fulfilled, updateCartState)
             .addCase(getCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

      // Add to Cart
      builder.addCase(addedTOCart.pending, (state) => { state.loading = true; })
             .addCase(addedTOCart.fulfilled, updateCartState) // Update immediately with backend response
             .addCase(addedTOCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

      // Remove
      builder.addCase(removeItemFromCart.fulfilled, updateCartState);
      
      // Increase/Decrease
      builder.addCase(increaseItemQuantity.fulfilled, updateCartState);
      builder.addCase(decreaseItemQuantity.fulfilled, updateCartState);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;