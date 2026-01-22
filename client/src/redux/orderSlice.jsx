import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api";

// Fetch Orders Thunk
export const getMyOrders = createAsyncThunk("orders/getMyOrders", async (_, thunkApi) => {
  try {
    const res = await api.get("/orders/myorders");
    return res.data.orders;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;