import Open from "@/components/Open.vue";
import { emptyBook } from "@/models/Chapter";
import { flushPromises, shallowMount, VueWrapper } from "@vue/test-utils";
import { ComponentPublicInstance, VNodeProps } from "vue";

describe("Open component", () => {
  it("starts with the open local option selected", () => {
    /* Given */
    const book = emptyBook();
    const $router = { push: jest.fn() };

    /* When */
    const wrapper = shallowMount(Open, { props: { book }, global: { mocks: { $router } } });

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeFalsy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Open");
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays the open local input when the open local option is checked", async () => {
    /* Given */
    const book = emptyBook();
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { props: { book }, global: { mocks: { $router } } });

    /* When */
    await checkOpenLocal(wrapper);

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeFalsy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Open");
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays the checkout input when the checkout option is checked", async () => {
    /* Given */
    const book = emptyBook();
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { props: { book }, global: { mocks: { $router } } });

    /* When */
    await checkCheckout(wrapper);

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeTruthy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeFalsy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Checkout and Open");
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays the create new input when the create new is option checked", async () => {
    /* Given */
    const book = emptyBook();
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { props: { book }, global: { mocks: { $router } } });

    /* When */
    await checkCreateNew(wrapper);

    /* Then */
    expect(wrapper.find("input[id=openFromFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=pathToRepository]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=checkoutToFolder]").exists()).toBeFalsy();
    expect(wrapper.find("input[id=createNewFolder]").exists()).toBeTruthy();
    expect(wrapper.find("button[class=primary]").text()).toEqual("Create");
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays the book error when provided", async () => {
    /* Given */
    const error = "Cannot open book!!";
    const book = { ...emptyBook(), error };

    /* When */
    const wrapper = shallowMount(Open, { props: { book } });

    /* Then */
    expect(wrapper.find("span[class=error]").text()).toEqual(error);
  });
});

describe("Open repository from local file system", () => {
  it("displays an error when trying to open local without providing a book path", async () => {
    /* Given */
    const book = emptyBook();
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { props: { book }, global: { mocks: { $router } } });
    await checkOpenLocal(wrapper);

    /* When */
    await wrapper.find("input[id=openFromFolder]").setValue("");
    await wrapper.find("input[id=workspace]").setValue("work-directory");
    await wrapper.find("button[class=primary]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("span[class=error]").text()).toEqual(
      "Please provide both the book and workspace directory paths"
    );
    expect($router.push).not.toHaveBeenCalled();
  });

  it("displays an error when trying to open local without providing a work path", async () => {
    /* Given */
    const book = emptyBook();
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { props: { book }, global: { mocks: { $router } } });
    await checkOpenLocal(wrapper);

    /* When */
    await wrapper.find("input[id=openFromFolder]").setValue("book-path");
    await wrapper.find("input[id=workspace]").setValue("");
    await wrapper.find("button[class=primary]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("span[class=error]").text()).toEqual(
      "Please provide both the book and workspace directory paths"
    );
    expect($router.push).not.toHaveBeenCalled();
  });

  it("updates the URL when the book is opened", async () => {
    /* Given */
    const bookPath = "book-path";
    const workPath = "work-path";
    const book = emptyBook();
    const $router = { push: jest.fn() };
    const wrapper = shallowMount(Open, { props: { book }, global: { mocks: { $router } } });
    await checkOpenLocal(wrapper);

    /* When */
    await wrapper.find("input[id=openFromFolder]").setValue(bookPath);
    await wrapper.find("input[id=workspace]").setValue(workPath);
    await wrapper.find("button[class=primary]").trigger("click");
    await flushPromises();

    /* Then */
    expect(wrapper.find("span[class=error]").exists()).toBeFalsy();
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({ name: "Book", params: { bookPath, workPath } });
  });
});

/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/ban-types: "off" */
async function checkOpenLocal(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  await wrapper.find("input[id=openLocal]").trigger("click");
  await flushPromises();
}

async function checkCheckout(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  await wrapper.find("input[id=checkout]").trigger("click");
  await flushPromises();
}

async function checkCreateNew(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  await wrapper.find("input[id=createNew]").trigger("click");
  await flushPromises();
}
