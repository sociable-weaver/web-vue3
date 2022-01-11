<template>
  <div class="app">
    <h2 role="state">{{ message }}</h2>
    <div v-if="showHelp" class="help">
      <ol>
        <li>
          <p>Make sure that you have <a href="https://www.docker.com/" target="_blank">Docker</a> installed.</p>
          <p>
            You can download Docker from <a href="https://docs.docker.com/get-docker/" target="_blank">here</a> or
            following
            <a href="https://dhwaneetbhatt.com/blog/run-docker-without-docker-desktop-on-macos" target="_blank"
              >these instructions</a
            >
            for alternative Docker installation options.
          </p>
        </li>
        <li>
          <p>
            Run the
            <a
              href="https://hub.docker.com/repository/docker/albertattard/sociable-weaver-app-java-boot"
              target="_blank"
              >Sociable Weaver Application Docker image</a
            >.
          </p>
          <pre>{{ dockerCommand }}</pre>
          <p>
            This will run the Sociable Weaver Application in a Docker container. All commands that you will run through
            the Sociable Weaver Application will not effect your computer as these are executed from within the Docker
            container. If you like to run the Sociable Weaver Application directly on your computer, you can download
            the latest version of the Java Application from
            <a href="https://github.com/sociable-weaver/app-java-boot/releases" target="_blank">here</a>, and run that
            from your computer (using the <code>java -jar sw-app.jar</code> command).
            <a href="https://www.oracle.com/java/technologies/downloads/#java17" target="_blank">Java 17</a> is
            required.
          </p>
          <p>
            The Sociable Weaver Application makes use of two directories, the <em>repositories</em> and the
            <em>workspace</em>. The <em>repositories</em> directory is the place where you have the books and blogs that
            you like to access. The <em>workspace</em> acts like the working folder. You can
            <a href="https://docs.docker.com/storage/bind-mounts/" target="_blank">mount</a> these directories and see
            the change made to the files through your favourite IDE. Note that this is optional and you don't have to
            mount these directories.
          </p>
          <pre>{{ dockerCommandWithVolumes }}</pre>
          <p>Please update the volumes' path accordingly.</p>
        </li>
        <li>
          <p>Set the Sociable Weaver Application base url <input v-model="baseUrl" /></p>
          <p>
            Note that if you are running Docker on a virtual machine or
            <a href="https://minikube.sigs.k8s.io/docs/start/" target="_blank">minikube</a>, then you need to set the IP
            address or domain name of the environment where Docker is running. I am running Docker in minikube and have
            my base url set to <code>http://docker.local:8077</code>.
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
import { apiClient, defaultBaseURL, formatError } from "@/services/ServiceApi";
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
      "  --rm \\\n" +
      "  albertattard/sociable-weaver-app-java-boot:latest\n"
    );
  }

  private get dockerCommandWithVolumes(): string {
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

  private get baseUrl(): string {
    return apiClient.defaults.baseURL || defaultBaseURL;
  }

  private set baseUrl(value: string) {
    apiClient.defaults.baseURL = value;
  }
}
</script>

<style lang="scss" scoped>
input {
  font-size: 0.8em;
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
    Courier New, monospace;
  width: 300px;
}
</style>
