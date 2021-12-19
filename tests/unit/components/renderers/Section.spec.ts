import Section from "@/components/renderers/Section.vue";
import { Entry, OnSaveOutcome } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Section", () => {
  describe("View/Edit", () => {
    it("renders the section when not in edit mode", async () => {
      /* Given */
      const entry = {
        type: "section",
        parameters: ["Hello world"],
      };

      /* When */
      const wrapper = shallowMount(Section, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h3").text()).toEqual("Hello world");
      expect(wrapper.find("input").exists()).toBeFalsy();
    });

    it("renders the input field when in edit mode", async () => {
      /* Given */
      const entry = {
        type: "section",
        parameters: ["Hello world"],
        edit: true,
      };

      /* When */
      const wrapper = shallowMount(Section, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h3").exists()).toBeFalsy();
      expect(wrapper.find("input").element.value).toEqual("Hello world");
    });
  });

  describe("onSave()", () => {
    it("returns KeepEditing when the section is set to empty", async () => {
      /* Given */
      const entry = {
        type: "section",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Section, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input").setValue("");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.KeepEditing });
      expect(entry.error).toEqual("The section cannot be empty");
      expect(entry.parameters).toEqual(["Hello world"]);
    });

    it("returns NotChanged when the section is not changed", async () => {
      /* Given */
      const entry = {
        type: "section",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      shallowMount(Section, { props: { entry } });
      await flushPromises();

      /* When */
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.NotChanged });
      expect(entry.parameters).toEqual(["Hello world"]);
    });

    it("returns Changed when the section is changed", async () => {
      /* Given */
      const entry = {
        type: "section",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Section, { props: { entry } });
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
