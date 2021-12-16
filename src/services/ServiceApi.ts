import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8077",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/explicit-module-boundary-types: "off" */
export function formatError(e: any): string {
  return e == null || e === undefined ? "Unknown error" : e?.response?.data?.message || e?.message || "Unknown error";
}
