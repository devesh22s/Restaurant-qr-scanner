import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// FIX 1: Import custom api instance
import api from "../lib/api"; 

// Fetch all menu items
export const fetchMenuItems = createAsyncThunk("menu/fetchMenuItems", async (category, thunkApi) => {
    try {
      // FIX 2: Use api.get (URL short ho gaya)
      // Base URL is already set to 'http://localhost:3000/api/v1' in api.js
      const url =
        category && category !== "All"
          ? `/menu?category=${category}` 
          : "/menu"; // Yeh '/menu' ban jayega 'http://localhost:3000/api/v1/menu'

      const res = await api.get(url);
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to fetch menu items"
      );
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menuItems: [],
    allMenuItems: [],
    categories: [],
    loading: false,
    error: null,
    selectedCategory: "All",
    searchQuery: "",
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearMenuItems: (state) => {
      state.menuItems = [];
      state.allMenuItems = [];
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        // Backend Response structure: { success: true, data: [...] }
        const data = action.payload.data || []; // Safety check
        state.allMenuItems = data;

        // Apply search filter
        let filteredItems = data;
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filteredItems = data.filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query) ||
              item.category?.toLowerCase().includes(query)
          );
        }

        state.menuItems = filteredItems;

        if (state.selectedCategory === "All") {
          const uniqueCategories = [
            "All",
            ...new Set(data.map((item) => item.category)),
          ];
          state.categories = uniqueCategories;
        }
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;
export const { setSelectedCategory, setSearchQuery, clearMenuItems } = menuSlice.actions;