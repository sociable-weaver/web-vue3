<template>
  <div class="hello">
    <h1>{{ message }}</h1>
  </div>
</template>

<script lang="ts">
import { AppStatus, isAppRunning } from "@/services/AppApi";
import { Vue } from "vue-class-component";

export default class HelloWorld extends Vue {
  private message = "Sociable Weaver";

  mounted(): void {
    this.$nextTick(() => {
      isAppRunning()
        .then((appStatus) => {
          this.updateMessage(appStatus);
        })
        .catch((e) => {
          this.message = `Failed to check the application status (${e.message})`;
        });
    });
  }

  private updateMessage(appStatus: AppStatus): void {
    switch (appStatus) {
      case AppStatus.CannotBeReached:
        this.message = "Application is not running";
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
