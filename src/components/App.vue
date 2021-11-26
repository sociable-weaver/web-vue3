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
            href="https://github.com/sociable-weaver/app-java-boot/releases/download/v0.5/sw-app.jar"
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
import { AppStatus, isAppRunning } from "@/services/AppApi";
import { Vue } from "vue-class-component";

export default class App extends Vue {
  private message = "Sociable Weaver";
  private showHelp = false;

  mounted(): void {
    this.$nextTick(() => {
      this.checkApplicationStatus();
    });
  }

  private checkApplicationStatus(): void {
    isAppRunning()
      .then((appStatus) => {
        this.updateMessage(appStatus);
      })
      .catch((e) => {
        this.message = `Failed to check the application status (${e.message})`;
      });
  }

  private updateMessage(appStatus: AppStatus): void {
    this.showHelp = false;
    switch (appStatus) {
      case AppStatus.CannotBeReached:
        this.message = "Application is not running or cannot be reached by this page";
        this.showHelp = true;
        break;
      case AppStatus.Unhealthy:
        this.message = "Application is running, but unhealthy";
        break;
      case AppStatus.Healthy:
        this.message = "Application is running";
        break;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  margin: 40px 0 0;
}
</style>
