import Variable from "@/components/renderers/Variable.vue";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Variable", () => {
  it("displays the sensitive variable input", async () => {
    /* Given */
    const entry = {
      type: "variable",
      name: "PASSWORD",
      sensitive: true,
    };

    /* When */
    const wrapper = shallowMount(Variable, { props: { entry } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("label").text()).toEqual("PASSWORD");
    expect(wrapper.find("input").attributes("type")).toEqual("password");
  });

  it("displays the default sensitive variable input", async () => {
    /* Given */
    const entry = {
      type: "variable",
      name: "PASSWORD",
    };

    /* When */
    const wrapper = shallowMount(Variable, { props: { entry } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("label").text()).toEqual("PASSWORD");
    expect(wrapper.find("input").attributes("type")).toEqual("password");
  });

  it("displays the variable default input", async () => {
    /* Given */
    const entry = {
      type: "variable",
      name: "NAME",
      sensitive: false,
      parameters: ["Albert Attard"],
    };

    /* When */
    const wrapper = shallowMount(Variable, { props: { entry } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("label").text()).toEqual("NAME");
    expect(wrapper.find("input").element.value).toEqual("Albert Attard");
  });

  it("does not emit an event when the variable is not changed", async () => {
    /* Given */
    const entry = { name: "NAME" };
    const wrapper = shallowMount(Variable, { props: { entry } });

    /* When */
    wrapper.find("button").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.emitted()["variableUpdated"]).toBeUndefined();
  });

  it("emits an event when the variable is changed", async () => {
    /* Given */
    const entry = { name: "NAME" };
    const wrapper = shallowMount(Variable, { props: { entry } });

    /* When */
    wrapper.find("input").setValue("Albert");
    wrapper.find("button").trigger("click");
    await flushPromises();

    /* Then */
    const expected = { name: "NAME", value: "Albert", previousValue: "" };
    expect(wrapper.emitted()["variableUpdated"]).toEqual([[expected]]);
  });
});
