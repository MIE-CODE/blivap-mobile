import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  hasOnboarded: boolean;
  isInitialized: boolean;
}

const initialState: OnboardingState = {
  hasOnboarded: false,
  isInitialized: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setHasOnboarded: (state, action: PayloadAction<boolean>) => {
      state.hasOnboarded = action.payload;
    },
    setOnboardingInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setHasOnboarded, setOnboardingInitialized } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;
