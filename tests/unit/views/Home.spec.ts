import Open from "@/components/Open.vue";
import Home from "@/views/Home.vue";
import { mount } from "@vue/test-utils";

describe("Home", () => {
  it("does not display the open component before the app component confirms that the app is running", () => {
    /* Given/When */
    const wrapper = mount(Home);

    /* Then */
    expect(wrapper.findComponent(Open).exists()).toBe(false);
  });

  it("display the open component when application is running", async () => {
    /* Given */
    const wrapper = mount(Home);

    /* When */
    await wrapper.vm.$refs.app.$emit("appIsRunning", true);

    /* Then */
    expect(wrapper.findComponent(Open).exists()).toBe(true);
  });

  it("does not display the open component when application is not running", async () => {
    /* Given */
    const wrapper = mount(Home);

    /* When */
    await wrapper.vm.$refs.app.$emit("appIsRunning", false);

    /* Then */
    expect(wrapper.findComponent(Open).exists()).toBe(false);
  });
});
