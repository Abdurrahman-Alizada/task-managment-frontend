import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import themeReducer from "./reducers/theme/themeSlice";
import userReducer from "./reducers/user/user";
import taskReducer from "./reducers/task/taskSlice";

import { userApi } from "./reducers/user/userThunk";
import { taskApi } from "./reducers/task/taskThunk";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    task: taskReducer,
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userApi.middleware,
      taskApi.middleware
    ]),
});
setupListeners(store.dispatch);
