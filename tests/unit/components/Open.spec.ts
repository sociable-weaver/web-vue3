import Open from "@/components/Open.vue";
import { apiClient } from "@/services/ServiceApi";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import bookSuccessfulResponse from "../../fixtures/BookSuccessful";

jest.mock("@/services/ServiceApi");

describe("Open component", () => {
  it("starts with the checkout option selected", async () => {
    /* Given */
    const workspace = { bookPath: "", workPath: "" };

    /* When */
    const wrapper = shallowMount(Open, { props: { workspace } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("button[class=open]").text()).toEqual("Checkout and Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays the checkout options", async () => {
    /* Given */
    const workspace = { bookPath: "", workPath: "" };
    const wrapper = shallowMount(Open, { props: { workspace } });

    /* When */
    await wrapper.find("input[id=checkout]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("button[class=open]").text()).toEqual("Checkout and Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("displays the open local options", async () => {
    /* Given */
    const workspace = { bookPath: "", workPath: "" };
    const wrapper = shallowMount(Open, { props: { workspace } });

    /* When */
    await wrapper.find("input[id=openLocal]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=pathToRepository]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=checkoutToFolder]").attributes().disabled).toEqual("");
    expect(wrapper.find("input[id=openFromFolder]").attributes().disabled).toBeUndefined();
    expect(wrapper.find("button[class=open]").text()).toEqual("Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("fetches the book and notifies the parent when the path is provided", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookSuccessfulResponse);
    const path = "path-to-book";
    const workspace = { bookPath: path, workPath: "work-directory" };

    /* When */
    const wrapper = shallowMount(Open, { props: { workspace } });
    await flushPromises();

    /* Then */
    const expected = { ...bookSuccessfulResponse.data, path };
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual("");
    expect(wrapper.emitted()["bookOpened"]).toEqual([[expected]]);
  });
});

describe("Open repository from local file system", () => {
  it("displays an error when trying to open local without providing a path", async () => {
    /* Given */
    const workspace = { bookPath: "", workPath: "work-directory" };
    const wrapper = shallowMount(Open, { props: { workspace } });
    await flushPromises();
    await wrapper.find("input[id=openLocal]").trigger("click");

    /* When */
    await wrapper.find("button[class=open]").trigger("click");

    /* Then */
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual("Please provide the folder path");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
  });

  it("fetches the book and notifies the parent", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookSuccessfulResponse);
    const workspace = { bookPath: "", workPath: "work-directory" };
    const wrapper = shallowMount(Open, { props: { workspace } });
    await flushPromises();

    const path = "path-to-book";
    await wrapper.find("input[id=openLocal]").trigger("click");
    await wrapper.find("input[id=openFromFolder]").setValue(path);

    /* When */
    await wrapper.find("button[class=open]").trigger("click");

    /* Then */
    const expected = { ...bookSuccessfulResponse.data, path };
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual("");
    expect(wrapper.emitted()["bookOpened"]).toEqual([[expected]]);
  });
});
