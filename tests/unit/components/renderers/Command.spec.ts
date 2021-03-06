import Command from "@/components/renderers/Command.vue";
import { shallowMount } from "@vue/test-utils";

describe("Command", () => {
  describe("View/Edit", () => {
    it("displays the command for an empty entry", async () => {
      /* Given */
      const entry = {
        type: "command",
      };

      /* When */
      const wrapper = shallowMount(Command, { props: { entry } });

      /* Then */
      expect(wrapper.find("div[role=workingDirectory]").exists()).toEqual(false);
      expect(wrapper.find("pre").text()).toEqual("echo 'Hello world!!'");
    });

    it("displays the command with working directory", async () => {
      /* Given */
      const entry = {
        type: "command",
        workingDirectory: "hello-world",
        parameters: ["java -jar hello-world.jar"],
      };

      /* When */
      const wrapper = shallowMount(Command, { props: { entry } });

      /* Then */
      expect(wrapper.find("div[role=workingDirectory] > code").text()).toEqual("hello-world");
      expect(wrapper.find("pre").text()).toEqual("java -jar hello-world.jar");
    });

    it("displays the command with variable values", async () => {
      /* Given */
      const entry = {
        type: "command",
        parameters: ["echo ${NAME}"],
        variables: ["NAME"],
        values: { NAME: "Albert" },
      };

      /* When */
      const wrapper = shallowMount(Command, { props: { entry } });

      /* Then */
      expect(wrapper.find("pre").text()).toEqual("echo Albert");
    });

    it("interpolates multiple instances of the same variable", async () => {
      /* Given */
      const entry = {
        type: "command",
        parameters: ["echo ${NAME} ${NAME}"],
        variables: ["NAME"],
        values: { NAME: "Albert" },
      };

      /* When */
      const wrapper = shallowMount(Command, { props: { entry } });

      /* Then */
      expect(wrapper.find("pre").text()).toEqual("echo Albert Albert");
    });

    it("interpolates multiple variables", async () => {
      /* Given */
      const entry = {
        type: "command",
        parameters: ["echo ${NAME} ${SURNAME}"],
        variables: ["NAME", "SURNAME"],
        values: { NAME: "Albert", SURNAME: "Attard" },
      };

      /* When */
      const wrapper = shallowMount(Command, { props: { entry } });

      /* Then */
      expect(wrapper.find("pre").text()).toEqual("echo Albert Attard");
    });

    it("renders the single line command", async () => {
      /* Given */
      const entry = { parameters: ['echo "Albert Attard"'] };

      /* When */
      const wrapper = shallowMount(Command, { props: { entry } });

      /* Then */
      expect(wrapper.find("pre").text()).toEqual('echo "Albert Attard"');
    });

    it("renders the multi-line command", async () => {
      /* Given */
      const entry = { parameters: ["curl \\", '  --location "https://somewhere.com/" \\', "  --output file.txt"] };

      /* When */
      const wrapper = shallowMount(Command, { props: { entry } });

      /* Then */
      expect(wrapper.find("pre").text()).toEqual(
        'curl \\\n  --location "https://somewhere.com/" \\\n  --output file.txt'
      );
    });
  });
});
