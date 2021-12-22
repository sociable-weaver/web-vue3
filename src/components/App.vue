<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <div v-if="showHelp" class="help">
      <h2>Getting started</h2>
      <ol>
        <li>
          Make sure that you have Java 17 installed. You can use
          <a href="https://sdkman.io/install" target="_blank">SDKMAN</a> to install Java
        </li>
        <li>
          Download the application:
          <a
            class="download-app"
            href="https://github.com/sociable-weaver/app-java-boot/releases/download/v0.24/sw-app.jar"
            >sw-app.jar</a
          >
        </li>
        <li>
          Run the application using the following command
          <pre>$ java -jar sw-app.jar</pre>
          You can run the application from anywhere you like and you don't have to save it in a special folder.
        </li>
        <li>
          Click <a class="try-app-again" href="#" @click="checkApplicationStatus()">here</a> to check if the application
          has started correctly.
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
          ? { isRunning: true, message: "Application is running", showHelp: false }
          : { isRunning: false, message: "Application is running, but unhealthy", showHelp: false }
      )
      .catch((e) => {
        if (e?.message === "Network Error") {
          return {
            isRunning: false,
            message: "Application is not running or cannot be reached by this page",
            showHelp: true,
          };
        }
        throw e;
      });
  }
}
</script>

<style scoped lang="scss">
h1 {
  margin: 40px 0 0;
}
</style>
