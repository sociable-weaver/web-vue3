import App from "@/components/App.vue";
import Content from "@/components/Content.vue";
import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import { Book, emptyBook } from "@/models/Chapter";
import BookView from "@/views/Book.vue";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { ComponentPublicInstance, VNodeProps } from "vue";

describe("Book view", () => {
  it("displays only the app component before the app component confirms that the app is running", () => {
    /* Given */
    const $route = { params: {} };
    const wrapper = shallowMount(BookView, { global: { mocks: { $route } } });

    /* When */
    /* The application status is not yet checked */

    /* Then */
    assertThatOnlyAppIsVisible(wrapper);
  });

  it("displays only the app component when the application is not running", async () => {
    /* Given */
    const $route = { params: {} };
    const wrapper = shallowMount(BookView, { global: { mocks: { $route } } });

    /* When */
    await appIsRunningEventEmitted(wrapper, false);

    /* Then */
    assertThatOnlyAppIsVisible(wrapper);
  });

  it("displays only the open component when application is running when app is running and the book is not yet opened", async () => {
    /* Given */
    const $route = { params: {} };
    const wrapper = shallowMount(BookView, { global: { mocks: { $route } } });
    await appIsRunningEventEmitted(wrapper);

    /* When */
    /* No book is opened yet */

    /* Then */
    assertThatOnlyOpenIsVisible(wrapper);
  });

  it("displays only the table of content when book is opened and no chapter is selected", async () => {
    /* Given */
    // const bookPath = "path-to-book";
    const workPath = "path-to-workspace";
    const book = { ...emptyBook(), workPath, opened: true } as Book;
    const $route = { params: { bookPath: "", workPath: "", chapterPath: "" } };
    // const $router = { push: jest.fn() };
    const wrapper = shallowMount(BookView, { global: { mocks: { $route /*, $router*/ } } });
    await appIsRunningEventEmitted(wrapper);

    /* When */
    await bookIsOpened(wrapper, book);

    /* Then */
    assertThatOnlyTocIsVisible(wrapper);
    // expect($router.push).toHaveBeenCalledTimes(1);
    // expect($router.push).toHaveBeenCalledWith({ name: "Book", params: { bookPath, workPath, chapterPath: "" } });
  });
});

/* eslint @typescript-eslint/no-explicit-any: "off" */
async function appIsRunningEventEmitted(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>,
  appIsRunning = true
) {
  const app = wrapper.findComponent(App);
  expect(app.exists()).toBeTruthy();
  await app.vm.$emit("appIsRunning", appIsRunning);
}

/* eslint @typescript-eslint/no-explicit-any: "off" */
async function bookIsOpened(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>,
  book: Book
) {
  const open = wrapper.findComponent(Open);
  await open.vm.$emit("bookOpened", book);
}

/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/ban-types: "off" */
function assertThatOnlyAppIsVisible(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  expect(wrapper.findComponent(App).exists()).toBeTruthy();
  expect(wrapper.findComponent(Open).exists()).toBeFalsy();
  expect(wrapper.findComponent(Toc).exists()).toBeFalsy();
  expect(wrapper.findComponent(Content).exists()).toBeFalsy();
}

/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/ban-types: "off" */
function assertThatOnlyOpenIsVisible(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  expect(wrapper.findComponent(App).exists()).toBeFalsy();
  expect(wrapper.findComponent(Open).exists()).toBeTruthy();
  expect(wrapper.findComponent(Toc).exists()).toBeFalsy();
  expect(wrapper.findComponent(Content).exists()).toBeFalsy();
}

/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/ban-types: "off" */
function assertThatOnlyTocIsVisible(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  expect(wrapper.findComponent(App).exists()).toBeFalsy();
  expect(wrapper.findComponent(Open).exists()).toBeFalsy();
  expect(wrapper.findComponent(Toc).exists()).toBeTruthy();
  expect(wrapper.findComponent(Content).exists()).toBeFalsy();
}
