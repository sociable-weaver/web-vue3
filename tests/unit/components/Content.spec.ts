import Content from "@/components/Content.vue";
import { flushPromises, mount } from "@vue/test-utils";

describe("Content component", () => {
  it("displays the chapter", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "chapter",
          parameters: ["Hello world"],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.text()).toEqual("Hello world");
  });

  it("displays the command without working directory", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "command",
          parameters: ["java", "-jar", "hello-world.jar"],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("pre").text()).toEqual("$ java -jar hello-world.jar");
  });

  it("displays the command with working directory", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "command",
          workingDirectory: "hello-world",
          parameters: ["java", "-jar", "hello-world.jar"],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("pre").text()).toEqual("hello-world $ java -jar hello-world.jar");
  });

  it("displays the create with the working directory", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "create",
          workingDirectory: "hello-world",
          parameters: ["HelloWorld", "#!/usr/bin/java --source 17"],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("div[class=filePath]").text()).toEqual(
      "Create the file: hello-world/HelloWorld, with the following contents"
    );
    expect(wrapper.find("pre[class=content]").text()).toEqual("#!/usr/bin/java --source 17");
  });

  it("displays the docker tag and push with the working directory", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "docker-tag-and-push",
          workingDirectory: "hello-world",
          parameters: ["hello-world:v8.0.4", "${DOCKER_USERNAME}/hello-world:v8.0.4"],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("pre").text()).toContain(
      "hello-world $ docker tag hello-world:v8.0.4 ${DOCKER_USERNAME}/hello-world:v8.0.4"
    );
    expect(wrapper.find("pre").text()).toContain("hello-world $ docker push ${DOCKER_USERNAME}/hello-world:v8.0.4");
  });

  it("displays the download with the working directory", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "download",
          workingDirectory: "hello-world",
          parameters: [
            "https://github.com/albertattard/programming--hello-world-jar-demo/releases/download/v1.0.0/hello-world-jar-demo.jar",
            "hello-world-jar-demo.jar",
          ],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("pre").text()).toEqual(
      "hello-world $ curl --location https://github.com/albertattard/programming--hello-world-jar-demo/releases/download/v1.0.0/hello-world-jar-demo.jar --output hello-world-jar-demo.jar"
    );
  });

  it("displays the git apply diff as HTML", async () => {
    /* Given */
    const chapter = {
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
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("div[class=d2h-wrapper]").text()).toContain("public class HelloWorld {");
  });

  it("displays the git commit changes", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "git-commit-changes",
          workingDirectory: "hello-world",
          parameters: ["Basic Java application", "v2.0.2"],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("pre").text()).toContain("hello-world $ git add .");
    expect(wrapper.find("pre").text()).toContain('hello-world $ git commit --message "Basic Java application"');
    expect(wrapper.find("pre").text()).toContain(
      'hello-world $ git tag --annotate "v2.0.2" --message "Basic Java application"'
    );
  });

  it("displays the git tag current commit", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "git-tag-current-commit",
          workingDirectory: "hello-world",
          parameters: ["v2.0.0", "Start of Basic Java Application"],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("pre").text()).toEqual(
      'hello-world $ git tag --annotate "v2.0.0" --message "Start of Basic Java Application"'
    );
  });

  it("displays the markdown as HTML", async () => {
    /* Given */
    const chapter = {
      entries: [
        {
          type: "markdown",
          parameters: ["**Hello world**"],
        },
      ],
    };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.find("strong").text()).toEqual("Hello world");
  });

  it("displays a message indicating that this type is not yet supported", async () => {
    /* Given */
    const type = "unsupported-type";
    const chapter = { entries: [{ type }] };

    /* When */
    const wrapper = mount(Content, { props: { chapter } });
    await flushPromises();

    /* Then */
    expect(wrapper.text()).toEqual(`Do not know how to renter entries of type: ${type}`);
  });
});