import Chapter from "@/components/renderers/Chapter.vue";
import { Entry, OnSaveOutcome } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Chapter", () => {
  describe("View/Edit", () => {
    it("renders the chapter when not in edit mode", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Title:1", "Hello world"],
      };

      /* When */
      const wrapper = shallowMount(Chapter, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h2").text()).toEqual("Hello world");
      expect(wrapper.find("input").exists()).toBeFalsy();
    });

    it("renders the input field when in edit mode", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Title:1", "Hello world"],
        edit: true,
      };

      /* When */
      const wrapper = shallowMount(Chapter, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h2").exists()).toBeFalsy();
      expect(wrapper.find("input").element.value).toEqual("Hello world");
    });
  });

  describe("onSave()", () => {
    it("returns KeepEditing when the chapter is set to empty", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Title:1", "Hello world"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Chapter, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input").setValue("");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.KeepEditing });
      expect(entry.error).toEqual("The chapter cannot be empty");
      expect(entry.parameters).toEqual(["Title:1", "Hello world"]);
    });

    it("returns NotChanged when the chapter is not changed", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Title:1", "Hello world"],
        edit: true,
      } as Entry;
      shallowMount(Chapter, { props: { entry } });
      await flushPromises();

      /* When */
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.NotChanged });
      expect(entry.parameters).toEqual(["Title:1", "Hello world"]);
    });

    it("returns Changed when the chapter is changed", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Title:1", "Hello world"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Chapter, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input").setValue("Hallo Welt");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome.outcome).toEqual(OnSaveOutcome.Changed);
      expect(outcome.entry?.parameters).toEqual(["Title:1", "Hallo Welt"]);
      expect(entry.parameters).toEqual(["Title:1", "Hello world"]);
    });
  });
});
