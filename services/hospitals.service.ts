import { IResponse } from "../types/api-response";
import { api } from "./fetcher";

export type Hospital = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  addressLine?: string;
};

export type HospitalListQuery = {
  /** Case-insensitive match on name, address, city, or state. Sent as `query`. */
  query?: string;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
};

export default () => {
  return {
    async list(params: HospitalListQuery = {}): Promise<IResponse<Hospital[]>> {
      const search = new URLSearchParams();
      if (params.query?.trim()) search.set("query", params.query.trim());
      if (params.city?.trim()) search.set("city", params.city.trim());
      if (params.state?.trim()) search.set("state", params.state.trim());
      search.set("page", String(params.page ?? 1));
      search.set("limit", String(params.limit ?? 20));
      return await api(`/hospitals?${search.toString()}`, { method: "GET" });
    },
  };
};
