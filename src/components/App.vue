<template>
  <div class="app">
    <h2 role="state">{{ message }}</h2>
    <div v-if="showHelp" class="help">
      <h3 role="help">Getting started</h3>
      <ol>
        <li>
          <p>
            Make sure that you have <a href="https://www.docker.com/" target="_blank">Docker</a> installed. You can
            install Docker from <a href="https://docs.docker.com/get-docker/" target="_blank">here</a>.
          </p>
        </li>
        <li>
          <p>
            Run the
            <a
              href="https://hub.docker.com/repository/docker/albertattard/sociable-weaver-app-java-boot"
              target="_blank"
              >Sociable Weaver Application Docker image</a
            >
            using the following command.
          </p>
          <pre>{{ dockerCommand }}</pre>
          <p>
            This will run the Sociable Weaver Application in a Docker container. All commands that you will run through
            the Sociable Weaver Application will not effect your computer as these are executed from within the Docker
            container. If you like to run the Sociable Weaver Application directly on your computer, you can download
            the latest version of the Java Application from
            <a href="https://github.com/sociable-weaver/app-java-boot/releases" target="_blank">here</a>, and run that
            from your computer (using <code>java -jar sw-app.jar</code> command).
            <a href="https://www.oracle.com/java/technologies/downloads/#java17" target="_blank">Java 17</a> is
            required.
          </p>
          <p>
            The Docker command shown above makes use of two
            <a href="https://docs.docker.com/storage/volumes/" target="_blank">volumes</a>. While these are optional, it
            is recommended to share the <em>repositories</em> (books, blogs or tutorials) and the
            <em>workspace</em> directories with your local machine so that you can follow on and see the change made
            through your favourite IDE. Please update the volumes' path accordingly.
          </p>
        </li>
        <li>
          <p>
            Click <a class="try-app-again" href="#" @click="checkApplicationStatus()">here</a> to check if the
            application has started correctly and now reachable by this page.
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { apiClient, formatError } from "@/services/ServiceApi";
import { Options, Vue } from "vue-class-component";

interface AppStatus {
  isRunning: boolean;
  message: string;
  showHelp: boolean;
}

@Options({
  name: "App",
  emits: ["appIsRunning"],
})
export default class App extends Vue {
  private message = "Sociable Weaver";
  private showHelp = false;

  mounted(): void {
    this.$nextTick(() => {
      this.checkApplicationStatus();
    });
  }

  private checkApplicationStatus(): void {
    this.isAppRunning()
      .then((appStatus) => {
        this.message = appStatus.message;
        this.showHelp = appStatus.showHelp;
        this.$emit("appIsRunning", appStatus.isRunning);
      })
      .catch((e) => {
        this.message = `Failed to check the application status (${formatError(e)})`;
        this.showHelp = false;
        this.$emit("appIsRunning", false);
      });
  }

  private isAppRunning(): Promise<AppStatus> {
    return apiClient
      .get("/api/hello")
      .then((response) => response.status)
      .then((status) =>
        status === 200
          ? { isRunning: true, message: "The Sociable Weaver Application is running", showHelp: false }
          : {
              isRunning: false,
              message: "The Sociable Weaver Application is running, but unhealthy",
              showHelp: false,
            }
      )
      .catch((e) => {
        if (e?.message === "Network Error") {
          return {
            isRunning: false,
            message: "The Sociable Weaver Application is not running or cannot be reached by this page",
            showHelp: true,
          };
        }
        throw e;
      });
  }

  private get dockerCommand(): string {
    return (
      "docker run \\\n" +
      "  --name 'sw-app-local' \\\n" +
      "  --publish 8077:8077 \\\n" +
      '  --volume "${HOME}/sw/repositories:/opt/repositories" \\\n' +
      '  --volume "${HOME}/sw/workspace:/opt/workspace" \\\n' +
      "  --rm \\\n" +
      "  albertattard/sociable-weaver-app-java-boot:latest\n"
    );
  }
}
</script>
