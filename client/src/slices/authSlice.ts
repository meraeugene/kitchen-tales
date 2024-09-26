import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("jwt");
      state.isLoggedIn = false;
      state.userInfo = null;
    },
  },
});

export const { logout, setIsLoggedIn, setUserInfo } = authSlice.actions;

export default authSlice.reducer;
