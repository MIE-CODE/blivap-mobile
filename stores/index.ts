import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import avatarReducer from "./avatar.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    avatar: avatarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
