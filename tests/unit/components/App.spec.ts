import App from "@/components/App.vue";
import { apiClient } from "@/services/ServiceApi";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import healthCheckResponse from "../../fixtures/HealthCheck";
import networkError from "../../fixtures/NetworkError";
import serverError from "../../fixtures/ServerError";

jest.mock("@/services/ServiceApi");

describe("App", () => {
  it("displays successful message when application is running", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(healthCheckResponse);

    /* When */
    const wrapper = shallowMount(App);
    await flushPromises();

    /* Then */
    expect(wrapper.find("h2[role=state]").text()).toEqual("The Sociable Weaver Application is running");
    expect(wrapper.emitted()["appIsRunning"]).toEqual([[true]]);
  });

  it("displays unsuccessful message when application is not running", async () => {
    /* Given */
    mocked(apiClient.get).mockRejectedValue(networkError);

    /* When */
    const wrapper = shallowMount(App);
    await flushPromises();

    /* Then */
    expect(wrapper.find("h2[role=state]").text()).toEqual(
      "The Sociable Weaver Application is not running or cannot be reached by this page"
    );
    expect(wrapper.emitted()["appIsRunning"]).toEqual([[false]]);
  });

  it("displays unsuccessful message when application is not healthy", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(serverError);

    /* When */
    const wrapper = shallowMount(App);
    await flushPromises();

    /* Then */
    expect(wrapper.find("h2[role=state]").text()).toMatch("The Sociable Weaver Application is running, but unhealthy");
    expect(wrapper.emitted()["appIsRunning"]).toEqual([[false]]);
  });
});
