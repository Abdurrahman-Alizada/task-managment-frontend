import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") ?? "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toogletheme: (state) => ({ theme: state.theme == "light" ? "dark" : "light" }),
  },
});

export const { toogletheme } =
  themeSlice.actions;

export default themeSlice.reducer;
