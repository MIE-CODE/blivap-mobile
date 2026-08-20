import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Donor } from "../types/donor";
interface DonorsState {
  donors: Donor[] | null;
}
const initialState: DonorsState = {
  donors: null,
};
const donorsSlice = createSlice({
  name: "donors",
  initialState,
  reducers: {
    setDonors: (state, action: PayloadAction<{ donors: Donor[] }>) => {
      state.donors = action.payload.donors;
    },
  },
});
export const { setDonors } = donorsSlice.actions;
export default donorsSlice.reducer;
