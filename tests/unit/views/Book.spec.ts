import App from "@/components/App.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import Content from "@/components/Content.vue";
import Open from "@/components/Open.vue";
import Toc from "@/components/Toc.vue";
import { apiClient, formatError } from "@/services/ServiceApi";
import BookView from "@/views/Book.vue";
import { flushPromises, shallowMount, VueWrapper } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import { ComponentPublicInstance, VNodeProps } from "vue";
import bookResponse from "../../fixtures/Book";
import networkError from "../../fixtures/NetworkError";
import resetAllMocks = jest.resetAllMocks;

jest.mock("@/services/ServiceApi");

describe("Book view", () => {
  beforeEach(() => {
    resetAllMocks();
  });

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

  it("fetches the book when the path is provided and then show the open component when it fails", async () => {
    /* Given */
    mocked(apiClient.get).mockRejectedValueOnce(networkError);
    mocked(formatError).mockReturnValue(networkError.message);
    const action = "read";
    const pathParam1 = "path-to-book";
    const pathParam2 = "path-to-workspace";
    const $route = { params: { action, pathParam1, pathParam2 } };
    const wrapper = shallowMount(BookView, { global: { mocks: { $route } } });
    await appIsRunningEventEmitted(wrapper);

    /* When */
    /* Book is fetched */
    await flushPromises();

    /* Then */
    assertThatOnlyOpenIsVisible(wrapper);
  });

  it("fetches the book when the path is provided and then show the toc component when it succeeds", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookResponse);
    const action = "read";
    const pathParam1 = "path-to-book";
    const pathParam2 = "path-to-workspace";
    const $route = { params: { action, pathParam1, pathParam2 } };
    const wrapper = shallowMount(BookView, { global: { mocks: { $route } } });
    await appIsRunningEventEmitted(wrapper);

    /* When */
    /* Book is fetched */
    await flushPromises();

    /* Then */
    assertThatOnlyTocIsVisible(wrapper);
  });

  it("displays table chapter with a chapter is selected", async () => {
    /* Given */
    mocked(apiClient.get).mockResolvedValueOnce(bookResponse);
    const action = "read";
    const pathParam1 = "path-to-book";
    const pathParam2 = "path-to-workspace";
    const pathParam3 = 0;
    const $route = { params: { action, pathParam1, pathParam2, pathParam3 } };
    const wrapper = shallowMount(BookView, { global: { mocks: { $route } } });
    await appIsRunningEventEmitted(wrapper);

    /* When */
    await flushPromises();

    /* Then */
    assertThatOnlyContentIsVisible(wrapper);
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
/* eslint @typescript-eslint/ban-types: "off" */
function assertThatOnlyAppIsVisible(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  expect(wrapper.findComponent(App).exists()).toBeTruthy();
  expect(wrapper.findComponent(Open).exists()).toBeFalsy();
  expect(wrapper.findComponent(Toc).exists()).toBeFalsy();
  expect(wrapper.findComponent(Breadcrumbs).exists()).toBeFalsy();
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
  expect(wrapper.findComponent(Breadcrumbs).exists()).toBeFalsy();
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
  expect(wrapper.findComponent(Breadcrumbs).exists()).toBeFalsy();
  expect(wrapper.findComponent(Content).exists()).toBeFalsy();
}

/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/ban-types: "off" */
function assertThatOnlyContentIsVisible(
  wrapper: VueWrapper<ComponentPublicInstance<{}, {}, {}, {}, {}, Record<string, any>, VNodeProps>> &
    Record<string, any>
) {
  expect(wrapper.findComponent(App).exists()).toBeFalsy();
  expect(wrapper.findComponent(Open).exists()).toBeFalsy();
  expect(wrapper.findComponent(Toc).exists()).toBeFalsy();
  expect(wrapper.findComponent(Breadcrumbs).exists()).toBeTruthy();
  expect(wrapper.findComponent(Content).exists()).toBeTruthy();
}
