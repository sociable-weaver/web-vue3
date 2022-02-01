import Toc from "@/components/Toc.vue";
import { Book } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";
import bookResponse from "../../fixtures/Book";

describe("Toc component", () => {
  it("displays the table of contents", async () => {
    /* Given */
    const book = bookResponse.data;

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

  it("updates the URL when a chapter is selected", async () => {
    /* Given */
    const action = "read";
    const pathParam1 = "path-to-book";
    const workPath = "path-to-workspace";
    const chapterIndex = 0;
    const $router = { push: jest.fn() };
    const book = { ...bookResponse.data, workPath } as Book;
    const wrapper = shallowMount(Toc, { props: { book }, global: { mocks: { $router } } });

    /* When */
    await wrapper.find("h2").trigger("click");
    await flushPromises();

    /* Then */
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({ name: "Book", params: { action, pathParam1, workPath, chapterIndex } });
  });
});
