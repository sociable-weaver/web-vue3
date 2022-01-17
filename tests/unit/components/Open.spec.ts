import Open from "@/components/Open.vue";
import { apiClient } from "@/services/ServiceApi";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import bookSuccessfulResponse from "../../fixtures/BookSuccessful";

jest.mock("@/services/ServiceApi");

describe("Open component", () => {
  it("starts with the open local option selected", async () => {
    /* Given */
    const book = { bookPath: "", workPath: "" };

    /* When */
    const wrapper = shallowMount(Open, { props: { book } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeFalsy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays the checkout input when the checkout option is checked", async () => {
    /* Given */
    const book = { bookPath: "", workPath: "" };
    const wrapper = shallowMount(Open, { props: { book } });

    /* When */
    await wrapper.find("input[id=checkout]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeFalsy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Checkout and Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays the open local input when the open local option is checked", async () => {
    /* Given */
    const book = { bookPath: "", workPath: "" };
    const wrapper = shallowMount(Open, { props: { book } });

    /* When */
    await wrapper.find("input[id=openLocal]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeFalsy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays the create new input when the create new is option checked", async () => {
    /* Given */
    const book = { bookPath: "", workPath: "" };
    const wrapper = shallowMount(Open, { props: { book } });

    /* When */
    await wrapper.find("input[id=createNew]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeTruthy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Create");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("fetches the book and notifies the parent when the path is provided", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookSuccessfulResponse);
    const bookPath = "path-to-book";
    const workPath = "work-directory";
    const book = { bookPath, workPath };

    /* When */
    const wrapper = shallowMount(Open, { props: { book } });
    await flushPromises();

    /* Then */
    const expected = { ...bookSuccessfulResponse.data, bookPath, workPath };
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual("");
    expect(wrapper.emitted()["bookOpened"]).toEqual([[expected]]);
  });
});

describe("Open repository from local file system", () => {
  it("displays an error when trying to open local without providing a book path", async () => {
    /* Given */
    const book = { bookPath: "", workPath: "work-directory" };
    const wrapper = shallowMount(Open, { props: { book } });
    await wrapper.find("input[id=openLocal]").trigger("click");
    await flushPromises();

    /* When */
    await wrapper.find("button[class=primary]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual(
      "Please provide both the book and workspace folder paths"
    );
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays an error when trying to open local without providing a work path", async () => {
    /* Given */
    const book = { bookPath: "path-to-book", workPath: "" };
    const wrapper = shallowMount(Open, { props: { book } });
    await wrapper.find("input[id=openLocal]").trigger("click");
    await flushPromises();

    /* When */
    await wrapper.find("button[class=primary]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual(
      "Please provide both the book and workspace folder paths"
    );
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("fetches the book and notifies the parent", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookSuccessfulResponse);
    const workPath = "work-directory";
    const book = { bookPath: "", workPath };
    const wrapper = shallowMount(Open, { props: { book } });
    await flushPromises();

    const bookPath = "path-to-book";
    await wrapper.find("input[id=openLocal]").trigger("click");
    await wrapper.find("input[id=openFromFolder]").setValue(bookPath);
    await flushPromises();

    /* When */
    await wrapper.find("button[class=primary]").trigger("click");

    /* Then */
    const expected = { ...bookSuccessfulResponse.data, bookPath, workPath };
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual("");
    expect(wrapper.emitted()["bookOpened"]).toEqual([[expected]]);
  });
});
