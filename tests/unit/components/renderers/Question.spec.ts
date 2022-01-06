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
  });
});
