<template>
  <div class="about">
    <h2>Sociable Weaver</h2>
    <p>
      As an <em>author</em> of programming blogs, or books, it is hard to make sure that the examples provided in the
      text work well. As a <em>reader</em>, it is frustrating to find halfway through that the example does not work or
      how some things ended up here and not there.
    </p>
    <p>Sociable Weaver is a platform created to solve these problems.</p>
    <h3>For the Authors</h3>
    <p>
      Blogs or books, Sociable Weaver provides a testing platform where all examples can be easily executed to make sure
      that these work as expected.
    </p>
    <h3>For the Readers</h3>
    <p>
      Sociable Weaver provides an interactive platform where all examples can be executed through the interactive web
      interface and viewed locally using the preferred IDE.
    </p>
    <h2>How does Sociable Weaver works?</h2>
    <p>
      Books, blogs or articles, contain examples that you can try. Say for an instance that the following command is
      shown.
    </p>
    <pre>echo 'Hello Sociable Weaver!!'</pre>
    <p>
      If you like to try this out, you will have to copy the example and then run it on your computer. Sociable Weaver
      takes this to the next level. It provides you with an option where you can run the command directly from your
      browser. This command is simply sent to the Sociable Weaver Application running as either a docker container on
      your computer or as a Java application. The Sociable Weaver Application will run the command, capture the output
      and then send the result back to the browser.
    </p>
    <p>
      The same command shown before is presented as shown next. A <em>Run</em> button will be shown under the command,
      which you can click to run. The command output will be printed between the command and the <em>Run</em> button.
    </p>
    <Command :entry="entry" />
    <pre v-if="entry.output" class="output" :class="{ error: entry.failed }">{{ entry.output }}</pre>
    <pre v-if="entry.error" class="error">{{ entry.error }}</pre>
    <button :disabled="disabled" @click="onRun()" class="primary" title="Run this command">Run</button>
    <p v-if="isRunning === false">
      Kindly note that The Sociable Weaver Application is not running and thus you will not be able to try the above
      example. More information about how to start the Sociable Weaver Application can be found <a href="/">here</a>.
    </p>
    <p>
      Sociable Weaver also provides a customizable experience through the use of variables. Instead of simply executing
      what you see, you can change parts of the examples using variables.
    </p>
  </div>
</template>

<script lang="ts">
import Command from "@/components/renderers/Command.vue";
import { Entry } from "@/models/Chapter";
import { runEntry, RunnableEntry } from "@/services/RunEntryService";
import { apiClient, formatError } from "@/services/ServiceApi";
import { Options, Vue } from "vue-class-component";

interface AppStatus {
  isRunning: boolean;
}

@Options({
  name: "About",
  components: {
    Command,
  },
})
export default class About extends Vue {
  private entry: Entry = About.createAboutExample();
  private disabled = false;
  private isRunning = false;

  mounted(): void {
    this.$nextTick(() => {
      this.checkApplicationStatus();
    });
  }

  private checkApplicationStatus(): void {
    this.isAppRunning()
      .then((appStatus) => {
        this.isRunning = appStatus.isRunning;
      })
      .catch((e) => {
        this.isRunning = false;
        this.entry.error = `Cannot run command (${formatError(e)})`;
      });
  }

  private isAppRunning(): Promise<AppStatus> {
    return apiClient
      .get("/api/hello")
      .then((response) => response.status)
      .then((status) => (status === 200 ? { isRunning: true } : { isRunning: false }))
      .catch((e) => {
        if (e?.message === "Network Error") {
          return { isRunning: false };
        }
        throw e;
      });
  }

  private onRun(): void {
    if (!this.isRunning) {
      this.entry.error = "Cannot run command as the Sociable Weaver Application is not running";
      return;
    }

    this.disabled = true;
    this.entry.failed = false;
    this.entry.output = "";
    this.entry.error = "";

    const runnableEntry = this.createRunnableEntry();
    runEntry(runnableEntry, (message) => (this.entry.output += message.content))
      .then((result) => {
        switch (result.content) {
          case "FINISHED_AS_EXPECTED":
          case "FINISHED_WITH_SUPPRESSED_ERROR":
            break;
          default:
            this.entry.failed = true;
        }
      })
      .catch((e) => {
        this.entry.error = `Failed to run (${formatError(e)})`;
      })
      .finally(() => (this.disabled = false));
  }

  private createRunnableEntry(): RunnableEntry {
    return {
      type: this.entry.type,
      id: this.entry.id,
      name: this.entry.name,
      workPath: "/opt/workspace",
      workingDirectory: this.entry.workingDirectory,
      parameters: Object.assign([], this.entry.parameters),
      variables: Object.assign([], this.entry.variables),
      environmentVariables: Object.assign([], this.entry.environmentVariables),
      values: Object.assign({}, this.entry.values),
      ignoreErrors: this.entry.ignoreErrors,
      pushChanges: this.entry.pushChanges,
      dryRun: this.entry.dryRun,
      expectedExitValue: this.entry.expectedExitValue,
      commandTimeout: this.entry.commandTimeout,
    };
  }

  private static createAboutExample(): Entry {
    return {
      type: "command",
      parameters: ["echo 'Hello Sociable Weaver!!'"],
    } as Entry;
  }
}
</script>
