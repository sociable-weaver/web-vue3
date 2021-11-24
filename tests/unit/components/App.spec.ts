import { shallowMount, flushPromises } from "@vue/test-utils";
import App from "@/components/App.vue";
import { mocked } from "ts-jest/utils";
import { apiClient } from "@/services/ServiceApi";
import healthCheckSuccessfulResponse from "../../fixtures/HealthCheckSuccessful";

jest.mock("@/services/ServiceApi");

describe("App", () => {
  it("displays successful message when application is running", async () => {
    mocked(apiClient.get).mockResolvedValueOnce(healthCheckSuccessfulResponse);

    const wrapper = shallowMount(App);
    await flushPromises();

    expect(wrapper.text()).toMatch("Application is running");
  });
});
