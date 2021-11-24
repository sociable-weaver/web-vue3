import { shallowMount, flushPromises } from "@vue/test-utils";
import App from "@/components/App.vue";
import { mocked } from "ts-jest/utils";
import { apiClient } from "@/services/ServiceApi";
import healthCheckSuccessfulResponse from "../../fixtures/HealthCheckSuccessful";
import unhealthyCheckSuccessfulResponse from "../../fixtures/UnhealthyCheckSuccessful";
import networkError from "../../fixtures/NetworkError";

jest.mock("@/services/ServiceApi");

describe("App", () => {
  it("displays successful message when application is running", async () => {
    mocked(apiClient.get).mockResolvedValueOnce(healthCheckSuccessfulResponse);

    const wrapper = shallowMount(App);
    await flushPromises();

    expect(wrapper.text()).toMatch("Application is running");
  });

  it("displays unsuccessful message when application is not running", async () => {
    mocked(apiClient.get).mockRejectedValue(networkError);

    const wrapper = shallowMount(App);
    await flushPromises();

    expect(wrapper.text()).toMatch("Application is not running");
  });

  it("displays unsuccessful message when application is not healthy", async () => {
    mocked(apiClient.get).mockResolvedValueOnce(unhealthyCheckSuccessfulResponse);

    const wrapper = shallowMount(App);
    await flushPromises();

    expect(wrapper.text()).toMatch("Application is running, but unhealthy");
  });
});
