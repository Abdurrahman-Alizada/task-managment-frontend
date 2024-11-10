import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  currentTask: {},
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
  },
});

export const { setCurrentTask } = taskSlice.actions;

export default taskSlice.reducer;
