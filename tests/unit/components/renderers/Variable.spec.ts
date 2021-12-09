import Variable from "@/components/renderers/Variable.vue";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Variable", () => {
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
    expect(wrapper.emitted()["variableUpdated"]).toEqual([[{ name: "NAME", value: "Albert", previousValue: "" }]]);
  });
});
