import Open from "@/components/Open.vue";
import { shallowMount } from "@vue/test-utils";

jest.mock("@/services/ServiceApi");

describe("Open", () => {
  it("started with the checkout option selected", async () => {
    /* Given */
    const wrapper = shallowMount(Open);

    /* When */

    /* Then */
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("button[class=open]").text()).toMatch("Checkout and Open");
  });

  it("displays the checkout options", async () => {
    /* Given */
    const wrapper = shallowMount(Open);
    const radioInput = wrapper.find("input[id=checkout]");

    /* When */
    await radioInput.trigger("click");

    /* Then */
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("button[class=open]").text()).toMatch("Checkout and Open");
  });

  it("displays the open local options", async () => {
    /* Given */
    const wrapper = shallowMount(Open);
    const radioInput = wrapper.find("input[id=openLocal]");

    /* When */
    await radioInput.trigger("click");

    /* Then */
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("button[class=open]").text()).toMatch("Open");
  });
});
