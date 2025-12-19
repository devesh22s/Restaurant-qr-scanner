import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//add to cart thunk
export const addedTOCart = createAsyncThunk("/cart/add",  async ({ userId, menuItemId, quantity = 1 }, thunkApi) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/addtocart", {
        userId,
        menuItemId,
        quantity,
      });
      // backend -> { message, data: cart }
      return res.data.data;
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add item to cart';
      return thunkApi.rejectWithValue(errorMessage);
    }
  }
);

//  get all cart
export const getCart = createAsyncThunk("/cart/get",  async (userId, thunkApi) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/auth/cart/${userId}`
      );
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);



// remove item from cart thunk

export const removeItemFromCart = createAsyncThunk("/cart/remove", async({userId, menuItemId}, thunkApi)=>{
  try {
    const res = await axios.delete("http://localhost:3000/api/auth/remove", {data: { userId, menuItemId }}) 
    return res.data.data
  } catch (error) {
    console.log(error);
    return thunkApi.rejectWithValue(error.response.data.message);
  }
})

// increase item quantity thunk
export const increaseItemQuantity = createAsyncThunk("/cart/increase", async({userId, menuItemId}, thunkApi)=>{
  try {
    const res = await axios.patch(`http://localhost:3000/api/auth/cart/increase?userId=${userId}&menuItemId=${menuItemId}`)
    return res.data.data
  } catch (error) {
    console.log(error);
    return thunkApi.rejectWithValue(error.response.data.message);
  }
})

// decrease item quantity thunk
export const decreaseItemQuantity = createAsyncThunk("/cart/decrease", async({userId, menuItemId}, thunkApi)=>{
  try {
    const res = await axios.patch(`http://localhost:3000/api/auth/cart/decrease?userId=${userId}&menuItemId=${menuItemId}`)
    return res.data.data
  } catch (error) {
    console.log(error);
    return thunkApi.rejectWithValue(error.response.data.message);
  }
})


// =======================
// SLICE
// =======================

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
      state.loading = false;
      state.error = null;
    },

  },


  extraReducers: (builder) => {

      // ================= GET CART =================
builder
  .addCase(getCart.pending, (state) => {
    state.loading = true;
  })
  .addCase(getCart.fulfilled, (state, action) => {
    state.loading = false;
    state.cart = action.payload;
    state.items = action.payload.items;
    state.totalCartPrice = action.payload.totalCartPrice;
  })
  .addCase(getCart.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

    // ================= ADD TO CART =================
    builder
      .addCase(addedTOCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addedTOCart.fulfilled, (state, ) => {
        state.loading = false;
        
      })
      .addCase(addedTOCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // // ================= REMOVE FROM CART =================
    builder
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
        state.totalCartPrice = action.payload.totalCartPrice;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // // ================= INCREASE ITEM =================
    builder
      .addCase(increaseItemQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(increaseItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
        state.totalCartPrice = action.payload.totalCartPrice;
      })
      .addCase(increaseItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // // ================= DECREASE ITEM =================
    builder
      .addCase(decreaseItemQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(decreaseItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
        state.totalCartPrice = action.payload.totalCartPrice;
      })
      .addCase(decreaseItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
