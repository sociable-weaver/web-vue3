import { apiClient } from "@/services/ServiceApi";

export function isAppRunning(): Promise<AppStatus> {
  return apiClient
    .get("/hello")
    .then((response) => response.status)
    .then((status) => (status == 200 ? AppStatus.Healthy : AppStatus.Unhealthy))
    .catch((e) => {
      if (e.message !== "Network Error") {
        throw e;
      }

      return AppStatus.CannotBeReached;
    });
}

export enum AppStatus {
  CannotBeReached,
  Unhealthy,
  Healthy,
}
