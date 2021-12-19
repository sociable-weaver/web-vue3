import Subsection from "@/components/renderers/Subsection.vue";
import { Entry, OnSaveOutcome } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Subsection", () => {
  describe("View/Edit", () => {
    it("renders the subsection when not in edit mode", async () => {
      /* Given */
      const entry = {
        type: "subsection",
        parameters: ["Hello world"],
      };

      /* When */
      const wrapper = shallowMount(Subsection, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h4").text()).toEqual("Hello world");
      expect(wrapper.find("input").exists()).toBeFalsy();
    });

    it("renders the input field when in edit mode", async () => {
      /* Given */
      const entry = {
        type: "subsection",
        parameters: ["Hello world"],
        edit: true,
      };

      /* When */
      const wrapper = shallowMount(Subsection, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h4").exists()).toBeFalsy();
      expect(wrapper.find("input").element.value).toEqual("Hello world");
    });
  });

  describe("onSave()", () => {
    it("returns KeepEditing when the subsection is set to empty", async () => {
      /* Given */
      const entry = {
        type: "subsection",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Subsection, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input").setValue("");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.KeepEditing });
      expect(entry.error).toEqual("The subsection cannot be empty");
      expect(entry.parameters).toEqual(["Hello world"]);
    });

    it("returns NotChanged when the subsection is not changed", async () => {
      /* Given */
      const entry = {
        type: "subsection",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      shallowMount(Subsection, { props: { entry } });
      await flushPromises();

      /* When */
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.NotChanged });
      expect(entry.parameters).toEqual(["Hello world"]);
    });

    it("returns Changed when the subsection is changed", async () => {
      /* Given */
      const entry = {
        type: "subsection",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Subsection, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input").setValue("Hallo Welt");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome.outcome).toEqual(OnSaveOutcome.Changed);
      expect(outcome.entry?.parameters).toEqual(["Hallo Welt"]);
      expect(entry.parameters).toEqual(["Hello world"]);
    });
  });
});
