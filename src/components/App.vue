<template>
  <div class="hello">
    <h1>{{ message }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import appApi from "@/services/AppApi";

export default class HelloWorld extends Vue {
  private message = "Sociable Weaver";

  mounted(): void {
    this.$nextTick(() => {
      appApi
        .isAppRunning()
        .then((running) => {
          this.message = running ? "Application is running" : "Application is not running";
        })
        .catch(() => {
          this.message = "Failed to check the application status";
        });
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  margin: 40px 0 0;
}
</style>
