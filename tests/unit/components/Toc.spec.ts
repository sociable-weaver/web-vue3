import Toc from "@/components/Toc.vue";
import { apiClient, formatError } from "@/services/ServiceApi";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import bookSuccessfulResponse from "../../fixtures/BookSuccessful";
import chapterNotFoundResponse from "../../fixtures/ChapterNotFound";
import chapterSuccessfulResponse from "../../fixtures/ChapterSuccessful";

jest.mock("@/services/ServiceApi");

describe("Toc component", () => {
  it("displays the book table of contents", async () => {
    /* Given */
    const book = bookSuccessfulResponse.data;
    const chapterPath = "";

    /* When */
    const wrapper = shallowMount(Toc, { props: { book, chapterPath } });

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
    const bookPath = "path-to-book";
    const book = bookSuccessfulResponse.data;
    const chapterPath = "";
    const wrapper = shallowMount(Toc, { props: { book, chapterPath } });

    /* When */
    await wrapper.find("h2").trigger("click");
    await flushPromises();

    /* Then */
    const expected = { ...chapterSuccessfulResponse.data, bookPath, chapterPath: "chapter-1" };
    expect(wrapper.emitted()["chapterRead"]).toEqual([[expected]]);
  });

  it("shows unsuccessful message when the chapter is not found", async () => {
    /* Given */
    mocked(apiClient.get).mockRejectedValue(chapterNotFoundResponse);
    mocked(formatError).mockReturnValue("Chapter not found");
    const book = bookSuccessfulResponse.data;
    const chapterPath = "";
    const wrapper = shallowMount(Toc, { props: { book, chapterPath } });

    /* When */
    await wrapper.find("h2").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.emitted()["chapterRead"]).toBeUndefined();
    expect(wrapper.find("pre[class=error]").text()).toEqual("Failed to open chapter (Chapter not found)");
  });
});
