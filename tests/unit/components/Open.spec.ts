import Open from "@/components/Open.vue";
import { apiClient } from "@/services/ServiceApi";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import bookSuccessfulResponse from "../../fixtures/BookSuccessful";

jest.mock("@/services/ServiceApi");

describe("Open component", () => {
  it("starts with the open local option selected", async () => {
    /* Given */
    const workspace = { bookPath: "", workPath: "" };

    /* When */
    const wrapper = shallowMount(Open, { props: { workspace } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=createNewFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("button[class=open]").text()).toEqual("Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays the checkout input when the checkout option is checked", async () => {
    /* Given */
    const workspace = { bookPath: "", workPath: "" };
    const wrapper = shallowMount(Open, { props: { workspace } });

    /* When */
    wrapper.find("input[id=checkout]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=createNewFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("button[class=open]").text()).toEqual("Checkout and Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays the open local input when the open local option is checked", async () => {
    /* Given */
    const workspace = { bookPath: "", workPath: "" };
    const wrapper = shallowMount(Open, { props: { workspace } });

    /* When */
    wrapper.find("input[id=openLocal]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=createNewFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("button[class=open]").text()).toEqual("Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays the create new input when the create new is option checked", async () => {
    /* Given */
    const workspace = { bookPath: "", workPath: "" };
    const wrapper = shallowMount(Open, { props: { workspace } });

    /* When */
    wrapper.find("input[id=createNew]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=createNewFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("button[class=open]").text()).toEqual("Create");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("fetches the book and notifies the parent when the path is provided", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookSuccessfulResponse);
    const bookPath = "path-to-book";
    const workPath = "work-directory";
    const workspace = { bookPath, workPath };

    /* When */
    const wrapper = shallowMount(Open, { props: { workspace } });
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
    const workspace = { bookPath: "", workPath: "work-directory" };
    const wrapper = shallowMount(Open, { props: { workspace } });
    wrapper.find("input[id=openLocal]").trigger("click");
    await flushPromises();

    /* When */
    wrapper.find("button[class=open]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual(
      "Please provide both the book and workspace folder paths"
    );
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays an error when trying to open local without providing a work path", async () => {
    /* Given */
    const workspace = { bookPath: "path-to-book", workPath: "" };
    const wrapper = shallowMount(Open, { props: { workspace } });
    wrapper.find("input[id=openLocal]").trigger("click");
    await flushPromises();

    /* When */
    wrapper.find("button[class=open]").trigger("click");
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
    const workspace = { bookPath: "", workPath };
    const wrapper = shallowMount(Open, { props: { workspace } });
    await flushPromises();

    const bookPath = "path-to-book";
    wrapper.find("input[id=openLocal]").trigger("click");
    wrapper.find("input[id=openFromFolder]").setValue(bookPath);
    await flushPromises();

    /* When */
    await wrapper.find("button[class=open]").trigger("click");

    /* Then */
    const expected = { ...bookSuccessfulResponse.data, bookPath, workPath };
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual("");
    expect(wrapper.emitted()["bookOpened"]).toEqual([[expected]]);
  });
});
