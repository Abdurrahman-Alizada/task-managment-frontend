import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  currentLoginUser: {},
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleCurrentLoaginUser: (state, action) => {
      state.currentLoginUser = action.payload;
    },
   
  },
});

export const { handleCurrentLoaginUser } =
  UserSlice.actions;

export default UserSlice.reducer;
