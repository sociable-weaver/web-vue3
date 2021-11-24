import { shallowMount, flushPromises } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import { mocked } from "ts-jest/utils";
import { apiClient } from "@/services/ServiceApi";
import healthCheckSuccessfulResponse from "../../fixtures/HealthCheckSuccessful";

jest.mock("@/services/ServiceApi");

describe("Hello World", () => {
  it("displays successful message when backend application is running", async () => {
    mocked(apiClient.get).mockResolvedValueOnce(healthCheckSuccessfulResponse);

    const wrapper = shallowMount(HelloWorld);
    await flushPromises();

    expect(wrapper.text()).toMatch("Application is running");
  });
});
