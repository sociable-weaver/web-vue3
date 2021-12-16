import Chapter from "@/components/renderers/Chapter.vue";
import { Entry, OnSaveOutcome } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Chapter", () => {
  describe("View/Edit", () => {
    it("renders the title when not in edit mode", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Hello world"],
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
        parameters: ["Hello world"],
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
    it("returns KeepEditing when the title is set to emtpy", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Chapter, { props: { entry } });
      await flushPromises();

      /* When */
      wrapper.find("input").setValue("");
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual(OnSaveOutcome.KeepEditing);
      expect(entry.error).toEqual("The chapter title cannot be empty");
    });

    it("returns NotChanged when the title is not changed", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      shallowMount(Chapter, { props: { entry } });
      await flushPromises();

      /* When */
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual(OnSaveOutcome.NotChanged);
    });

    it("returns Changed when the title is changed", async () => {
      /* Given */
      const entry = {
        type: "chapter",
        parameters: ["Hello world"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Chapter, { props: { entry } });
      await flushPromises();

      /* When */
      wrapper.find("input").setValue("Hallo Welt");
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual(OnSaveOutcome.Changed);
      expect(entry.error).toEqual("");
    });
  });
});
