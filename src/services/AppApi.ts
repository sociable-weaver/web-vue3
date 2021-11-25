import { apiClient } from "@/services/ServiceApi";

export function isAppRunning(): Promise<AppStatus> {
  return apiClient
    .get("/hello")
    .then((response) => response.status)
    .then((status) => toAppStatus(status))
    .catch((e) => {
      if (e.message !== "Network Error") {
        throw e;
      }

      return AppStatus.CannotBeReached;
    });
}

function toAppStatus(status: number): AppStatus {
  return status == 200 ? AppStatus.Healthy : status == 403 ? AppStatus.Forbidden : AppStatus.Unhealthy;
}

export enum AppStatus {
  CannotBeReached,
  Unhealthy,
  Forbidden,
  Healthy,
}
