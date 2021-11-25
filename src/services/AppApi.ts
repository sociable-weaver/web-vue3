import { apiClient } from "@/services/ServiceApi";

export function isAppRunning(): Promise<AppStatus> {
  return apiClient
    .get("/hello")
    .then((response) => response.status)
    .then((status) => toAppStatus(status))
    .catch((e) => {
      switch (e.message) {
        case "Network Error":
          return AppStatus.CannotBeReached;
        default:
          throw e;
      }
    });
}

function toAppStatus(status: number): AppStatus {
  return status === 200 ? AppStatus.Healthy : AppStatus.Unhealthy;
}

export enum AppStatus {
  CannotBeReached,
  Unhealthy,
  Healthy,
}
