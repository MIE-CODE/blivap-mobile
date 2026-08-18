import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AvatarState {
  avatars: string[] | null;
}

const initialState: AvatarState = {
  avatars: null,
};

const avatarsSlice = createSlice({
  name: "avatars",
  initialState,
  reducers: {
    setAvatars: (state, action: PayloadAction<{ avatars: string[] }>) => {
      state.avatars = action.payload.avatars;
    },
    clearAvatars: (state) => {
      state.avatars = null;
    },
  },
});

export const { setAvatars, clearAvatars } = avatarsSlice.actions;
export default avatarsSlice.reducer;
