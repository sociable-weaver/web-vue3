import Toc from "@/components/Toc.vue";
import { Book } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";
import bookSuccessfulResponse from "../../fixtures/Book";
import resetAllMocks = jest.resetAllMocks;

jest.mock("@/services/ServiceApi");

describe("Toc component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("displays the table of contents", async () => {
    /* Given */
    const book = bookSuccessfulResponse.data;

    /* When */
    const wrapper = shallowMount(Toc, { props: { book } });

    /* Then */
    expect(wrapper.text()).toContain("Test title");
    expect(wrapper.text()).toContain("Test description");
    expect(wrapper.text()).toContain("Chapter 1");
    expect(wrapper.text()).toContain("Test chapter 1");
    expect(wrapper.text()).toContain("Chapter 2");
    expect(wrapper.text()).toContain("Test chapter 2");
  });

  it("notifies the parent about the user selection", async () => {
    /* Given */
    const $router = { push: jest.fn() };
    const book = { ...bookSuccessfulResponse.data, workPath: "path-to-workspace" } as Book;
    const wrapper = shallowMount(Toc, { props: { book }, global: { mocks: { $router } } });

    /* When */
    await wrapper.find("h2").trigger("click");
    await flushPromises();

    /* Then */
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({
      name: "Book",
      params: { bookPath: "path-to-book", workPath: "path-to-workspace", chapterPath: "chapter-1" },
    });
  });
});
