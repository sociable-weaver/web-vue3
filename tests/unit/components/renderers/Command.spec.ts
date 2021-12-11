import Command from "@/components/renderers/Command.vue";
import { flushPromises, shallowMount } from "@vue/test-utils";

describe("Command", () => {
  it("renders the single line command", async () => {
    /* Given */
    const entry = { parameters: ['echo "Albert Attard"'] };

    /* When */
    const wrapper = shallowMount(Command, { props: { entry } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("pre").text()).toEqual('$ echo "Albert Attard"');
  });

  it("renders the multi-line command", async () => {
    /* Given */
    const entry = { parameters: ["curl \\", '  --location "https://somewhere.com/" \\', "  --output file.txt"] };

    /* When */
    const wrapper = shallowMount(Command, { props: { entry } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("pre").text()).toEqual(
      '$ curl \\\n  --location "https://somewhere.com/" \\\n  --output file.txt'
    );
  });
});
