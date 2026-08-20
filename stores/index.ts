import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import avatarReducer from "./avatar.slice";
import donorsReducer from "./donors.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    avatar: avatarReducer,
    donors: donorsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
