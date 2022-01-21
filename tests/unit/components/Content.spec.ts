import Content from "@/components/Content.vue";
import { OnSaveOutcome } from "@/models/Chapter";
import { apiClient, formatError } from "@/services/ServiceApi";
import { flushPromises, mount, shallowMount } from "@vue/test-utils";
import { mocked } from "ts-jest/utils";
import networkError from "../../fixtures/NetworkError";
import saveEntrySuccessfulResponse from "../../fixtures/SaveEntry";
import resetAllMocks = jest.resetAllMocks;

jest.mock("@/services/ServiceApi");

describe("Content", () => {
  describe("Rendering", () => {
    it("displays the chapter", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "chapter",
                parameters: ["Title:1", "Hello world"],
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h2").text()).toEqual("Hello world");
    });

    it("displays the command without working directory", async () => {
      /* Given */ const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "command",
                parameters: ["java -jar hello-world.jar"],
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("pre").text()).toEqual("java -jar hello-world.jar");
    });

    it("displays the git apply diff as HTML", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "git-apply-patch",
                workingDirectory: "hello-world",
                parameters: [
                  "diff --git a/HelloWorld.java b/HelloWorld.java",
                  "index cc78ded..cd36a67 100755",
                  "--- a/HelloWorld.java",
                  "+++ b/HelloWorld.java",
                  "@@ -1,5 +1,3 @@",
                  "-#!/usr/bin/java --source 17",
                  "-",
                  " public class HelloWorld {",
                  "     public static void main(final String[] args) {",
                  '         System.out.println("Hello World!!");',
                  "",
                ],
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[class=d2h-wrapper]").text()).toContain("public class HelloWorld {");
    });

    it("displays the markdown as HTML", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "markdown",
                parameters: ["**Hello world**"],
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("strong").text()).toEqual("Hello world");
    });

    it("displays the question", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "question",
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=question]").text()).toEqual("What's on your mind?");
    });

    it("displays the section", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "section",
                parameters: ["Hello world"],
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h3").text()).toEqual("Hello world");
    });

    it("displays the subsection", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "subsection",
                parameters: ["Hello world"],
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("h4").text()).toEqual("Hello world");
    });

    it("displays the non-sensitive variable input", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "variable",
                name: "NAME",
                sensitive: false,
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("label").text()).toEqual("Set variable NAME");
      expect(wrapper.find("input").attributes("type")).toEqual("text");
    });

    it("displays a message indicating that this type is not yet supported", async () => {
      /* Given */
      const type = "unsupported-type";
      const book = {
        chapterIndex: 0,
        chapters: [{ entries: [{ type }] }],
      };

      /* When */
      const wrapper = mount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=error]").text()).toEqual(`Do not know how to renter entries of type: ${type}`);
    });
  });

  describe("Editing", () => {
    beforeEach(() => {
      resetAllMocks();
    });

    it("displays the edit buttons when viewing the entry", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "chapter",
                parameters: ["Hello world"],
                showEditControls: true,
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = shallowMount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=save-buttons]").exists()).toBeFalsy();
      expect(wrapper.find("div[role=edit-buttons]").exists()).toBeTruthy();
    });

    it("displays the save buttons when editing the entry", async () => {
      /* Given */
      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "chapter",
                parameters: ["Hello world"],
                edit: true,
              },
            ],
          },
        ],
      };

      /* When */
      const wrapper = shallowMount(Content, { props: { book } });
      await flushPromises();

      /* Then */
      expect(wrapper.find("div[role=save-buttons]").exists()).toBeTruthy();
      expect(wrapper.find("div[role=edit-buttons]").exists()).toBeFalsy();
    });

    it("does not make an API call when invalid input was provided (the onSave() returns KeepEditing)", async () => {
      /* Given */
      const onSave = jest.fn();
      onSave.mockReturnValueOnce({ outcome: OnSaveOutcome.KeepEditing });

      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "chapter",
                parameters: ["Hello world"],
                edit: true,
                onSave,
              },
            ],
          },
        ],
      };
      const wrapper = shallowMount(Content, { props: { book } });
      await flushPromises();

      /* When */
      await wrapper.find("button[role=save]").trigger("click");
      await flushPromises();

      /* Then */
      expect(book.chapters[0].entries[0].edit).toEqual(true);
      expect(apiClient.put).not.toHaveBeenCalled();
    });

    it("does not make an API call when nothing is changed", async () => {
      /* Given */
      const onSave = jest.fn();
      onSave.mockReturnValueOnce({ outcome: OnSaveOutcome.NotChanged });

      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "chapter",
                parameters: ["Hello world"],
                edit: true,
                onSave,
              },
            ],
          },
        ],
      };
      const wrapper = shallowMount(Content, { props: { book } });
      await flushPromises();

      /* When */
      await wrapper.find("button[role=save]").trigger("click");
      await flushPromises();

      /* Then */
      expect(book.chapters[0].entries[0].edit).toEqual(false);
      expect(apiClient.put).not.toHaveBeenCalled();
    });

    it("makes an API call when the entry is changed", async () => {
      /* Given */
      const onSave = jest.fn();
      onSave.mockReturnValueOnce({
        outcome: OnSaveOutcome.Changed,
        entry: { type: "chapter", parameters: ["Hallo Welt"] },
      });
      mocked(apiClient.put).mockResolvedValueOnce(saveEntrySuccessfulResponse);

      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "chapter",
                parameters: ["Hello world"],
                edit: true,
                onSave,
              },
            ],
          },
        ],
      };
      const wrapper = shallowMount(Content, { props: { book } });
      await flushPromises();

      /* When */
      await wrapper.find("button[role=save]").trigger("click");
      await flushPromises();

      /* Then */
      const entry = book.chapters[0].entries[0];
      expect(entry.edit).toEqual(false);
      /* Make sure that the entry now looks like the one returned, which may be different from the one submitted.  
          After, saving, the application will read the entry back and will return this to the frontend.  Later on 
          we may validate the response and notify the user if we see any discrepancies. */
      expect(entry.parameters).toEqual(saveEntrySuccessfulResponse.data.parameters);
      expect(apiClient.put).toHaveBeenCalledTimes(1);
    });

    it("reverts to the original entry after the application returns an error", async () => {
      /* Given */
      const onSave = jest.fn();
      onSave.mockReturnValueOnce({
        outcome: OnSaveOutcome.Changed,
        entry: { type: "chapter", parameters: ["Hallo Welt"] },
      });
      mocked(apiClient.put).mockRejectedValue(networkError);
      mocked(formatError).mockReturnValue(networkError.message);

      const book = {
        chapterIndex: 0,
        chapters: [
          {
            entries: [
              {
                type: "chapter",
                parameters: ["Hello world"],
                edit: true,
                error: "",
                onSave,
              },
            ],
          },
        ],
      };
      const wrapper = shallowMount(Content, { props: { book } });
      await flushPromises();

      /* When */
      await wrapper.find("button[role=save]").trigger("click");
      await flushPromises();

      /* Then */
      const entry = book.chapters[0].entries[0];
      expect(entry.edit).toEqual(true);
      expect(entry.parameters).toEqual(["Hello world"]);
      expect(entry.error).toEqual(`Failed to save entry (${networkError.message})`);
      expect(apiClient.put).toHaveBeenCalledTimes(1);
    });
  });
});
