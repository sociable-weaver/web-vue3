import Markdown from "@/components/renderers/Markdown.vue";
import { shallowMount } from "@vue/test-utils";

describe("Markdown", () => {
  it("converts markdown to HTML", async () => {
    /* Given */
    const entry = {
      type: "makdown",
      parameters: ["## Hello world"],
    };

    /* When */
    const wrapper = shallowMount(Markdown, { props: { entry } });

    /* Then */
    expect(wrapper.find("h2").text()).toEqual("Hello world");
  });

  it("interpolates variables", async () => {
    /* Given */
    const entry = {
      type: "makdown",
      parameters: ["## ${TITLE}"],
      variables: ["TITLE"],
      values: { TITLE: "Hello World!!" },
    };

    /* When */
    const wrapper = shallowMount(Markdown, { props: { entry } });

    /* Then */
    expect(wrapper.find("h2").text()).toEqual("Hello World!!");
  });
});
