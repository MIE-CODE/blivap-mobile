import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import avatarReducer from "./avatar.slice";
import donorsReducer from "./donors.slice";
import onboardingReducer from "./onboarding.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    avatar: avatarReducer,
    donors: donorsReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
