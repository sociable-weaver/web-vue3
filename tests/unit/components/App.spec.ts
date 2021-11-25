import App from "@/components/App.vue";
import { apiClient } from "@/services/ServiceApi";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import healthCheckForbiddenResponse from "../../fixtures/HealthCheckForbidden";
import healthCheckServerErrorResponse from "../../fixtures/HealthCheckServerError";
import healthCheckSuccessfulResponse from "../../fixtures/HealthCheckSuccessful";
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

    expect(wrapper.text()).toMatch("Application is not running or cannot be reached by this page");
    expect(wrapper.text()).toMatch("Getting started");
  });

  it("displays unsuccessful message when application is not healthy", async () => {
    mocked(apiClient.get).mockResolvedValueOnce(healthCheckServerErrorResponse);

    const wrapper = shallowMount(App);
    await flushPromises();

    expect(wrapper.text()).toMatch("Application is running, but unhealthy");
  });
});
