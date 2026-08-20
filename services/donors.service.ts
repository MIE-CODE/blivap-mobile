import { IResponse } from "../types/api-response";
import { Donor } from "../types/donor";
import { api } from "./fetcher";

export default () => {
  return {
    async get(): Promise<IResponse<Donor[]>> {
      return await api("/donors", { method: "GET" });
    },
  };
};
