export type BloodType =
  | "All"
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

type AreaLocation = {
  _id: string;
  area: string;
  city: string;
  country: string;
  state: string;
  createdAt: string;
  updatedAt: string;
};

type Reliability = {
  _id: string;
  cancelledByDonor: number;
  completedBookings: number;
  noShows: number;
  score: number;
  createdAt: string;
  updatedAt: string;
};

type DonationType = "whole_blood" | "plasma" | "platelets" | "double_red_cells"; // adjust to your actual enum

type EligibilityStatus = "eligible" | "ineligible" | "pending"; // adjust to your actual enum

export type Donor = {
  id: string;
  userId: string;
  bloodType: BloodType;
  donationType: DonationType;
  activeDonationTypes: DonationType[];
  eligibilityStatus: EligibilityStatus;
  isActiveDonor: boolean;
  lastDonationAt: string;
  averageRating: number;
  ratingCount: number;
  profileImage: string;
  areaLocation: AreaLocation;
  reliability: Reliability;
  createdAt: string;
  updatedAt: string;
};

export type DonorsResponse = Donor[];
