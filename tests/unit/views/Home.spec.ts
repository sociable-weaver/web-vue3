import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import Home from "@/views/Home.vue";
import { shallowMount } from "@vue/test-utils";
import bookSuccessfulResponse from "../../fixtures/BookSuccessful";

describe("Home", () => {
  it("does not display the open component before the app component confirms that the app is running", () => {
    /* Given */
    const wrapper = shallowMount(Home);

    /* When */
    /* The application status is not yet checked */

    /* Then */
    expect(wrapper.findComponent(Open).exists()).toBe(false);
  });
});

describe("App", () => {
  it("display the open component when application is running", async () => {
    /* Given */
    const wrapper = shallowMount(Home);

    /* When */
    await wrapper.vm.$refs.app.$emit("appIsRunning", true);

    /* Then */
    expect(wrapper.findComponent(Open).exists()).toBe(true);
  });

  it("does not display the open component when application is not running", async () => {
    /* Given */
    const wrapper = shallowMount(Home);

    /* When */
    await wrapper.vm.$refs.app.$emit("appIsRunning", false);

    /* Then */
    expect(wrapper.findComponent(Open).exists()).toBe(false);
  });
});

describe("Open", () => {
  it("does not display the table of content before a book is opened", async () => {
    /* Given */
    const wrapper = shallowMount(Home);
    await wrapper.vm.$refs.app.$emit("appIsRunning", true);

    /* When */
    /* No book is opened yet */

    /* Then */
    expect(wrapper.findComponent(Toc).exists()).toBe(false);
  });

  it("display the table of content when book is opened", async () => {
    /* Given */
    const wrapper = shallowMount(Home);
    await wrapper.vm.$refs.app.$emit("appIsRunning", true);

    /* When */
    await wrapper.vm.$refs.open.$emit("bookOpened", bookSuccessfulResponse.data);

    /* Then */
    expect(wrapper.findComponent(Toc).exists()).toBe(true);
  });
});
