import App from "@/components/App.vue";
import Home from "@/views/Home.vue";
import { flushPromises, mount } from "@vue/test-utils";

describe("Home", () => {
  it("display the open component when application is running", async () => {
    const wrapper = mount(Home);

    await wrapper.findComponent(App).trigger("appIsRunning", [true]);
    await flushPromises();

    /* TODO: We are still figuring out this :( */
    // expect(wrapper.findComponent(Open).exists()).toBe(true);
  });
});
