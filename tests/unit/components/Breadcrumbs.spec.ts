import Breadcrumbs from "@/components/Breadcrumbs.vue";
import { emptyBook } from "@/models/Chapter";
import { shallowMount } from "@vue/test-utils";
import bookResponse from "../../fixtures/Book";

describe("Breadcrumbs component", () => {
  it("shows only the table of content link when book has no chapters", () => {
    /* Given */
    const bookPath = "path-to-book";
    const workPath = "path-to-workspace";
    const book = { ...emptyBook(), bookPath, workPath };

    /* When */
    const wrapper = shallowMount(Breadcrumbs, { props: { book } });

    /* Then */
    expect(wrapper.find("li[role=toc]").exists()).toBeTruthy();
    expect(wrapper.find("li[role=toc] > a").attributes("href")).toEqual(`/#/${bookPath}/${workPath}`);
    expect(wrapper.find("li[role=previous]").exists()).toBeFalsy();
    expect(wrapper.find("li[role=next]").exists()).toBeFalsy();
  });

  it("shows the table of content and next links as the first chapter is selected", () => {
    /* Given */
    const bookPath = "path-to-book";
    const workPath = "path-to-workspace";
    const chapterIndex = 0;
    const book = { ...bookResponse.data, bookPath, workPath, chapterIndex };

    /* When */
    const wrapper = shallowMount(Breadcrumbs, { props: { book } });

    /* Then */
    expect(wrapper.find("li[role=toc]").exists()).toBeTruthy();
    expect(wrapper.find("li[role=toc] > a").attributes("href")).toEqual(`/#/${bookPath}/${workPath}`);
    expect(wrapper.find("li[role=previous]").exists()).toBeFalsy();
    expect(wrapper.find("li[role=next]").exists()).toBeTruthy();
    expect(wrapper.find("li[role=next] > a").attributes("href")).toEqual(
      `/#/${bookPath}/${workPath}/${chapterIndex + 1}`
    );
  });

  it("shows the table of content and previous links as the last chapter is selected", () => {
    /* Given */
    const bookPath = "path-to-book";
    const workPath = "path-to-workspace";
    const chapterIndex = 1;
    const book = { ...bookResponse.data, bookPath, workPath, chapterIndex };

    /* When */
    const wrapper = shallowMount(Breadcrumbs, { props: { book } });

    /* Then */
    expect(wrapper.find("li[role=toc]").exists()).toBeTruthy();
    expect(wrapper.find("li[role=toc] > a").attributes("href")).toEqual(`/#/${bookPath}/${workPath}`);
    expect(wrapper.find("li[role=previous]").exists()).toBeTruthy();
    expect(wrapper.find("li[role=previous] > a").attributes("href")).toEqual(
      `/#/${bookPath}/${workPath}/${chapterIndex - 1}`
    );
    expect(wrapper.find("li[role=next]").exists()).toBeFalsy();
  });
});
