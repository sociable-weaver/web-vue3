import { apiClient } from "@/services/ServiceApi";

export default {
  isAppRunning(): Promise<boolean> {
    return apiClient
      .get("/actuator/health")
      .then((response) => response.status)
      .then((status) => status == 200);
  },
};
