import Open from "@/components/Open.vue";
import { apiClient } from "@/services/ServiceApi";
import { flushPromises, shallowMount, VueWrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import { ComponentPublicInstance, VNodeProps } from "vue";
import bookSuccessfulResponse from "../../fixtures/Book";
import resetAllMocks = jest.resetAllMocks;

jest.mock("@/services/ServiceApi");

describe("Open component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("starts with the open local option selected", async () => {
    /* Given */
    const $route = { params: {} };
    const $router = { push: jest.fn() };

    /* When */
    const wrapper = shallowMount(Open, { global: { mocks: { $route, $router } } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeFalsy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Open");
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays the open local input when the open local option is checked", async () => {
    /* Given */
    const $route = { params: {} };
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { global: { mocks: { $route, $router } } });

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
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays the checkout input when the checkout option is checked", async () => {
    /* Given */
    const $route = { params: {} };
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { global: { mocks: { $route, $router } } });

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
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays the create new input when the create new is option checked", async () => {
    /* Given */
    const $route = { params: {} };
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { global: { mocks: { $route, $router } } });

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
    expect($router.push).not.toHaveBeenCalled();
  });

  it("fetches the book and notifies the parent when the parameters are available in the URL", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookSuccessfulResponse);
    const bookPath = "path-to-book";
    const workPath = "work-directory";
    const $route = { params: { bookPath, workPath } };
    const $router = { push: jest.fn() };

    /* When */
    const wrapper = shallowMount(Open, { global: { mocks: { $route, $router } } });
    await flushPromises();

    /* Then */
    const expected = { ...bookSuccessfulResponse.data, bookPath, workPath, opened: true };
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual("");
    expect(wrapper.emitted()["bookOpened"]).toEqual([[expected]]);
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({ name: "Book", params: { bookPath, workPath } });
  });
});

describe("Open repository from local file system", () => {
  it("displays an error when trying to open local without providing a book path", async () => {
    /* Given */
    const $route = { params: {} };
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { global: { mocks: { $route, $router } } });
    await selectOpenLocal(wrapper);

    /* When */
    await wrapper.find("input[id=openFromFolder]").setValue("");
    await wrapper.find("input[id=workspace]").setValue("work-directory");
    await wrapper.find("button[class=primary]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual(
      "Please provide both the book and workspace folder paths"
    );
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays an error when trying to open local without providing a work path", async () => {
    /* Given */
    const $route = { params: {} };
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { global: { mocks: { $route, $router } } });
    await selectOpenLocal(wrapper);

    /* When */
    await wrapper.find("input[id=openFromFolder]").setValue("book-path");
    await wrapper.find("input[id=workspace]").setValue("");
    await wrapper.find("button[class=primary]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual(
      "Please provide both the book and workspace folder paths"
    );
    expect(wrapper.emitted()["bookOpened"]).toBeUndefined();
    expect($router.push).not.toHaveBeenCalled();
  });

  it("fetches the book and notifies the parent", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookSuccessfulResponse);
    const bookPath = "book-path";
    const workPath = "work-path";
    const $route = { params: {} };
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { global: { mocks: { $route, $router } } });
    await selectOpenLocal(wrapper);

    /* When */
    await wrapper.find("input[id=openFromFolder]").setValue(bookPath);
    await wrapper.find("input[id=workspace]").setValue(workPath);
    await wrapper.find("button[class=primary]").trigger("click");
    await flushPromises();

    /* Then */
    const expected = { ...bookSuccessfulResponse.data, bookPath, workPath, opened: true };
    expect(wrapper.find("span[class=actionMessage]").text()).toEqual("");
    expect(wrapper.emitted()["bookOpened"]).toEqual([[expected]]);
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({ name: "Book", params: { bookPath, workPath } });
  });
});

/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/ban-types: "off" */
async function selectOpenLocal(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  await wrapper.find("input[id=openLocal]").trigger("click");
}
