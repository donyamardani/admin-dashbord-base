import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // گرفتن توکن به صورت مستقیم و بدون ابهام
  token: localStorage.getItem("token") || null, 
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      // 🟢 بررسی هوشمند: اگر payload.data فرستاده شده بود یا مستقیم خود payload
      const token = action.payload?.token || action.payload;
      const user = action.payload?.user || null;

      state.token = token;
      state.user = user;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    }
  }
});

export default authSlice.reducer;
export const { login, logout, updateUser } = authSlice.actions;