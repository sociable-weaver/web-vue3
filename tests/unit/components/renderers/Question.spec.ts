import Question from "@/components/renderers/Question.vue";
import { Entry, OnSaveOutcome } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Question", () => {
  describe("View", () => {
    it("renders an empty entry", async () => {
      /* Given */
      const entry = {
        type: "question",
      };

      /* When */
      const wrapper = shallowMount(Question, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=question]").text()).toEqual("What's on your mind?");
      expect(wrapper.find("div[role=answer]").text()).toEqual("");
    });

    it("renders the question without the answer", async () => {
      /* Given */
      const entry = {
        type: "question",
        parameters: ["Question:1", "What is this test doing?"],
      };

      /* When */
      const wrapper = shallowMount(Question, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=question]").text()).toEqual("What is this test doing?");
      expect(wrapper.find("div[role=answer]").text()).toEqual("");
    });

    it("renders the question and the answer", async () => {
      /* Given */
      const entry = {
        type: "question",
        parameters: [
          "Question:1",
          "What is this test doing?",
          "Answer:2",
          "This test is ensuring that",
          "the questions and answers are rendered well",
        ],
      };

      /* When */
      const wrapper = shallowMount(Question, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=question]").text()).toEqual("What is this test doing?");
      expect(wrapper.find("div[role=answer]").text()).toEqual(
        "This test is ensuring that\nthe questions and answers are rendered well"
      );
    });
  });

  describe("Edit", () => {
    it("renders an empty entry", async () => {
      /* Given */
      const entry = {
        type: "question",
        edit: true,
      };

      /* When */
      const wrapper = shallowMount(Question, { props: { entry } });
      await flushPromises();

      /* Then */
      /* TODO: the assertions are not working as expected.  Need to find a way how to retrieve the textarea value. */
      expect(wrapper.find("div[role=question] > textarea").text()).toEqual("");
      expect(wrapper.find("div[role=answer] > textarea").text()).toEqual("");
    });

    it("renders the question without the answer", async () => {
      /* Given */
      const entry = {
        type: "question",
        parameters: ["Question:1", "What is this test doing?"],
        edit: true,
      };

      /* When */
      const wrapper = shallowMount(Question, { props: { entry } });
      await flushPromises();

      /* Then */
      /* TODO: the assertions are not working as expected.  Need to find a way how to retrieve the textarea value. */
      // expect(wrapper.find("div[role=question] > textarea").text()).toEqual("What is this test doing?");
      expect(wrapper.find("div[role=answer] > textarea").text()).toEqual("");
    });
  });

  describe("onSave()", () => {
    it("returns KeepEditing when the question is set to empty", async () => {
      /* Given */
      const entry = {
        type: "question",
        parameters: ["Question:1", "What is this test doing?"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Question, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("div[role=question] > textarea").setValue("");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.KeepEditing });
      expect(entry.error).toEqual("The question cannot be empty");
      expect(entry.parameters).toEqual(["Question:1", "What is this test doing?"]);
    });

    it("returns NotChanged when the question and answer are not changed", async () => {
      /* Given */
      const entry = {
        type: "question",
        parameters: ["Question:1", "What is this test doing?"],
        edit: true,
      } as Entry;
      shallowMount(Question, { props: { entry } });
      await flushPromises();

      /* When */
      const outcome = entry.onSave();

      /* Then */
      expect(outcome).toEqual({ outcome: OnSaveOutcome.NotChanged });
      expect(entry.parameters).toEqual(["Question:1", "What is this test doing?"]);
    });

    it("returns Changed when the question is changed", async () => {
      /* Given */
      const entry = {
        type: "question",
        parameters: ["Question:1", "What is this test doing?"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Question, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("div[role=question] > textarea").setValue("What is this test about?");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome.outcome).toEqual(OnSaveOutcome.Changed);
      expect(outcome.entry?.parameters).toEqual(["Question:1", "What is this test about?"]);
      expect(entry.parameters).toEqual(["Question:1", "What is this test doing?"]);
    });
  });
});
