import Question from "@/components/renderers/Question.vue";
import { shallowMount } from "@vue/test-utils";

describe("Question", () => {
  describe("View/Edit", () => {
    it("renders an empty entry", async () => {
      /* Given */
      const entry = {
        type: "question",
      };

      /* When */
      const wrapper = shallowMount(Question, { props: { entry } });

      /* Then */
      expect(wrapper.find("div[role=question]").text()).toEqual("What's on your mind?");
      expect(wrapper.find("div[role=answer]").text()).toEqual("");
    });

    it("renders a question and answer", async () => {
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

      /* Then */
      expect(wrapper.find("div[role=question]").text()).toEqual("What is this test doing?");
      expect(wrapper.find("div[role=answer]").text()).toEqual(
        "This test is ensuring that\nthe questions and answers are rendered well"
      );
    });
  });
});
