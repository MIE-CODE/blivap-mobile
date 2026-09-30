import { IResponse } from "../types/api-response";
import { BloodType, Donor } from "../types/donor";
import { api } from "./fetcher";

export type DonorListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  bloodType?: string;
};

export type DonorAreaLocation = {
  country: string;
  state: string;
  city: string;
  area: string;
};

export type DonorRegisterPayload = {
  bloodType: BloodType;
  areaLocation: DonorAreaLocation;
  expenseCoverage?: "requested" | "self";
};

export default () => {
  return {
    async get(params: DonorListQuery = {}): Promise<IResponse<Donor[]>> {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));
      if (params.search) query.set("search", params.search);
      if (params.bloodType) query.set("bloodType", params.bloodType);
      const qs = query.toString();
      const suffix = qs ? `?${qs}` : "";
      return await api(`/donors${suffix}`, { method: "GET" });
    },
    async me(): Promise<IResponse<Record<string, unknown>>> {
      return await api("/donors/me", { method: "GET" });
    },
    async register(
      payload: DonorRegisterPayload,
    ): Promise<IResponse<Record<string, unknown>>> {
      return await api("/donors/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    async requestActivation(payload: {
      areaLocation: DonorAreaLocation;
      donationType: string;
    }): Promise<IResponse<Record<string, unknown>>> {
      return await api("/donors/request-activation", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  };
};
