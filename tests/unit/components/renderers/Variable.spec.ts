import Variable from "@/components/renderers/Variable.vue";
import { Entry, OnSaveOutcome } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Variable", () => {
  describe("View/Edit", () => {
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
      expect(wrapper.find("label").text()).toEqual("Set variable PASSWORD");
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
      expect(wrapper.find("label").text()).toEqual("Set variable PASSWORD");
      expect(wrapper.find("input").attributes("type")).toEqual("password");
    });

    it("displays the variable default input and emits event", async () => {
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
      expect(wrapper.find("label").text()).toEqual("Set variable NAME");
      expect(wrapper.find("input").element.value).toEqual("Albert Attard");
      const expected = { name: "NAME", value: "Albert Attard" };
      expect(wrapper.emitted()["variableInitialised"]).toEqual([[expected]]);
    });
  });

  describe("onVariableSet()", () => {
    it("does not emit an event when the variable is not changed", async () => {
      /* Given */
      const entry = { type: "variable", name: "NAME" };
      const wrapper = shallowMount(Variable, { props: { entry } });

      /* When */
      await wrapper.find("input").trigger("keyup.enter");
      await flushPromises();

      /* Then */
      expect(wrapper.emitted()["variableUpdated"]).toBeUndefined();
    });

    it("emits an event when the variable is changed", async () => {
      /* Given */
      const entry = { type: "variable", name: "NAME" };
      const wrapper = shallowMount(Variable, { props: { entry } });

      /* When */
      await wrapper.find("input").setValue("Albert");
      await wrapper.find("input").trigger("keyup.enter");
      await flushPromises();

      /* Then */
      const expected = { name: "NAME", value: "Albert", previousValue: "" };
      expect(wrapper.emitted()["variableUpdated"]).toEqual([[expected]]);
    });

    it("emits an event when the variable is changed back to its original value", async () => {
      /* Given */
      const entry = { type: "variable", name: "NAME", parameters: ["Hello world"] };
      const wrapper = shallowMount(Variable, { props: { entry } });

      /* When */
      await wrapper.find("input").setValue("Hallo Welt");
      await wrapper.find("input").trigger("keyup.enter");
      await wrapper.find("input").setValue("Hello world");
      await wrapper.find("input").trigger("keyup.enter");
      await flushPromises();

      /* Then */
      expect(wrapper.emitted()["variableUpdated"]).toEqual([
        [{ name: "NAME", value: "Hallo Welt", previousValue: "Hello world" }],
        [{ name: "NAME", value: "Hello world", previousValue: "Hallo Welt" }],
      ]);
    });
  });

  describe("onSave()", () => {
    it("returns KeepEditing when the variable name is set to empty", async () => {
      /* Given */
      const entry = {
        type: "variable",
        name: "NAME",
        parameters: ["Albert Attard"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Variable, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input[role=name]").setValue("");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.KeepEditing });
      expect(entry.error).toEqual("The variable name cannot be empty");
      expect(entry.name).toEqual("NAME");
    });

    it("returns NotChanged when the variable name is not changed", async () => {
      /* Given */
      const entry = {
        type: "variable",
        name: "NAME",
        parameters: ["Albert Attard"],
        edit: true,
      } as Entry;
      shallowMount(Variable, { props: { entry } });
      await flushPromises();

      /* When */
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.NotChanged });
      expect(entry.name).toEqual("NAME");
    });

    it("returns Changed when the variable name is changed", async () => {
      /* Given */
      const entry = {
        type: "variable",
        name: "NAME",
        parameters: ["Albert Attard"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Variable, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input[role=name]").setValue("FULL_NAME");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome.outcome).toEqual(OnSaveOutcome.Changed);
      expect(outcome.entry?.name).toEqual("FULL_NAME");
      expect(entry.name).toEqual("NAME");
    });
  });
});
