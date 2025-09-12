import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  isAuthenticated: null,  // null means not checked yet, false if auth failed, else true
  isInitialized: false,
  loading: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setAuthenticated, setInitialized, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;