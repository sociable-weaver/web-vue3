import Toc from "@/components/Toc.vue";
import { shallowMount } from "@vue/test-utils";
import bookSuccessfulResponse from "../../fixtures/BookSuccessful";

jest.mock("@/services/ServiceApi");

describe("Toc component", () => {
  it("displays the book table of contents", async () => {
    /* Given */
    const book = bookSuccessfulResponse.data;

    /* When */
    const wrapper = shallowMount(Toc, {
      props: {
        book,
      },
    });

    /* Then */
    expect(wrapper.text()).toContain("Test title");
    expect(wrapper.text()).toContain("Test description");
    expect(wrapper.text()).toContain("Chapter 1");
    expect(wrapper.text()).toContain("Test chapter 1");
    expect(wrapper.text()).toContain("Chapter 2");
    expect(wrapper.text()).toContain("Test chapter 2");
  });
});
