import App from "@/components/App.vue";
import { apiClient } from "@/services/ServiceApi";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import healthCheckServerErrorResponse from "../../fixtures/HealthCheckServerError";
import healthCheckSuccessfulResponse from "../../fixtures/HealthCheckSuccessful";
import networkError from "../../fixtures/NetworkError";

jest.mock("@/services/ServiceApi");

describe("App", () => {
  it("displays successful message when application is running", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(healthCheckSuccessfulResponse);

    /* When */
    const wrapper = shallowMount(App);
    await flushPromises();

    /* Then */
    expect(wrapper.text()).toMatch("Application is running");
    expect(wrapper.emitted()["appIsRunning"]).toEqual([[true]]);
  });

  it("displays unsuccessful message when application is not running", async () => {
    /* Given */
    mocked(apiClient.get).mockRejectedValue(networkError);

    /* When */
    const wrapper = shallowMount(App);
    await flushPromises();

    /* Then */
    expect(wrapper.text()).toMatch("Application is not running or cannot be reached by this page");
    expect(wrapper.text()).toMatch("Getting started");
    expect(wrapper.emitted()["appIsRunning"]).toEqual([[false]]);
  });

  it("displays unsuccessful message when application is not healthy", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(healthCheckServerErrorResponse);

    /* When */
    const wrapper = shallowMount(App);
    await flushPromises();

    /* Then */
    expect(wrapper.text()).toMatch("Application is running, but unhealthy");
    expect(wrapper.emitted()["appIsRunning"]).toEqual([[false]]);
  });
});
