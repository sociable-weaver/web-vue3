import GitApplyPatch from "@/components/renderers/GitApplyPatch.vue";
import { shallowMount } from "@vue/test-utils";

describe("Git Apply Patch", () => {
  describe("View/Edit", () => {
    it("displays the git apply patch for an empty entry", async () => {
      /* Given */
      const entry = {
        type: "git-apply-patch",
      };

      /* When */
      const wrapper = shallowMount(GitApplyPatch, { props: { entry } });

      /* Then */
      expect(wrapper.find("div").text()).toEqual("No patch information is available");
    });
  });
});
