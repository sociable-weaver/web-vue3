import Markdown from "@/components/renderers/Markdown.vue";
import { Entry, OnSaveOutcome } from "@/models/Chapter";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Markdown", () => {
  describe("View", () => {
    it("renders an empty entry", async () => {
      /* Given */
      const entry = {
        type: "markdown",
      };

      /* When */
      const wrapper = shallowMount(Markdown, { props: { entry } });

      /* Then */
      expect(wrapper.text()).toContain("Lorem ipsum");
    });

    it("converts markdown to HTML", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: ["## Hello world"],
      };

      /* When */
      const wrapper = shallowMount(Markdown, { props: { entry } });

      /* Then */
      expect(wrapper.find("h2").text()).toEqual("Hello world");
    });

    it("interpolates single variable", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: ["## ${TITLE}"],
        variables: ["TITLE"],
        values: { TITLE: "Hello World!!" },
      };

      /* When */
      const wrapper = shallowMount(Markdown, { props: { entry } });

      /* Then */
      expect(wrapper.find("h2").text()).toEqual("Hello World!!");
    });

    it("interpolates multiple instances of the same variable", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: ["## ${TITLE}", "${TITLE}"],
        variables: ["TITLE"],
        values: { TITLE: "Hello World!!" },
      };

      /* When */
      const wrapper = shallowMount(Markdown, { props: { entry } });

      /* Then */
      expect(wrapper.find("h2").text()).toEqual("Hello World!!");
      expect(wrapper.find("p").text()).toEqual("Hello World!!");
    });

    it("interpolates multiple variables", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: ["## ${NAME} ${SURNAME}"],
        variables: ["NAME", "SURNAME"],
        values: { NAME: "Albert", SURNAME: "Attard" },
      };

      /* When */
      const wrapper = shallowMount(Markdown, { props: { entry } });

      /* Then */
      expect(wrapper.find("h2").text()).toEqual("Albert Attard");
    });
  });

  describe("Edit", () => {
    it("lists the variables", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: ["## ${TITLE}"],
        variables: ["TITLE"],
        values: { TITLE: "Hello World!!" },
        edit: true,
      };

      /* When */
      const wrapper = shallowMount(Markdown, { props: { entry } });
      await flushPromises();

      /* Then */
      expect((wrapper.find("div[role=variable] > input").element as HTMLInputElement).value).toEqual("TITLE");
    });

    it("does not show the missing variables section when no variables are missing", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: ["## ${TITLE}"],
        variables: ["TITLE"],
        values: { TITLE: "Hello World!!" },
        edit: true,
      };

      /* When */
      const wrapper = shallowMount(Markdown, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=missing-variable]").exists()).toBeFalsy();
    });

    it("lists the missing variables", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: ["## ${TITLE}"],
        variables: [],
        edit: true,
      };

      /* When */
      const wrapper = shallowMount(Markdown, { props: { entry } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=missing-variable] > span").text()).toEqual("TITLE");
    });
  });

  describe("onAddVariable()", () => {
    it("adds the new variable to the list of variables", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: [],
        variables: [],
        edit: true,
      };
      const wrapper = shallowMount(Markdown, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input[role=new-variable]").setValue("TITLE");
      await wrapper.find("button[role=add-variable]").trigger("click");
      await flushPromises();

      /* Then */
      expect((wrapper.find("div[role=variable] > input").element as HTMLInputElement).value).toEqual("TITLE");
      expect((wrapper.find("input[role=new-variable]").element as HTMLInputElement).value).toEqual("");
    });
  });

  describe("onUpdateVariable()", () => {
    it("updates the variable with the new value", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: [],
        variables: ["NAME"],
        edit: true,
      };
      const wrapper = shallowMount(Markdown, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("input[role=update-variable]").setValue("TITLE");
      await flushPromises();

      /* Then */
      expect((wrapper.find("div[role=variable] > input").element as HTMLInputElement).value).toEqual("TITLE");
    });
  });

  describe("onRemoveVariable()", () => {
    it("removes the variable", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: [],
        variables: ["NAME"],
        edit: true,
      };
      const wrapper = shallowMount(Markdown, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("button[role=remove-variable]").trigger("click");
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=variable] > input").exists()).toBeFalsy();
    });
  });

  describe("onSave()", () => {
    it("returns Changed when the markdown is changed", async () => {
      /* Given */
      const entry = {
        type: "markdown",
        parameters: ["## ${TITLE}"],
        variables: ["TITLE"],
        edit: true,
      } as Entry;
      const wrapper = shallowMount(Markdown, { props: { entry } });
      await flushPromises();

      /* When */
      await wrapper.find("textarea").setValue("## ${NAME}");
      await wrapper.find("input[role=update-variable]").setValue("NAME");
      await flushPromises();
      const outcome = entry.onSave();

      /* Then */
      expect(outcome.outcome).toEqual(OnSaveOutcome.Changed);
      expect(outcome.entry?.parameters).toEqual(["## ${NAME}"]);
      expect(outcome.entry?.variables).toEqual(["NAME"]);
      expect(entry.parameters).toEqual(["## ${TITLE}"]);
      expect(entry.variables).toEqual(["TITLE"]);
    });
  });
});
