import Toc from "@/components/Toc.vue";
import { apiClient } from "@/services/ServiceApi";
import { shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import bookSuccessfulResponse from "../../fixtures/BookSuccessful";
import chapterSuccessfulResponse from "../../fixtures/ChapterSuccessful";

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

  it("reads the chapter and notifies the parent", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(chapterSuccessfulResponse);
    const book = bookSuccessfulResponse.data;
    const wrapper = shallowMount(Toc, {
      props: {
        book,
      },
    });

    /* When */
    await wrapper.find("h3").trigger("click");

    /* Then */
    expect(wrapper.emitted()["chapterRead"]).toEqual([[chapterSuccessfulResponse.data]]);
  });
});
